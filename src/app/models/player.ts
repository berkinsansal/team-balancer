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
        public height: number, // 1-5 (150cm = 1, each 10cm += 1, 190cm = 5)
        public serving: number, // 1-5
        public hitting: number, // 1-5
        public blocking: number, // 1-5
        public defense: number, // 1-5
        public passing: number, // 1-5
        public teamPlayer: number, // 1-5
        public nonQuitter: number, // 1-5
        public servingFlawless: number, // 1-5
        public hittingFlawless: number, // 1-5
        public attackReception: number, // 1-5
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
        return playerProperties.slice(0, playerProperties.length - 1); // remove id property from the end
    }

    static getPlayerClassSkillProperties() {
        const playerProperties = Player.getPlayerClassAllProperties();
        return playerProperties.slice(2, playerProperties.length - 1); // remove name and gender properties from beginning and id property from the end
    }

    static getTeamOverall(team: Player[], teamSize?: number) {
        const overall = team.reduce((accumulator, player) => {
            return accumulator + player.getPlayerOverall();
        }, 0) / (teamSize ? teamSize : team.length);
        return isNaN(overall) ? 0 : overall;
    }

    getPlayerOverall() {
        let totalSkillWeight = 0;
        let overall = 0;
        const skillList = Player.getPlayerClassSkillProperties();
        skillList.forEach(skill => {
            const skillWeight =  playerPropertyWeightMap.get(skill) ?? 1;
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

// 1-5
export const playerPropertyWeightMap = new Map<string, number>([
    ['overall', 5],
    ['gender', 5],
    ['height', 5],
    ['serving', 5],
    ['hitting', 4],
    ['blocking', 3],
    ['defense', 4],
    ['passing', 4],
    ['teamPlayer', 3],
    ['nonQuitter', 3],
    ['servingFlawless', 5],
    ['hittingFlawless', 5],
    ['attackReception', 5],
]);

// TODO: Use these to calibrate skills and calculate overall
export const skillFlawlessMap = new Map<string, string>([
    ['serving', 'servingFlawless'],
    ['hitting', 'hittingFlawless'],
]);
