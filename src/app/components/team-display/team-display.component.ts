import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Player } from '../../models/player';

@Component({
    selector: 'app-team-display',
    templateUrl: './team-display.component.html',
    styleUrls: ['./team-display.component.scss']
})
export class TeamDisplayComponent implements OnChanges {
    @Input() teamTitle: string = 'Team';
    @Input() teamPlayers: Player[] = [];

    teamOverall = 0; // 0-10

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['teamPlayers']) {
            this.calculateTeamOverall();
        }
    }

    calculateTeamOverall() {
        this.teamOverall = this.teamPlayers.reduce((accumulator, player) => {
            return accumulator + player.overall;
        }, 0) / this.teamPlayers.length;
    }

}