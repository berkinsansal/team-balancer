import { ApplicationRef, Injectable } from '@angular/core';
import { Gender } from '../models/enums/gender.enum';
import { Player, playerPropertyWeightMap } from '../models/player';

@Injectable({
    providedIn: 'root'
})
export class TeamBalancerService {
    players: Player[] = [];
    selectedPlayers: Player[] = [];
    team1By6: Player[] = [];
    team2By6: Player[] = [];
    team1By1: Player[] = [];
    team2By1: Player[] = [];
    team1ByOverall: Player[] = [];
    team2ByOverall: Player[] = [];

    constructor(private ref: ApplicationRef) { }

    // Sort players based on their skill levels
    sortPlayers() {
        this.players.sort((a, b) => Player.getPlayerOverall(b) - Player.getPlayerOverall(a));
    }

    // Find the most similar teams by comparing 6vs6 players each skill
    balanceTeamsBy6vs6() {
        this.emptyTeams(this.team1By6, this.team2By6);

        function* combinations<T>(elements: T[], k: number): IterableIterator<T[]> {
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
                    let tailcombs = combinations(elements.slice(i + 1), k - 1);
                    for (let tail of tailcombs) {
                        yield head.concat(tail);
                    }
                }
            }
        }

        let bestDifference = Infinity;
        let bestTeams: [Player[], Player[]] = [[], []];

        for (let playerCombination of combinations<Player>(this.selectedPlayers, 12)) {
            for (let i = 0; i < playerCombination.length; i++) {
                for (let j = i + 1; j < playerCombination.length; j++) {
                    for (let k = j + 1; k < playerCombination.length; k++) {
                        for (let l = k + 1; l < playerCombination.length; l++) {
                            for (let m = l + 1; m < playerCombination.length; m++) {
                                for (let n = m + 1; n < playerCombination.length; n++) {
                                    let team1 = [playerCombination[i], playerCombination[j], playerCombination[k], playerCombination[l], playerCombination[m], playerCombination[n]];
                                    let team2 = playerCombination.filter(p => p !== playerCombination[i] && p !== playerCombination[j] && p !== playerCombination[k] && p !== playerCombination[l] && p !== playerCombination[m] && p !== playerCombination[n]);

                                    let difference = this.calculateTeamSimilarity(team1, team2);

                                    if (difference < bestDifference) {
                                        bestDifference = difference;
                                        bestTeams = [team1, team2];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        this.team1By6.push(...bestTeams[0]);
        this.team2By6.push(...bestTeams[1]);
    }

    // Find the two most similar players by comparing 1vs1 players each skill
    balanceTeamsBy1vs1() {
        this.emptyTeams(this.team1By1, this.team2By1);

        const remainingPlayers = this.selectedPlayers.map(p => Object.assign({}, p));
        while (remainingPlayers.length >= 2) {
        // if (remainingPlayers.length === 2) {
            let bestPair: [Player, Player] | null = null;
            let bestPairIndex: [number, number] | null = null;
            let bestScore = Number.MAX_VALUE;

            for (let i = 0; i < remainingPlayers.length; i++) {
                for (let j = i + 1; j < remainingPlayers.length; j++) {
                    let score = this.calculatePlayerSimilarity(remainingPlayers[i], remainingPlayers[j]);
                    if (score < bestScore) {
                        bestScore = score;
                        bestPair = [remainingPlayers[i], remainingPlayers[j]];
                        bestPairIndex = [i, j];
                    }
                }
            }

            /// bunu 6vs 6 olarak yapabilir miyiz
            if (bestPair && bestPairIndex) {
                const player1overall = Player.getPlayerOverall(bestPair[0]);
                const player2overall = Player.getPlayerOverall(bestPair[1]);
                const betterPlayer = player1overall > player2overall ? bestPair[0] : bestPair[1];
                const worsePlayer = player1overall > player2overall ? bestPair[1] : bestPair[0];
                const team1overall = Player.getTeamOverall(this.team1By1);
                const team2overall = Player.getTeamOverall(this.team2By1);
                const betterTeam = team1overall > team2overall ? this.team1By1 : this.team2By1;
                const worseTeam = team1overall > team2overall ? this.team2By1 : this.team1By1;
                worseTeam.push(betterPlayer);
                betterTeam.push(worsePlayer);

                remainingPlayers.splice(bestPairIndex[1], 1);
                remainingPlayers.splice(bestPairIndex[0], 1);
            }
        }

        if (remainingPlayers.length === 1) {
            const team1overall = Player.getTeamOverall(this.team1By1);
            const team2overall = Player.getTeamOverall(this.team2By1);
            const worseTeam = team1overall > team2overall ? this.team2By1 : this.team1By1;
            worseTeam.push(remainingPlayers[0]);
        }
    }

    // Put one by one each sorted player according to their overall 
    balanceTeamsByOverall() {
        this.emptyTeams(this.team1ByOverall, this.team2ByOverall);

        for (let i = 0; i < this.selectedPlayers.length / 2; i++) {
            if (i % 2 === 0) {
                // one round put better player to team 1
                this.team1ByOverall.push(this.selectedPlayers[i * 2]);
                if (i + 1 < this.selectedPlayers.length) {
                    this.team2ByOverall.push(this.selectedPlayers[i * 2 + 1]);
                }
            } else {
                // other round put better player to team 2
                this.team2ByOverall.push(this.selectedPlayers[i * 2]);
                if (i + 1 < this.selectedPlayers.length) {
                    this.team1ByOverall.push(this.selectedPlayers[i * 2 + 1]);
                }
            }
        }
    }

    // Empty teams
    private emptyTeams(team1: Player[], team2: Player[]) {
        team1.splice(0, team1.length);
        team2.splice(0, team2.length);
        this.ref.tick();
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
}
