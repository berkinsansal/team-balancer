import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/player';

@Pipe({
    name: 'playerOverallValue'
})
export class PlayerOverallPipe implements PipeTransform {

    transform(player: Player): number {
        return Player.getPlayerOverall(player);
    }

}
