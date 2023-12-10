import { ApplicationRef, Injectable } from '@angular/core';
import { Gender } from '../models/enums/gender.enum';
import { Player, playerPropertyWeightMap } from '../models/player';

@Injectable({
    providedIn: 'root'
})
export class TeamBalancerService {
    players: Player[] = [];
    selectedPlayers: Player[] = [];
    team1ByTeamSkills: Player[] = [];
    team2ByTeamSkills: Player[] = [];
    team1ByPlayerSkills: Player[] = [];
    team2ByPlayerSkills: Player[] = [];
    team1ByPlayerOverall: Player[] = [];
    team2ByPlayerOverall: Player[] = [];

    constructor(private ref: ApplicationRef) { }

    // Sort players based on their skill levels
    sortPlayers(players: Player[]) {
        players.sort((a, b) => Player.getPlayerOverall(b) - Player.getPlayerOverall(a));
    }

    // Find the most similar teams by comparing 6vs6 players each skill
    balanceTeamsBy6vs6() {
        this.emptyTeams(this.team1ByTeamSkills, this.team2ByTeamSkills);

        let bestDifference = Infinity;
        let bestTeams: [Player[], Player[]] = [[], []];

        const allTeamCombinations: Player[][] = [];
        this.generateTeamCombinations(Math.floor(this.selectedPlayers.length / 2), 0, [], allTeamCombinations);

        const combinationMap = new Map<string, Player[]>();

        // Populate the map with unique combinations
        allTeamCombinations.forEach(combination => {
            const key = combination.map(player => player.id).sort().join("-");
            combinationMap.set(key, combination);
        });

        // Iterate through the combinations to find unique pairings
        const uniquePairings: [any[], any[]][] = [];

        combinationMap.forEach((teamA, keyA) => {
            combinationMap.forEach((teamB, keyB) => {
                if (keyA === keyB) return; // Skip if it's the same team

                const idsTeamA = new Set(teamA.map(player => player.id));
                const isUniquePair = teamB.every(player => !idsTeamA.has(player.id));

                if (isUniquePair) {
                    uniquePairings.push([teamA, teamB]);
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

        this.team1ByTeamSkills.push(...bestTeams[0]);
        this.team2ByTeamSkills.push(...bestTeams[1]);

        // add single player if selected players is odd number
        if (this.selectedPlayers.length - (this.team1ByTeamSkills.length + this.team2ByTeamSkills.length) === 1) {
            const bestPair: [Player, Player | undefined] = [this.selectedPlayers.find(p => !this.team1ByTeamSkills.includes(p) && !this.team2ByTeamSkills.includes(p))!, undefined];
            this.putBestPairPlayersToTeams(bestPair, this.team1ByTeamSkills, this.team2ByTeamSkills);
        }
    }

    // Find the two most similar players by comparing 1vs1 players each skill
    balanceTeamsBy1vs1() {
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
    balanceTeamsByOverall() {
        this.emptyTeams(this.team1ByPlayerOverall, this.team2ByPlayerOverall);
        this.sortPlayers(this.selectedPlayers);

        for (let i = 0; i < this.selectedPlayers.length / 2; i++) {
            const bestPair: [Player, Player | undefined] = [this.selectedPlayers[i * 2], this.selectedPlayers[i * 2 + 1]];
            this.putBestPairPlayersToTeams(bestPair, this.team1ByPlayerOverall, this.team2ByPlayerOverall);
        }
    }

    // Empty teams
    private emptyTeams(team1: Player[], team2: Player[]) {
        team1.splice(0, team1.length);
        team2.splice(0, team2.length);
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
        similarity += Math.abs(team1.reduce((acc, p) => acc + p.gender === Gender.Male ? 20 : 10, 0) - team2.reduce((acc, p) => acc + p.gender === Gender.Male ? 20 : 10, 0)) * (playerPropertyWeightMap.get('gender') ?? 0);
        skillList.forEach(skill => {
            similarity += Math.abs(team1.reduce((acc, p) => acc + (p[skill as keyof Player] as number), 0) - team2.reduce((acc, p) => acc + (p[skill as keyof Player] as number), 0)) * (playerPropertyWeightMap.get(skill) ?? 0);
        });
        similarity += Math.abs(team1.reduce((acc, p) => acc + Player.getPlayerOverall(p), 0) - team2.reduce((acc, p) => acc + Player.getPlayerOverall(p), 0)) * (playerPropertyWeightMap.get('overall') ?? 0);

        // Aggregate the similarity scores (lower is more similar)
        return similarity;
    }

    // Calculate the similarity between two players
    private calculatePlayerSimilarity(player1: Player, player2: Player): number {
        const skillList = Player.getPlayerClassSkillProperties();

        let similarity = 0;
        similarity += (player1.gender === player2.gender ? 0 : 10) * (playerPropertyWeightMap.get('gender') ?? 0);
        skillList.forEach(skill => {
            similarity += Math.abs((player1[skill as keyof Player] as number) - (player2[skill as keyof Player] as number)) * (playerPropertyWeightMap.get(skill) ?? 0);
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
                const player1overall = Player.getPlayerOverall(bestPair[0]);
                const player2overall = Player.getPlayerOverall(bestPair[1]);
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
}
