import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/player';
import { Gender } from '../models/enums/gender.enum';

@Pipe({
    name: 'playerSkillValue'
})
export class PlayerSkillValuePipe implements PipeTransform {

    transform(player: Player, propertyKey: string): string | Gender | number {
        return player[propertyKey as keyof Player] as string | Gender | number;
    }

}
