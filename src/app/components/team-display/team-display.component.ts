import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Player } from '../../models/player';

@Component({
    selector: 'app-team-display',
    templateUrl: './team-display.component.html',
    styleUrls: ['./team-display.component.scss']
})
export class TeamDisplayComponent implements OnChanges {
    @Input() teamTitle: string = 'Team';
    @Input() team: Player[] = [];

    teamTitleWithOverall = this.teamTitle;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['team']) {
            const teamOverall = Number(Player.getTeamOverall(this.team).toFixed(2));
            this.teamTitleWithOverall = this.teamTitle + ' (' + teamOverall + ')';
        }
    }

}
