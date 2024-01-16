import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/player';

@Pipe({
    name: 'playerOverall'
})
export class PlayerOverallPipe implements PipeTransform {

    transform(player: Player): number {
        return player.getPlayerOverall();
    }

}
