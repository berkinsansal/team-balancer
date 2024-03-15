import { Pipe, PipeTransform } from '@angular/core';
import { Player, playerLabelSkillMap } from '../models/player';

@Pipe({
    name: 'playerLabel'
})
export class PlayerLabelPipe implements PipeTransform {

    transform(player: Player): string {
        let playerLabel = '';
        for (let [label, skills] of playerLabelSkillMap) {
            let labelOverall = 0;
            skills.forEach(skill => {
                labelOverall += player.getSkillValue(skill as keyof Player);
            });
            labelOverall = labelOverall / skills.length;
            if (labelOverall >= 4.5) {
                playerLabel += label + "(" + labelOverall.toFixed(1) + ") ";
            }
                
        }
        return playerLabel;
    }

}
