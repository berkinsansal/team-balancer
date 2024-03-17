import { Pipe, PipeTransform } from '@angular/core';
import { Player, playerLabelSkillMap } from '../models/player';
import { TeamBalancerService } from '../services/team-balancer.service';

@Pipe({
    name: 'playerLabel'
})
export class PlayerLabelPipe implements PipeTransform {

    transform(player: Player): string {
        let playerLabel = '';
        for (let [label, skills] of playerLabelSkillMap) {
            const labelOverall = player.getPlayerLabelOverall(skills);
            if (labelOverall >= TeamBalancerService.labelThreshold) {
                playerLabel += label.substring(0, 3) + "_" + labelOverall.toFixed(1) + " ";
            }
        }
        return playerLabel;
    }

}
