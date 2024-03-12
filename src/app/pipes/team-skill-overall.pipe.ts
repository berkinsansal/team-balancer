import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/player';

@Pipe({
    name: 'teamSkillOverall'
})
export class TeamSkillOverallPipe implements PipeTransform {

    transform(team: Player[], prop: string, teamSize?: number): number {
        const skillOverall = team.reduce((accumulator, player) => {
            return accumulator + (player[prop as keyof Player] as number);
        }, 0) / (teamSize ? teamSize : team.length);
        return isNaN(skillOverall) ? 0 : skillOverall;
    }

}
