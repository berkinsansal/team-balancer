import { Gender } from './enums/gender.enum';

export class Player {
    overall = 0; // 0-10

    constructor(...args: any[]);
    constructor(
        public name: string, // name has to be first in order, it has special logic according to that
        public gender: Gender, // gender has to be second in order, it has special logic according to that
        public serving: number, // 0-10
        public hitting: number, // 0-10
        public blocking: number, // 0-10
        public defense: number, // 0-10
    ) {
        if (name) {
            this.calculateOverall();
        }
    }

    static getPlayerClassAllProperties() {
        return Object.keys(Reflect.construct(Player, []));
    }

    static getPlayerClassSkillProperties() {
        const playerProperties = Player.getPlayerClassAllProperties();
        return playerProperties.slice(2, playerProperties.length - 1); // remove name and gender properties from beginning and overall property from the end
    }

    static getTeamOverall(teamPlayers: Player[]) {
        return teamPlayers.reduce((accumulator, player) => {
            return accumulator + player.overall;
        }, 0) / teamPlayers.length;
    }

    calculateOverall() {
        this.overall = 0;
        const skillList = Player.getPlayerClassSkillProperties();
        skillList.forEach(skill => {
            this.overall += (this[skill as keyof Player] as number);
        });
        this.overall = this.overall / skillList.length;
    }
}

export const playerPropertyWeightMap = new Map<string, number>([
    ['gender', 5],
    ['serving', 3],
    ['hitting', 3],
    ['blocking', 1],
    ['defense', 3],
]);