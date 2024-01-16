import { Gender } from './enums/gender.enum';

// type Player = {
//     gender: string;
//     [skill: string]: any;
// };

export class Player {
    static maxId = -1;
    id = -1;
    documentId?: string;

    constructor(...args: any[]);
    constructor(
        public name: string, // name has to be first in order, it has special logic according to that
        public gender: Gender, // gender has to be second in order, it has special logic according to that
        public height: number, // 0-10 (150cm = 0, each 5cm += 1, 200cm = 10)
        public serving: number, // 0-10
        public hitting: number, // 0-10
        public blocking: number, // 0-10
        public defense: number, // 0-10
        public passing: number, // 0-10
    ) {
        if (name) {
            this.id = ++Player.maxId;
        }
    }

    static getPlayerClassAllProperties() {
        return Object.keys(Reflect.construct(Player, []));
    }

    static getPlayerClassPropertiesExceptId() {
        const playerProperties = Player.getPlayerClassAllProperties();
        return playerProperties.slice(0, playerProperties.length - 1); // remove name and gender properties from beginning and id property from the end
    }

    static getPlayerClassSkillProperties() {
        const playerProperties = Player.getPlayerClassAllProperties();
        return playerProperties.slice(2, playerProperties.length - 1); // remove name and gender properties from beginning and id property from the end
    }

    static getTeamOverall(team: Player[]) {
        const overall = team.reduce((accumulator, player) => {
            return accumulator + player.getPlayerOverall();
        }, 0) / team.length;
        return isNaN(overall) ? 0 : overall;
    }

    getPlayerOverall() {
        let totalSkillWeight = 0;
        let overall = 0;
        const skillList = Player.getPlayerClassSkillProperties();
        skillList.forEach(skill => {
            const skillWeight =  playerPropertyWeightForPlayerMap.get(skill) ?? 0;
            totalSkillWeight += skillWeight;
            overall += this.getSkillValue(skill as keyof Player) * skillWeight;
        });
        overall = overall / skillList.length / (totalSkillWeight / skillList.length);
        return overall;
    }

    getSkillValue(skill: keyof Player) {
        return this[skill] as number ?? 0;
    }
}

// 0-5
export const playerPropertyWeightForPlayerMap = new Map<string, number>([
    ['gender', 5],
    ['height', 5],
    ['serving', 3],
    ['hitting', 3],
    ['blocking', 1],
    ['defense', 3],
    ['passing', 5],
    ['overall', 5],
]);

// 0-5
export const playerPropertyWeightForTeamMap = new Map<string, number>([
    ['height', 3],
    ['serving', 3],
    ['hitting', 4],
    ['blocking', 3],
    ['defense', 5],
    ['passing', 5],
    ['overall', 5],
]);
