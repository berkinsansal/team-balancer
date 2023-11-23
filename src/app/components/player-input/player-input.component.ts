import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Gender } from '../../models/enums/gender.enum';
import { Player } from '../../models/player';
import { TeamBalancerService } from '../../services/team-balancer.service';
import { enumToKeyArray, enumToValueArray } from '../../models/enums/enum-helper';

@Component({
    selector: 'app-player-input',
    templateUrl: './player-input.component.html',
    styleUrls: ['./player-input.component.scss']
})
export class PlayerInputComponent {
    playerForm: FormGroup;
    // genderList: string[];
    genderList: SelectItem[] = [];
    skillList: string[];

    constructor(private fb: FormBuilder,
        public teamBalancerService: TeamBalancerService) {

        const genderEnumKeys: string[] = enumToKeyArray(Gender);
        genderEnumKeys.forEach(genderKey => this.genderList.push({
            value: Gender[genderKey as keyof typeof Gender],
            label: genderKey
        }));

        const playerProperties = Object.keys(Reflect.construct(Player, []));
        this.skillList = playerProperties.slice(2, playerProperties.length - 1); // remove name and gender properties

        // this.playerForm = new FormGroup({
        //     name: new FormControl(null, Validators.required),
        //     gender: new FormControl(Gender.Male, Validators.required),
        // });
        // this.skillList.forEach(x => {
        //     this.playerForm.addControl(x, new FormControl(null, [Validators.required, Validators.min(0), Validators.max(10)]));
        // });

        // for development
        this.playerForm = new FormGroup({
            name: new FormControl('player xxx', Validators.required),
            gender: new FormControl(Gender.Male, Validators.required),
        });
        this.skillList.forEach(x => {
            this.playerForm.addControl(x, new FormControl(5, [Validators.required, Validators.min(0), Validators.max(10)]));
        });
    }

    addPlayer() {
        if (this.playerForm.valid) {
            const { name, gender, serving, hitting, blocking, defense } = this.playerForm.value;
            this.teamBalancerService.players.push(new Player(name, gender, serving, hitting, blocking, defense));
            // const playerFormData: any = {
            //     name: null,
            //     gender: Gender.Male,
            // };
            // this.skillList.forEach(x => playerFormData[x] = null);

            // for development
            const playerFormData: any = {
                name: 'player yyy',
                gender: Gender.Male,
            };
            this.skillList.forEach(x => playerFormData[x] = 8);
            this.playerForm.reset(playerFormData);
        }
    }

}
