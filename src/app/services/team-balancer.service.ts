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

    balanceTeams() {
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

    private calculateSkillLevel(player: Player): number {
        // Implement the logic to calculate the player's overall skill level
        // For example, a simple average of the skills:
        return player.overall;
    }
}
