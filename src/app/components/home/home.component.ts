import { Component, OnDestroy } from '@angular/core';
import { User } from '@angular/fire/auth';
import { MessageService, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Gender } from '../../models/enums/gender.enum';
import { Player } from '../../models/player';
import { DatabaseService } from '../../services/database.service';
import { TeamBalancerService } from '../../services/team-balancer.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {

    readonly totalPlayerCount = 12;

    user: User | null = null;
    sidebarVisible = false;
    showSkillsOptions: SelectItem[] = [{ label: 'Show Skills', value: true }, { label: 'Hide Skills', value: false }];
    showSkills = true;
    allPlayers: Player[] | undefined;
    team1ByTeamSkills: Player[] = [];
    team2ByTeamSkills: Player[] = [];
    team1ByPlayerSkills: Player[] = [];
    team2ByPlayerSkills: Player[] = [];
    team1ByPlayerOverall: Player[] = [];
    team2ByPlayerOverall: Player[] = [];

    private playersSubscription: Subscription | undefined;

    constructor(private teamBalancerService: TeamBalancerService,
        private messageService: MessageService,
        private databaseService: DatabaseService,
        private userService: UserService) {

        this.userService.user.subscribe(x => this.user = x);
    }

    getPlayers() {
        this.playersSubscription = this.databaseService.players$
            .subscribe({
                next: items => {
                    console.log(items);
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Player list is fetched',
                    });
                    this.teamBalancerService.players = items;
                    this.initialSetup();
                },
                error: error => console.error('Error fetching items:', error)
            });
    }

    initialSetup() {
        this.allPlayers = this.teamBalancerService.players;
        this.team1ByTeamSkills = this.teamBalancerService.team1ByTeamSkills;
        this.team2ByTeamSkills = this.teamBalancerService.team2ByTeamSkills;
        this.team1ByPlayerSkills = this.teamBalancerService.team1ByPlayerSkills;
        this.team2ByPlayerSkills = this.teamBalancerService.team2ByPlayerSkills;
        this.team1ByPlayerOverall = this.teamBalancerService.team1ByPlayerOverall;
        this.team2ByPlayerOverall = this.teamBalancerService.team2ByPlayerOverall;
        this.teamBalancerService.sortPlayers(this.teamBalancerService.players);
        this.teamBalancerService.selectedPlayers = this.teamBalancerService.players.slice(0, this.teamBalancerService.players.length >= this.totalPlayerCount ? this.totalPlayerCount : this.teamBalancerService.players.length);
        this.balanceTeamsByAll();
    }

    balanceTeamsByAll() {
        if (this.teamBalancerService.selectedPlayers.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'You need to select players to generate teams',
            });
            return;
        }
        this.teamBalancerService.balanceTeamsByTeamSkills();
        this.teamBalancerService.balanceTeamsByPlayerSkills();
        // this.teamBalancerService.balanceTeamsByPlayerOverall();
    }

    openSidebar() {
        this.sidebarVisible = true;
    }

    signOut() {
        this.userService.signOut();
    }

    ngOnDestroy(): void {
        if (this.playersSubscription) {
            this.playersSubscription.unsubscribe();
        }
    }

    addTestPlayers() {

        this.teamBalancerService.players.push(new Player(
            'Anıl',
            Gender.Male,
            5,
            1,
            2,
            4,
            1,
            1,
            1,
            1,
            4,
            1,
            1,
        ));

        this.teamBalancerService.players.push(new Player(
            'Ayça',
            Gender.Female,
            3,
            2,
            2,
            2,
            3,
            3,
            4,
            4,
            5,
            5,
            4,
        ));

        this.teamBalancerService.players.push(new Player(
            'Aysu',
            Gender.Female,
            3,
            1,
            1,
            2,
            3,
            3,
            3,
            2,
            2,
            4,
            4,
        ));

        this.teamBalancerService.players.push(new Player(
            'Barış',
            Gender.Male,
            4,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            2,
            1,
            5,
        ));

        this.teamBalancerService.players.push(new Player(
            'Baturalp',
            Gender.Male,
            3,
            4,
            4,
            3,
            3,
            4,
            3,
            3,
            3,
            4,
            4,
        ));

        this.teamBalancerService.players.push(new Player(
            'Begüm',
            Gender.Female,
            1,
            3,
            3,
            1,
            5,
            5,
            5,
            4,
            5,
            5,
            5,
        ));

        this.teamBalancerService.players.push(new Player(
            'Berkin',
            Gender.Male,
            4,
            4,
            4,
            5,
            3,
            3,
            4,
            5,
            1,
            2,
            3,
        ));

        this.teamBalancerService.players.push(new Player(
            'Burak Gökalp',
            Gender.Male,
            4,
            3,
            4,
            4,
            4,
            4,
            4,
            4,
            2,
            2,
            4,
        ));

        this.teamBalancerService.players.push(new Player(
            'Burçe',
            Gender.Female,
            1,
            3,
            3,
            1,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
        ));

        this.teamBalancerService.players.push(new Player(
            'Duygu',
            Gender.Female,
            2,
            4,
            3,
            1,
            4,
            4,
            5,
            3,
            4,
            5,
            5,
        ));

        this.teamBalancerService.players.push(new Player(
            'Emrah',
            Gender.Male,
            4,
            2,
            2,
            3,
            1,
            1,
            1,
            2,
            2,
            3,
            2,
        ));

        this.teamBalancerService.players.push(new Player(
            'Emre',
            Gender.Male,
            4,
            5,
            5,
            5,
            5,
            5,
            5,
            4,
            1,
            1,
            5,
        ));

        this.teamBalancerService.players.push(new Player(
            'Görkem',
            Gender.Male,
            3,
            3,
            3,
            4,
            2,
            2,
            4,
            4,
            4,
            4,
            3,
        ));

        this.teamBalancerService.players.push(new Player(
            'Güçlü',
            Gender.Male,
            3,
            5,
            2,
            4,
            4,
            2,
            2,
            1,
            4,
            5,
            2,
        ));

        this.teamBalancerService.players.push(new Player(
            'İpek',
            Gender.Female,
            2,
            3,
            3,
            1,
            4,
            4,
            1,
            1,
            3,
            5,
            4,
        ));

        this.teamBalancerService.players.push(new Player(
            'Işıl',
            Gender.Female,
            1,
            1,
            1,
            1,
            2,
            2,
            3,
            3,
            1,
            3,
            4,
        ));

        this.teamBalancerService.players.push(new Player(
            'Mehmet',
            Gender.Male,
            2,
            1,
            1,
            1,
            1,
            1,
            2,
            1,
            2,
            3,
            1,
        ));

        this.teamBalancerService.players.push(new Player(
            'Oğuzhan',
            Gender.Male,
            4,
            1,
            2,
            3,
            1,
            1,
            1,
            1,
            1,
            3,
            1,
        ));

        this.teamBalancerService.players.push(new Player(
            'Orhun',
            Gender.Male,
            4,
            2,
            4,
            3,
            3,
            3,
            2,
            2,
            3,
            2,
            3,
        ));

        this.teamBalancerService.players.push(new Player(
            'Ozan',
            Gender.Male,
            4,
            5,
            5,
            5,
            4,
            4,
            2,
            3,
            1,
            2,
            4,
        ));

        this.teamBalancerService.players.push(new Player(
            'Serkan',
            Gender.Male,
            3,
            4,
            5,
            5,
            2,
            2,
            1,
            3,
            5,
            1,
            4,
        ));

        this.teamBalancerService.players.push(new Player(
            'Şahap',
            Gender.Male,
            5,
            5,
            5,
            5,
            5,
            5,
            4,
            5,
            3,
            4,
            5,
        ));

        this.teamBalancerService.players.push(new Player(
            'Şeyda',
            Gender.Female,
            3,
            2,
            1,
            2,
            1,
            3,
            2,
            2,
            5,
            4,
            3,
        ));

        this.teamBalancerService.players.push(new Player(
            'Yoldaş',
            Gender.Male,
            4,
            4,
            4,
            4,
            2,
            2,
            3,
            5,
            3,
            1,
            3,
        ));

        this.teamBalancerService.players.push(new Player(
            'Ziya',
            Gender.Male,
            3,
            2,
            1,
            3,
            2,
            1,
            3,
            2,
            4,
            5,
            3,
        ));

        // this.teamBalancerService.players.push(new Player(
        //     'BAD PLAYER',
        //     Gender.Male,
        //     0,
        //     1,
        //     2,
        //     3,
        //     4,
        // ));

        // this.teamBalancerService.players.push(new Player(
        //     'NORMAL PLAYER',
        //     Gender.Male,
        //     3,
        //     4,
        //     5,
        //     6,
        //     7,
        // ));

        // this.teamBalancerService.players.push(new Player(
        //     'GOOD PLAYER',
        //     Gender.Male,
        //     6,
        //     7,
        //     8,
        //     9,
        //     10,
        // ));

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

        

        // // // this.teamBalancerService.players.push(new Player(
        // // //     'Anıl',
        // // //     Gender.Male,
        // // //     8,
        // // //     6,
        // // //     10,
        // // //     10,
        // // //     4,
        // // //     4,
        // // // ));

        // // this.teamBalancerService.players.push(new Player(
        // //     'Ayça',
        // //     Gender.Female,
        // //     5,
        // //     6,
        // //     6,
        // //     0,
        // //     9,
        // //     8,
        // // ));

        // // this.teamBalancerService.players.push(new Player(
        // //     'Aysu',
        // //     Gender.Female,
        // //     7,
        // //     5,
        // //     6,
        // //     0,
        // //     8,
        // //     8,
        // // ));

        // // this.teamBalancerService.players.push(new Player(
        // //     'Barış',
        // //     Gender.Male,
        // //     7,
        // //     10,
        // //     10,
        // //     10,
        // //     10,
        // //     10,
        // // ));

        // // // this.teamBalancerService.players.push(new Player(
        // // //     'Baturalp',
        // // //     Gender.Male,
        // // //     6,
        // // //     9,
        // // //     9,
        // // //     6,
        // // //     8,
        // // //     9,
        // // // ));

        // // this.teamBalancerService.players.push(new Player(
        // //     'Begüm',
        // //     Gender.Female,
        // //     2,
        // //     9,
        // //     9,
        // //     0,
        // //     10,
        // //     10,
        // // ));

        // // this.teamBalancerService.players.push(new Player(
        // //     'Berkin',
        // //     Gender.Male,
        // //     8,
        // //     8,
        // //     8,
        // //     8,
        // //     7,
        // //     7,
        // // ));

        // // this.teamBalancerService.players.push(new Player(
        // //     'Burak Gökalp',
        // //     Gender.Male,
        // //     7,
        // //     9,
        // //     10,
        // //     10,
        // //     10,
        // //     10,
        // // ));

        // // // this.teamBalancerService.players.push(new Player(
        // // //     'Burçe',
        // // //     Gender.Female,
        // // //     1,
        // // //     9,
        // // //     8,
        // // //     0,
        // // //     10,
        // // //     10,
        // // // ));

        // // this.teamBalancerService.players.push(new Player(
        // //     'Duygu',
        // //     Gender.Female,
        // //     5,
        // //     9,
        // //     10,
        // //     0,
        // //     10,
        // //     10,
        // // ));

        // // this.teamBalancerService.players.push(new Player(
        // //     'Emrah',
        // //     Gender.Male,
        // //     7,
        // //     9,
        // //     10,
        // //     10,
        // //     10,
        // //     10,
        // // ));

        // // this.teamBalancerService.players.push(new Player(
        // //     'Emre',
        // //     Gender.Male,
        // //     7,
        // //     9,
        // //     10,
        // //     10,
        // //     10,
        // //     10,
        // // ));

        // // this.teamBalancerService.players.push(new Player(
        // //     'Görkem',
        // //     Gender.Male,
        // //     6,
        // //     8,
        // //     7,
        // //     8,
        // //     5,
        // //     5,
        // // ));

        // // // this.teamBalancerService.players.push(new Player(
        // // //     'Güçlü',
        // // //     Gender.Male,
        // // //     6,
        // // //     10,
        // // //     10,
        // // //     10,
        // // //     9,
        // // //     8,
        // // // ));

        // // // this.teamBalancerService.players.push(new Player(
        // // //     'İpek',
        // // //     Gender.Female,
        // // //     4,
        // // //     8,
        // // //     8,
        // // //     0,
        // // //     8,
        // // //     8,
        // // // ));

        // // // this.teamBalancerService.players.push(new Player(
        // // //     'Mehmet',
        // // //     Gender.Male,
        // // //     4,
        // // //     7,
        // // //     4,
        // // //     0,
        // // //     5,
        // // //     6,
        // // // ));

        // // // this.teamBalancerService.players.push(new Player(
        // // //     'Oğuzhan',
        // // //     Gender.Male,
        // // //     7,
        // // //     9,
        // // //     10,
        // // //     6,
        // // //     10,
        // // //     10,
        // // // ));

        // // // this.teamBalancerService.players.push(new Player(
        // // //     'Ozan',
        // // //     Gender.Male,
        // // //     7,
        // // //     10,
        // // //     10,
        // // //     10,
        // // //     10,
        // // //     9,
        // // // ));

        // // // this.teamBalancerService.players.push(new Player(
        // // //     'Serkan',
        // // //     Gender.Male,
        // // //     6,
        // // //     10,
        // // //     10,
        // // //     10,
        // // //     7,
        // // //     8,
        // // // ));

        // // this.teamBalancerService.players.push(new Player(
        // //     'Şahap',
        // //     Gender.Male,
        // //     8,
        // //     10,
        // //     10,
        // //     10,
        // //     10,
        // //     10,
        // // ));

        // // // this.teamBalancerService.players.push(new Player(
        // // //     'Şeyda',
        // // //     Gender.Female,
        // // //     5,
        // // //     5,
        // // //     6,
        // // //     7,
        // // //     7,
        // // //     7,
        // // // ));

        // // this.teamBalancerService.players.push(new Player(
        // //     'Yoldaş',
        // //     Gender.Male,
        // //     8,
        // //     7,
        // //     8,
        // //     9,
        // //     6,
        // //     6,
        // // ));

        // // // this.teamBalancerService.players.push(new Player(
        // // //     'Ziya',
        // // //     Gender.Male,
        // // //     6,
        // // //     8,
        // // //     8,
        // // //     8,
        // // //     8,
        // // //     8,
        // // // ));

        this.initialSetup();
    }

}
