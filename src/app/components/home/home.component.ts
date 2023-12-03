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

    constructor(public teamBalancerService: TeamBalancerService) {
        this.addTestPlayers(); // for development
        this.balanceTeams(); // for development
    }

    balanceTeams() {
        this.teamBalancerService.balanceTeams();
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
