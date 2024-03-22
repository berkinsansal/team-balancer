import { ApplicationRef, Injectable } from '@angular/core';
import { Gender } from '../models/enums/gender.enum';
import { Player, playerLabelSkillMap, playerPropertyWeightMap } from '../models/player';
import { PlayerSelection, PlayerWithLabel } from '../models/player-with-label';

@Injectable({
    providedIn: 'root'
})
export class TeamBalancerService {
    static readonly maxSkillPoint = 10;
    static readonly labelThreshold = TeamBalancerService.maxSkillPoint * 9 / 10;

    allPlayers: Player[] = [];
    players: Player[] = [];
    selectedPlayers: Player[] = [];
    playersWithLabel: PlayerWithLabel[] = [];
    team1ByTeamSkills: Player[] = [];
    team2ByTeamSkills: Player[] = [];
    team1ByPlayerSkills: Player[] = [];
    team2ByPlayerSkills: Player[] = [];
    team1ByPlayerOverall: Player[] = [];
    team2ByPlayerOverall: Player[] = [];
    team1Manual: Player[] = [];
    team2Manual: Player[] = [];
    draggedPlayer: Player | null = null;

    constructor(private ref: ApplicationRef) { }

    initializeData() {
        this.players.length = 0;
        this.selectedPlayers.length = 0;
        this.playersWithLabel.length = 0;
        this.team1ByTeamSkills.length = 0;
        this.team2ByTeamSkills.length = 0;
        this.team1ByPlayerSkills.length = 0;
        this.team2ByPlayerSkills.length = 0;
        this.team1ByPlayerOverall.length = 0;
        this.team2ByPlayerOverall.length = 0;
        this.team1Manual.length = 0;
        this.team2Manual.length = 0;
        this.ref.tick();
    }

    // Sort players based on their skill levels
    sortPlayers(players: Player[]) {
        players.sort((a, b) => b.getPlayerOverall() - a.getPlayerOverall());
    }

    // Get player by id
    getPlayerById(id: number) {
        return this.allPlayers.find(p => p.id === id)!;
    }

    // Get player by name
    getPlayerByName(name: string) {
        return this.allPlayers.find(p => p.name === name)!;
    }

    labelPlayers() {
        this.playersWithLabel.length = 0;
        this.selectedPlayers.forEach(p => {
            for (let [label, skills] of playerLabelSkillMap) {
                const labelOverall = p.getPlayerLabelOverall(skills);
                if (labelOverall >= TeamBalancerService.labelThreshold) {
                    this.playersWithLabel.push({
                        player: p,
                        label,
                        labelOverall
                    });
                }
            }
        });
        this.playersWithLabel.sort((a, b) => a.label.localeCompare(b.label) || b.labelOverall - a.labelOverall || a.player.name.localeCompare(b.player.name));

        /*
        I have below array with player name, player label, and  label value . I am writing code with typescirpt. If possible I want to pick filter this array which returns me exactly two items per label with who is best for that label. however if someone picked for one label, he cannot be picked for another label
        */

        // This implementation ensures each player is only selected once across all labels.
        const selection: PlayerSelection = {};
        const selectedPlayers = new Set<string>();

        // Assuming you've sorted players by their label and value descendingly
        this.playersWithLabel.forEach(player => {
            if (selection[player.label]?.length >= 2 || selectedPlayers.has(player.player.name)) {
                // Skip if we already have 2 top players for this label or this player is already selected
                return;
            }

            if (!selection[player.label]) {
                selection[player.label] = [];
            }

            selection[player.label].push(player.player);
            selectedPlayers.add(player.player.name);

            return selection;
        });
    }

    // Find the most similar teams by comparing team players each skill
    balanceTeamsByTeamSkills() {
        this.emptyTeams(this.team1ByTeamSkills, this.team2ByTeamSkills);

        let bestDifference = Infinity;
        let bestTeams: [Player[], Player[]] = [[], []];

        let allTeamCombinations: Player[][] = [];
        const teamSize = Math.floor(this.selectedPlayers.length / 2);
        this.generateTeamCombinations(teamSize, 0, [], allTeamCombinations);

        // Remove teams with unbalanced genders
        const femaleCountInSelectedPlayers = this.selectedPlayers.reduce((accumulator, player) => {
            return accumulator + (player.gender === Gender.Female ? 1 : 0);
        }, 0);
        allTeamCombinations = allTeamCombinations.filter(team => {
            const femaleCountInTeam = team.reduce((accumulator, player) => {
                return accumulator + (player.gender === Gender.Female ? 1 : 0);
            }, 0);
            if (Math.floor(femaleCountInSelectedPlayers / 2) === femaleCountInTeam || Math.ceil(femaleCountInSelectedPlayers / 2) === femaleCountInTeam) {
                return true;
            }
            return false;
        });

        // Populate the map with unique combinations
        const combinationMap = new Map<string, Player[]>();
        allTeamCombinations.forEach(combination => {
            const key = combination.map(player => player.id).sort().join("-");
            combinationMap.set(key, combination);
        });

        // Iterate through the combinations to find unique pairings
        const uniquePairings: [any[], any[]][] = [];
        combinationMap.forEach((team1, key1) => {
            combinationMap.forEach((team2, key2) => {
                // Ensure the second loop starts beyond the current position of the first loop
                if (key2 <= key1) return; // Skip duplicates and self-comparisons

                const idsTeam1 = new Set(team1.map(player => player.id));
                const isUniquePair = team2.every(player => !idsTeam1.has(player.id));

                if (isUniquePair) {
                    uniquePairings.push([team1, team2]);
                }
            });
        });

        // Pair teams
        for (let i = 0; i < uniquePairings.length; i++) {
            let team1 = uniquePairings[i][0];
            let team2 = uniquePairings[i][1];

            let difference = this.calculateTeamSimilarity(team1, team2);

            if (difference < bestDifference) {
                bestDifference = difference;
                bestTeams = [team1, team2];
            }
        }

        // TODO: THIS MAKE UNBALANCED TEAMS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // add single player if selected players is odd number
        if (this.selectedPlayers.length - (bestTeams[0].length + bestTeams[1].length) === 1) {
            const bestPair: [Player, Player | undefined] = [this.selectedPlayers.find(p => !bestTeams[0].includes(p) && !bestTeams[1].includes(p))!, undefined];
            this.putBestPairPlayersToTeams(bestPair, bestTeams[0], bestTeams[1]);
        }

        this.orderTeamsBySimilarPlayers(bestTeams, this.team1ByTeamSkills, this.team2ByTeamSkills);
    }

    // Find the two most similar players by comparing 1vs1 players each skill
    balanceTeamsByPlayerSkills() {
        this.emptyTeams(this.team1ByPlayerSkills, this.team2ByPlayerSkills);

        const addedPlayers: number[] = []; // players id
        while (addedPlayers.length + 1 < this.selectedPlayers.length) { // "addedPlayers.length + 1" to handle odd number of players
            let bestPair: [Player, Player] | null = null;
            let bestScore = Number.MAX_VALUE;

            for (let i = 0; i < this.selectedPlayers.length; i++) {
                const pair1 = this.selectedPlayers[i];
                if (addedPlayers.includes(pair1.id)) {
                    continue;
                }

                for (let j = i + 1; j < this.selectedPlayers.length; j++) {
                    const pair2 = this.selectedPlayers[j];
                    if (addedPlayers.includes(pair2.id)) {
                        continue;
                    }

                    let score = this.calculatePlayerSimilarity(pair1, pair2);
                    if (score < bestScore) {
                        bestScore = score;
                        bestPair = [pair1, pair2];
                    }
                }
            }

            if (bestPair) {
                this.putBestPairPlayersToTeams(bestPair, this.team1ByPlayerSkills, this.team2ByPlayerSkills);
                addedPlayers.push(bestPair[0].id, bestPair[1].id);
            }
        }

        // add single player if selected players is odd number
        if (this.selectedPlayers.length - addedPlayers.length === 1) {
            const bestPair: [Player, Player | undefined] = [this.selectedPlayers.find(p => !addedPlayers.includes(p.id))!, undefined];
            this.putBestPairPlayersToTeams(bestPair, this.team1ByPlayerSkills, this.team2ByPlayerSkills);
        }
    }

    // Put one by one each sorted player according to their overall 
    balanceTeamsByPlayerOverall() {
        this.emptyTeams(this.team1ByPlayerOverall, this.team2ByPlayerOverall);
        this.sortPlayers(this.selectedPlayers);

        for (let i = 0; i < this.selectedPlayers.length / 2; i++) {
            const bestPair: [Player, Player | undefined] = [this.selectedPlayers[i * 2], this.selectedPlayers[i * 2 + 1]];
            this.putBestPairPlayersToTeams(bestPair, this.team1ByPlayerOverall, this.team2ByPlayerOverall);
        }
    }

    // After balancing teams by team skills, copy players into manual teams
    initializeManualTeams() {
        this.emptyTeams(this.team1Manual, this.team2Manual);
        this.team1Manual.push(...this.team1ByTeamSkills);
        this.team2Manual.push(...this.team2ByTeamSkills);
    }

    // Swap player from one team to another team
    swapPlayer(player: Player) {
        let toBeRemovedTeam: Player[];
        let toBeMovedTeam: Player[];
        if (this.team1Manual.includes(player)) {
            toBeRemovedTeam = this.team1Manual;
            toBeMovedTeam = this.team2Manual;
        } else {
            toBeRemovedTeam = this.team2Manual;
            toBeMovedTeam = this.team1Manual;
        }

        toBeRemovedTeam.splice(toBeRemovedTeam.indexOf(player), 1);
        toBeMovedTeam.push(player);

        const teams: [Player[], Player[]] = [[...this.team1Manual], [...this.team2Manual]];
        this.emptyTeams(this.team1Manual, this.team2Manual);
        this.orderTeamsBySimilarPlayers(teams, this.team1Manual, this.team2Manual);
    }

    // Empty given teams
    private emptyTeams(team1: Player[], team2: Player[]) {
        team1.length = 0;
        team2.length = 0;
        this.ref.tick();
    }

    // Generate team combinations from selected players
    private generateTeamCombinations(teamSize: number, startIndex: number, currentCombination: Player[], allCombinations: Player[][]) {
        if (currentCombination.length === teamSize) {
            allCombinations.push([...currentCombination]);
            return;
        }

        for (let i = startIndex; i < this.selectedPlayers.length; i++) {
            currentCombination.push(this.selectedPlayers[i]);
            this.generateTeamCombinations(teamSize, i + 1, currentCombination, allCombinations);
            currentCombination.pop();
        }
    }

    // Calculate the similarity between two teams
    private calculateTeamSimilarity(team1: Player[], team2: Player[]): number {
        const skillList = Player.getPlayerClassSkillProperties();

        let similarity = 0;
        skillList.forEach(skill => {
            similarity += Math.abs(team1.reduce((acc, p) => acc + p.getSkillValue(skill as keyof Player), 0) - team2.reduce((acc, p) => acc + p.getSkillValue(skill as keyof Player), 0)) * (playerPropertyWeightMap.get(skill) ?? 1);
        });
        similarity += Math.abs(team1.reduce((acc, p) => acc + p.getPlayerOverall(), 0) - team2.reduce((acc, p) => acc + p.getPlayerOverall(), 0)) * (playerPropertyWeightMap.get('overall') ?? 1);

        // Aggregate the similarity scores (lower is more similar)
        return similarity;
    }

    // Calculate the similarity between two players
    private calculatePlayerSimilarity(player1: Player, player2: Player): number {
        const skillList = Player.getPlayerClassSkillProperties();

        let similarity = 0;
        similarity += (player1.gender === player2.gender ? 0 : 10) * (playerPropertyWeightMap.get('gender') ?? 1);
        skillList.forEach(skill => {
            similarity += Math.abs(player1.getSkillValue(skill as keyof Player) - player2.getSkillValue(skill as keyof Player)) * (playerPropertyWeightMap.get(skill) ?? 1);
        });

        // Aggregate the similarity scores (lower is more similar)
        return similarity;
    }

    private putBestPairPlayersToTeams(bestPair: [Player, Player | undefined] | null, team1: Player[], team2: Player[]) {
        if (bestPair) {
            const team1overall = Player.getTeamOverall(team1);
            const team2overall = Player.getTeamOverall(team2);
            const betterTeam = team1overall > team2overall ? team1 : team2;
            const worseTeam = team1overall > team2overall ? team2 : team1;
            if (bestPair[0] && bestPair[1]) {
                const player1overall = bestPair[0].getPlayerOverall();
                const player2overall = bestPair[1].getPlayerOverall();
                const betterPlayer = player1overall >= player2overall ? bestPair[0] : bestPair[1];
                const worsePlayer = player1overall >= player2overall ? bestPair[1] : bestPair[0];
                worseTeam.push(betterPlayer);
                betterTeam.push(worsePlayer);
            } else {
                const singlePlayer = bestPair[0] ?? bestPair[1];
                worseTeam.push(singlePlayer);
            }
        }
    }

    // Generator function to generate players combinations from all players
    // For example: if you have 13 players but you want to choose combinations of 12 (k = 12)
    private * getSelectedPlayersCombinations<T>(elements: T[], k: number): IterableIterator<T[]> {
        if (k > elements.length || k <= 0) {
            yield [];
        } else if (k === elements.length) {
            yield elements.slice();
        } else if (k === 1) {
            for (let i = 0; i < elements.length; i++) {
                yield [elements[i]];
            }
        } else {
            for (let i = 0; i < elements.length - k + 1; i++) {
                let head = elements.slice(i, i + 1);
                let tailcombs = this.getSelectedPlayersCombinations(elements.slice(i + 1), k - 1);
                for (let tail of tailcombs) {
                    yield head.concat(tail);
                }
            }
        }

        // USAGE:
        /*
        const selectedPlayersCombinations = this.getSelectedPlayersCombinations<Player>(this.selectedPlayers, 12)
        for (let selectedPlayersCombination of selectedPlayersCombinations) {
            // balance teams from player
        }
        */

    }

    // Order team players according to similar player in opponent team
    // Note: team1 and team2 should be empty, teams should hold players
    private orderTeamsBySimilarPlayers(teams: [Player[], Player[]], team1: Player[], team2: Player[]) {
        const minTeamSize = Math.min(teams[0].length, teams[1].length);
        const addedPlayers: number[] = []; // players id
        while (addedPlayers.length < minTeamSize * 2) {
            let bestPair: [Player, Player] | null = null;
            let bestScore = Number.MAX_VALUE;

            for (let i = 0; i < teams[0].length; i++) {
                const pair1 = teams[0][i];
                if (addedPlayers.includes(pair1.id)) {
                    continue;
                }

                for (let j = 0; j < teams[1].length; j++) {
                    const pair2 = teams[1][j];
                    if (addedPlayers.includes(pair2.id)) {
                        continue;
                    }

                    let score = this.calculatePlayerSimilarity(pair1, pair2);
                    if (score < bestScore) {
                        bestScore = score;
                        bestPair = [pair1, pair2];
                    }
                }
            }

            if (bestPair) {
                team1.push(bestPair[0]);
                team2.push(bestPair[1]);
                addedPlayers.push(bestPair[0].id, bestPair[1].id);
            }
        }

        if (teams[0].length !== teams[1].length) {
            let biggerTeam: Player[];
            let biggerTeamToBeFilled: Player[];
            if (teams[0].length > teams[1].length) {
                biggerTeam = teams[0];
                biggerTeamToBeFilled = team1;
            } else {
                biggerTeam = teams[1];
                biggerTeamToBeFilled = team2;
            }
            biggerTeam.forEach(p => {
                if (!biggerTeamToBeFilled.includes(p)) {
                    biggerTeamToBeFilled.push(p);
                }
            });
        }
    }
}
