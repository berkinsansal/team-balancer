import { Component, Input } from '@angular/core';
import { Player } from '../../models/player';
import { TeamBalancerService } from '../../services/team-balancer.service';

@Component({
    selector: 'app-players-display',
    templateUrl: './players-display.component.html',
    styleUrls: ['./players-display.component.scss']
})
export class PlayersDisplayComponent {

    @Input() players: Player[] = [];
    @Input() isSelectionEnabled = false;

    selectedPlayers: Player[] = [];
    playerProperties: string[];

    constructor(public teamBalancerService: TeamBalancerService) {
        if (this.isSelectionEnabled) {
            this.selectedPlayers = teamBalancerService.selectedPlayers;
        }
        this.playerProperties = Player.getPlayerClassAllProperties();
    }

    selectionChanged() {
        this.teamBalancerService.selectedPlayers = this.selectedPlayers;
    }

}
