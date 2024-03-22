import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/player';

@Pipe({
    name: 'playerNameById'
})
export class PlayerNameByIdPipe implements PipeTransform {

    transform(playerId: number, players: Player[]): string {
        return players.find(p => p.id === playerId)!.name;
    }

}
