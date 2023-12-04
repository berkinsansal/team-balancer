import { Component, Input, OnInit } from '@angular/core';
import { Player } from '../../models/player';
import { TeamBalancerService } from '../../services/team-balancer.service';

@Component({
    selector: 'app-players-display',
    templateUrl: './players-display.component.html',
    styleUrls: ['./players-display.component.scss']
})
export class PlayersDisplayComponent implements OnInit {

    @Input() title: string = '';
    @Input() players: Player[] = [];
    @Input() isSelectionEnabled = false;

    selectedPlayers: Player[] = [];
    playerProperties: string[];

    constructor(public teamBalancerService: TeamBalancerService) {
        this.playerProperties = Player.getPlayerClassAllProperties();
    }

    ngOnInit(): void {
        if (this.isSelectionEnabled) {
            this.selectedPlayers = this.teamBalancerService.selectedPlayers;
        }
    }

    selectionChanged() {
        this.teamBalancerService.selectedPlayers = this.selectedPlayers;
    }

}
