import { Injectable } from '@angular/core';
import { Player } from '../models/player';

@Injectable({
    providedIn: 'root'
})
export class TeamBalancerService {
    players: Player[] = [];
    team1: Player[] = [];
    team2: Player[] = [];

    constructor() { }

    // Find the two most similar players and put them each team
    balanceTeams() {
        // Sort players based on their skill levels
        this.players.sort((a, b) => this.calculateSkillLevel(b) - this.calculateSkillLevel(a));

        // Split into two teams
        this.team1 = [];
        this.team2 = [];

        const remainingPlayers = this.players.map(p => Object.assign({}, p));

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
                const betterPlayer = bestPair[0].overall > bestPair[1].overall ? bestPair[0] : bestPair[1];
                const otherPlayer = bestPair[0].overall > bestPair[1].overall ? bestPair[1] : bestPair[0];
                if (this.team1.length % 2 === 0) {
                    this.team1.push(betterPlayer);
                    this.team2.push(otherPlayer);
                } else {
                    this.team2.push(betterPlayer);
                    this.team1.push(otherPlayer);
                }
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
        return player.overall;
    }

    // Function to calculate the similarity between two players
    private calculateSimilarity(player1: Player, player2: Player): number {
        const skillList = Player.getPlayerClassSkillProperties();

        let similarity = 0;
        similarity += player1.gender === player2.gender ? 0 : 10;
        skillList.forEach(skill => {
            similarity += Math.abs((player1[skill as keyof Player] as number) - (player2[skill as keyof Player] as number));
        });

        // Aggregate the similarity scores (lower is more similar)
        return similarity;
    }

    // OLD CALCULATION
    balanceTeamsOLD() {
        // Sort players based on their skill levels
        this.players.sort((a, b) => this.calculateSkillLevel(b) - this.calculateSkillLevel(a));

        // Split into two teams
        this.team1 = [];
        this.team2 = [];

        for (let i = 0; i < this.players.length / 2; i++) {
            if (i % 2 === 0) {
                // one round put better player to team 1
                this.team1.push(this.players[i * 2]);
                if (i + 1 < this.players.length) {
                    this.team2.push(this.players[i * 2 + 1]);
                }
            } else {
                // other round put better player to team 2
                this.team2.push(this.players[i * 2]);
                if (i + 1 < this.players.length) {
                    this.team1.push(this.players[i * 2 + 1]);
                }
            }
        }
    }
}
