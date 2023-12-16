import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/player';

@Pipe({
    name: 'teamSkillOverall'
})
export class TeamSkillOverallPipe implements PipeTransform {

    transform(team: Player[], prop: string): number {
        return team.reduce((accumulator, player) => {
            return accumulator + (player[prop as keyof Player] as number);
        }, 0) / team.length;
    }

}
