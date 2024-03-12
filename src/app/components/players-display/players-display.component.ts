import { Component, Input, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Player } from '../../models/player';
import { TeamBalancerService } from '../../services/team-balancer.service';

@Component({
    selector: 'app-players-display',
    templateUrl: './players-display.component.html',
    styleUrls: ['./players-display.component.scss']
})
export class PlayersDisplayComponent implements OnInit {

    @Input() header: string = '';
    @Input() players: Player[] = [];
    @Input() isAllPlayersTable = false;
    @Input() showSkills = true;
    @Input() dragDropDisabled = true;

    selectedPlayer: Player | null = null;
    selectedPlayers: Player[] = [];
    skillList: string[];
    playerInputVisible: boolean = false;

    constructor(private teamBalancerService: TeamBalancerService) {
        this.skillList = Player.getPlayerClassSkillProperties();
    }

    ngOnInit(): void {
        if (this.isAllPlayersTable) {
            this.selectedPlayers = this.teamBalancerService.selectedPlayers;
        }
    }

    selectionChanged() {
        this.teamBalancerService.selectedPlayers = this.selectedPlayers;
    }

    filterPlayers(table: Table, input: EventTarget | null) {
        if (input) {
            table.filterGlobal((input as HTMLInputElement).value, 'contains');
        }
    }

    clearFilter(table: Table, input: HTMLInputElement) {
        table.clear();
        input.value = '';
    }

    showPlayerInputDialog(player: Player | null) {
        this.selectedPlayer = player;
        this.playerInputVisible = true;
    }

    playerUpdated(player: Player | null) {
        this.playerInputVisible = false;
    }

    dragPlayerStart(player: Player) {
        this.teamBalancerService.draggedPlayer = player;
    }

    dragPlayerEnd() {
        this.teamBalancerService.draggedPlayer = null;
    }

    dropPlayer() {
        const player = this.teamBalancerService.draggedPlayer;
        if (player && !this.players.includes(player)) {
            this.teamBalancerService.swapPlayer(player);
        }
    }

}
