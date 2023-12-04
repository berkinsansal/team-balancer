import { Component } from '@angular/core';
import { Gender } from '../../models/enums/gender.enum';
import { Player } from '../../models/player';
import { TeamBalancerService } from '../../services/team-balancer.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    readonly totalPlayerCount = 12;

    constructor(public teamBalancerService: TeamBalancerService) {
        this.addTestPlayers(); // for development
        this.initialSetup();
        this.balanceTeams(); // for development
    }

    initialSetup() {
        this.teamBalancerService.sortPlayers();
        this.teamBalancerService.selectedPlayers = this.teamBalancerService.players.slice(0, this.teamBalancerService.players.length >= this.totalPlayerCount ? this.totalPlayerCount : this.teamBalancerService.players.length);
    }

    balanceTeams() {
        this.teamBalancerService.balanceTeams();
    }

    balanceTeamsOLD() {
        this.teamBalancerService.balanceTeamsOLD();
    }

    addTestPlayers() {
        this.teamBalancerService.players.push(new Player(
            'Player 1',
            Gender.Female,
            1,
            1,
            1,
            1,
        ));

        this.teamBalancerService.players.push(new Player(
            'Player 10',
            Gender.Female,
            10,
            10,
            10,
            10,
        ));

        this.teamBalancerService.players.push(new Player(
            'Player 3',
            Gender.Male,
            3,
            3,
            3,
            3,
        ));

        this.teamBalancerService.players.push(new Player(
            'Player 8',
            Gender.Male,
            8,
            8,
            8,
            8,
        ));

        this.teamBalancerService.players.push(new Player(
            'Player 5',
            Gender.Male,
            5,
            5,
            5,
            5,
        ));

        this.teamBalancerService.players.push(new Player(
            'Player 6',
            Gender.Male,
            6,
            6,
            6,
            6,
        ));

        this.teamBalancerService.players.push(new Player(
            'Player 3',
            Gender.Male,
            3,
            3,
            3,
            3,
        ));

        this.teamBalancerService.players.push(new Player(
            'Player 4',
            Gender.Male,
            4,
            4,
            4,
            4,
        ));
    }

}
