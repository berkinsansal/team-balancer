import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/player';

@Pipe({
    name: 'teamOverall'
})
export class TeamOverallPipe implements PipeTransform {

    transform(team: Player[]): number {
        return Player.getTeamOverall(team);
    }

}
