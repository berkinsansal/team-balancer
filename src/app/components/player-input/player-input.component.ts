import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { enumToKeyArray } from '../../models/enums/enum-helper';
import { Gender } from '../../models/enums/gender.enum';
import { Player } from '../../models/player';
import { TeamBalancerService } from '../../services/team-balancer.service';

// TODO: bugs: (when bugs are fixed, open add & edit buttons in players-display.component.html)
// 1- when player updated with all props, gender doesnot change
// 2- new player somehow has same id(there is no id currently), selection from table select both new players
// 3- when player updated, table doesnt update record

@Component({
    selector: 'app-player-input',
    templateUrl: './player-input.component.html',
    styleUrls: ['./player-input.component.scss']
})
export class PlayerInputComponent implements OnInit {
    @Input() selectedPlayer: Player | null = null;
    @Output() playerUpdated: EventEmitter<Player | null> = new EventEmitter();

    playerForm: FormGroup;
    genderList: SelectItem[] = [];
    skillList: string[];

    constructor(private fb: FormBuilder,
        public teamBalancerService: TeamBalancerService) {

        const genderEnumKeys: string[] = enumToKeyArray(Gender);
        genderEnumKeys.forEach(genderKey => this.genderList.push({
            value: Gender[genderKey as keyof typeof Gender],
            label: genderKey
        }));

        this.skillList = Player.getPlayerClassSkillProperties();

        this.playerForm = new FormGroup({
            name: new FormControl(null, Validators.required),
            gender: new FormControl(Gender.Male, Validators.required),
        });
        this.skillList.forEach(x => {
            this.playerForm.addControl(x, new FormControl(null, [Validators.required, Validators.min(0), Validators.max(10)]));
        });
    }

    ngOnInit(): void {
        this.resetForm();
    }

    resetForm() {
        let playerFormData: any;
        if (this.selectedPlayer) {
            playerFormData = {
                name: this.selectedPlayer.name,
                gender: this.selectedPlayer.gender,
            };
            this.skillList.forEach(skill => {
                if (this.selectedPlayer) {
                    playerFormData[skill] = this.selectedPlayer[skill as keyof Player];
                }
            });
        } else {
            // playerFormData = {
            //     name: null,
            //     gender: Gender.Male,
            // };
            // this.skillList.forEach(x => playerFormData[x] = null);

            // for development
            playerFormData = {
                name: 'player yyy',
                gender: Gender.Male,
            };
            this.skillList.forEach(x => playerFormData[x] = 8);
        }
        this.playerForm.reset(playerFormData);
    }

    addOrUpdatePlayer() {
        if (this.playerForm.valid) {
            let playerProperties = Player.getPlayerClassAllProperties();
            playerProperties = playerProperties.slice(0, playerProperties.length - 1);
            if (this.selectedPlayer) {
                playerProperties.forEach(prop => {
                    if (this.selectedPlayer) {
                        const aaa = prop as keyof Player;
                        (this.selectedPlayer as any)[prop as keyof Player] = this.playerForm.value[prop];
                    }
                });
            } else {
                const playerPropValuesFromForm: any[] = [];
                playerProperties.forEach(prop => {
                    playerPropValuesFromForm.push(this.playerForm.value[prop]);
                });
                this.teamBalancerService.players.push(new Player(...playerPropValuesFromForm));
            }
            this.teamBalancerService.sortPlayers();
            this.playerUpdated.emit(this.selectedPlayer);
        }
    }

}
