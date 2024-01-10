import { Component, Input } from '@angular/core';
import { Player } from '../../models/player';

@Component({
    selector: 'app-teams-display',
    templateUrl: './teams-display.component.html',
    styleUrls: ['./teams-display.component.scss']
})
export class TeamsDisplayComponent {
    @Input() caption: string = '';
    @Input() header: string = '';
    @Input() team1Title: string = 'Team 1';
    @Input() team2Title: string = 'Team 2';
    @Input() team1: Player[] = [];
    @Input() team2: Player[] = [];

}
