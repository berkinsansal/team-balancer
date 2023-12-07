import { Injectable } from '@angular/core';
import { Player, playerPropertyWeightMap } from '../models/player';

@Injectable({
    providedIn: 'root'
})
export class TeamBalancerService {
    players: Player[] = [];
    selectedPlayers: Player[] = [];
    team1: Player[] = [];
    team2: Player[] = [];

    constructor() { }

    // Sort players based on their skill levels
    sortPlayers() {
        this.players.sort((a, b) => this.calculateSkillLevel(b) - this.calculateSkillLevel(a));
    }

    // Find the two most similar players and put them each team
    balanceTeams() {
        // Split into two teams
        this.team1 = [];
        this.team2 = [];

        const remainingPlayers = this.selectedPlayers.map(p => Object.assign({}, p));

        while (remainingPlayers.length >= 2) {
            let bestPair: [Player, Player] | null = null;
            let bestPairIndex: [number, number] | null = null;
            let bestScore = Number.MAX_VALUE;
    
            for (let i = 0; i < remainingPlayers.length; i++) {
                for (let j = i + 1; j < remainingPlayers.length; j++) {
                    let score = this.calculateSimilarity(remainingPlayers[i], remainingPlayers[j]);
                    if (score < bestScore) {
                        bestScore = score;
                        bestPair = [remainingPlayers[i], remainingPlayers[j]];
                        bestPairIndex = [i, j];
                    }
                }
            }

            if (bestPair && bestPairIndex) {
                const player1overall = Player.getPlayerOverall(bestPair[0]);
                const player2overall = Player.getPlayerOverall(bestPair[1]);
                const betterPlayer = player1overall > player2overall ? bestPair[0] : bestPair[1];
                const worsePlayer = player1overall > player2overall ? bestPair[1] : bestPair[0];
                const team1overall = Player.getTeamOverall(this.team1);
                const team2overall = Player.getTeamOverall(this.team2);
                const betterTeam = team1overall > team2overall ? this.team1 : this.team2;
                const worseTeam = team1overall > team2overall ? this.team2 : this.team1;
                worseTeam.push(betterPlayer);
                betterTeam.push(worsePlayer);
                
                remainingPlayers.splice(bestPairIndex[1], 1);
                remainingPlayers.splice(bestPairIndex[0], 1);
            }
        }

        if (remainingPlayers.length === 1) {
            // TODO: TO BE IMPLEMENTED
            // add to weak team!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            /////////////////////////////////
        }
    }

    private calculateSkillLevel(player: Player): number {
        // Implement the logic to calculate the player's overall skill level
        // For example, a simple average of the skills:
        return Player.getPlayerOverall(player);
    }

    // Function to calculate the similarity between two players
    private calculateSimilarity(player1: Player, player2: Player): number {
        const skillList = Player.getPlayerClassSkillProperties();

        let similarity = 0;
        similarity += (player1.gender === player2.gender ? 0 : 10) * (playerPropertyWeightMap.get('gender') ?? 0);
        skillList.forEach(skill => {
            similarity += Math.abs((player1[skill as keyof Player] as number) - (player2[skill as keyof Player] as number)) * (playerPropertyWeightMap.get(skill) ?? 0);
        });

        // Aggregate the similarity scores (lower is more similar)
        return similarity;
    }

    // OLD CALCULATION
    balanceTeamsOLD() {
        // Split into two teams
        this.team1 = [];
        this.team2 = [];

        for (let i = 0; i < this.selectedPlayers.length / 2; i++) {
            if (i % 2 === 0) {
                // one round put better player to team 1
                this.team1.push(this.selectedPlayers[i * 2]);
                if (i + 1 < this.selectedPlayers.length) {
                    this.team2.push(this.selectedPlayers[i * 2 + 1]);
                }
            } else {
                // other round put better player to team 2
                this.team2.push(this.selectedPlayers[i * 2]);
                if (i + 1 < this.selectedPlayers.length) {
                    this.team1.push(this.selectedPlayers[i * 2 + 1]);
                }
            }
        }
    }
}
