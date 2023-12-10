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

    allPlayers: Player[] = [];
    team1By6: Player[] = [];
    team2By6: Player[] = [];
    team1By1: Player[] = [];
    team2By1: Player[] = [];
    team1ByOverall: Player[] = [];
    team2ByOverall: Player[] = [];

    constructor(public teamBalancerService: TeamBalancerService) {
        this.addTestPlayers(); // for development
        this.initialSetup();
        this.balanceTeamsByAll(); // for development
    }

    initialSetup() {
        this.allPlayers = this.teamBalancerService.players;
        this.team1By6 = this.teamBalancerService.team1By6;
        this.team2By6 = this.teamBalancerService.team2By6;
        this.team1By1 = this.teamBalancerService.team1By1;
        this.team2By1 = this.teamBalancerService.team2By1;
        this.team1ByOverall = this.teamBalancerService.team1ByOverall;
        this.team2ByOverall = this.teamBalancerService.team2ByOverall;
        this.teamBalancerService.sortPlayers(this.teamBalancerService.players);
        this.teamBalancerService.selectedPlayers = this.teamBalancerService.players.slice(0, this.teamBalancerService.players.length >= this.totalPlayerCount ? this.totalPlayerCount : this.teamBalancerService.players.length);
    }

    balanceTeamsByAll() {
        this.teamBalancerService.balanceTeamsBy6vs6();
        this.teamBalancerService.balanceTeamsBy1vs1();
        this.teamBalancerService.balanceTeamsByOverall();
    }

    balanceTeamsBy6vs6() {
        this.teamBalancerService.balanceTeamsBy6vs6();
    }

    balanceTeamsBy1vs1() {
        this.teamBalancerService.balanceTeamsBy1vs1();
    }

    balanceTeamsByOverall() {
        this.teamBalancerService.balanceTeamsByOverall();
    }

    addTestPlayers() {
        this.teamBalancerService.players.push(new Player(
            'Berkin',
            Gender.Male,
            8,
            8,
            8,
            8,
            7,
        ));

        this.teamBalancerService.players.push(new Player(
            'Ayça',
            Gender.Female,
            6,
            6,
            6,
            9,
            8,
        ));

        this.teamBalancerService.players.push(new Player(
            'Barış',
            Gender.Male,
            10,
            10,
            10,
            10,
            10,
        ));

        this.teamBalancerService.players.push(new Player(
            'Begüm',
            Gender.Female,
            9,
            9,
            2,
            10,
            10,
        ));

        this.teamBalancerService.players.push(new Player(
            'Şeyda',
            Gender.Female,
            6,
            6,
            8,
            6,
            7,
        ));

        this.teamBalancerService.players.push(new Player(
            'Burçe',
            Gender.Female,
            8,
            8,
            0,
            10,
            10,
        ));

        this.teamBalancerService.players.push(new Player(
            'Emre',
            Gender.Male,
            10,
            10,
            10,
            10,
            10,
        ));

        this.teamBalancerService.players.push(new Player(
            'Ozan',
            Gender.Male,
            10,
            10,
            10,
            10,
            9,
        ));

        this.teamBalancerService.players.push(new Player(
            'Görkem',
            Gender.Male,
            8,
            8,
            8,
            5,
            5,
        ));

        this.teamBalancerService.players.push(new Player(
            'Şahap',
            Gender.Male,
            9,
            9,
            10,
            8,
            9,
        ));

        this.teamBalancerService.players.push(new Player(
            'Güçlü',
            Gender.Male,
            9,
            10,
            10,
            9,
            7,
        ));

        this.teamBalancerService.players.push(new Player(
            'Serkan',
            Gender.Male,
            9,
            10,
            10,
            8,
            7,
        ));

        this.teamBalancerService.players.push(new Player(
            'Ziya',
            Gender.Male,
            7,
            7,
            8,
            8,
            7,
        ));

        this.teamBalancerService.players.push(new Player(
            'İpek',
            Gender.Female,
            7,
            8,
            0,
            8,
            8,
        ));

        this.teamBalancerService.players.push(new Player(
            'Mehmet',
            Gender.Male,
            7,
            5,
            2,
            5,
            6,
        ));

        this.teamBalancerService.players.push(new Player(
            'Anıl',
            Gender.Male,
            6,
            10,
            10,
            4,
            4,
        ));

        this.teamBalancerService.players.push(new Player(
            'Duygu',
            Gender.Female,
            9,
            9,
            4,
            10,
            10,
        ));

        this.teamBalancerService.players.push(new Player(
            'Baturalp',
            Gender.Male,
            9,
            9,
            6,
            8,
            9,
        ));

        this.teamBalancerService.players.push(new Player(
            'BAD PLAYER',
            Gender.Male,
            0,
            1,
            2,
            3,
            4,
        ));

        this.teamBalancerService.players.push(new Player(
            'NORMAL PLAYER',
            Gender.Male,
            3,
            4,
            5,
            6,
            7,
        ));

        this.teamBalancerService.players.push(new Player(
            'GOOD PLAYER',
            Gender.Male,
            6,
            7,
            8,
            9,
            10,
        ));

        // this.teamBalancerService.players.push(new Player(
        //     'G B',
        //     Gender.Male,
        //     10,
        //     10,
        //     10,
        //     0,
        //     10,
        // ));

        // // W B 2 & 4 order
        // this.teamBalancerService.players.push(new Player(
        //     'W B',
        //     Gender.Male,
        //     10,
        //     10,
        //     3,
        //     0,
        //     10,
        // ));

        // this.teamBalancerService.players.push(new Player(
        //     'W D',
        //     Gender.Female,
        //     10,
        //     10,
        //     0,
        //     3,
        //     10,
        // ));

        // this.teamBalancerService.players.push(new Player(
        //     'G D',
        //     Gender.Male,
        //     10,
        //     10,
        //     0,
        //     10,
        //     10,
        // ));

        // this.teamBalancerService.players.push(new Player(
        //     'M1',
        //     Gender.Female,
        //     5,
        //     5,
        //     5,
        //     5,
        //     5,
        // ));

        // this.teamBalancerService.players.push(new Player(
        //     'M2',
        //     Gender.Male,
        //     5,
        //     5,
        //     5,
        //     5,
        //     5,
        // ));
    }

}
