import { Injectable } from '@angular/core';
import { Player } from '../models/player';

@Injectable({
    providedIn: 'root'
})
export class TeamBalancerService {

    constructor() { }

    balanceTeams(players: Player[]): [Player[], Player[]] {
        // Sort players based on their skill levels
        players.sort((a, b) => this.calculateSkillLevel(b) - this.calculateSkillLevel(a));

        // Split into two teams
        const team1: Player[] = [];
        const team2: Player[] = [];

        for (let i = 0; i < players.length / 2; i++) {
            if (i % 2 === 0) {
                // one round put better player to team 1
                team1.push(players[i * 2]);
                if (i + 1 < players.length) {
                    team2.push(players[i * 2 + 1]);
                }
            } else {
                // other round put better player to team 2
                team2.push(players[i * 2]);
                if (i + 1 < players.length) {
                    team1.push(players[i * 2 + 1]);
                }
            }
        }

        return [team1, team2];
    }

    private calculateSkillLevel(player: Player): number {
        // Implement the logic to calculate the player's overall skill level
        // For example, a simple average of the skills:
        return (player.serving + player.hitting + player.blocking + player.defense) / 4;
    }
}
