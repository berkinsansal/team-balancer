import { Component, Input } from '@angular/core';
import { Player } from '../../models/player';

@Component({
    selector: 'app-team-display',
    templateUrl: './team-display.component.html',
    styleUrls: ['./team-display.component.scss']
})
export class TeamDisplayComponent {
    @Input() teamTitle: string = 'Team';
    @Input() team: Player[] = [];
    @Input() dragDropDisabled = true;

}
