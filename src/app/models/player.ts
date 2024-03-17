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
        public isActive: boolean, // isEnabled has to be first in order, it has special logic according to that (can be set false if player doesn't join for recent games)
        public name: string, // name has to be second in order, it has special logic according to that
        public gender: Gender, // gender has to be second in order, it has special logic according to that
        public height: number, // 1-10 (150cm = 1, each 10cm += 2, 190cm = 10)
        public serving: number, // 1-10
        public hitting: number, // 1-10
        public blocking: number, // 1-10
        public defense: number, // 1-10
        public passing: number, // 1-10
        public teamPlayer: number, // 1-10
        public nonQuitter: number, // 1-10
        public servingFlawless: number, // 1-10
        public hittingFlawless: number, // 1-10
        public attackReception: number, // 1-10
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
        return playerProperties.slice(3, playerProperties.length - 1); // remove isActive, name and gender properties from beginning and id property from the end
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
            const skillWeight = playerPropertyWeightMap.get(skill) ?? 1;
            totalSkillWeight += skillWeight;
            overall += this.getSkillValue(skill as keyof Player) * skillWeight;
        });
        overall = overall / skillList.length / (totalSkillWeight / skillList.length);
        return overall;
    }

    getPlayerLabelOverall(skills: string[]) {
        let labelOverall = 0;
        skills.forEach(skill => {
            labelOverall += this.getSkillValue(skill as keyof Player);
        });
        labelOverall = labelOverall / skills.length;
        return labelOverall;
    }

    getSkillValue(skill: keyof Player) {
        return this[skill] as number ?? 0;
    }
}

// 1-10
export const playerPropertyWeightMap = new Map<string, number>([
    ['overall', 10],
    ['gender', 10],
    ['height', 10],
    ['serving', 10],
    ['hitting', 8],
    ['blocking', 6],
    ['defense', 8],
    ['passing', 8],
    ['teamPlayer', 6],
    ['nonQuitter', 6],
    ['servingFlawless', 10],
    ['hittingFlawless', 10],
    ['attackReception', 10],
]);

export const playerLabelSkillMap = new Map<string, string[]>([
    ['attacker', ['height', 'serving', 'hitting']],
    ['defender', ['defense', 'attackReception']],
    ['blocker', ['height', 'blocking']],
    ['passer', ['passing', 'attackReception']],
    ['server', ['serving']],
]);

// TODO: Use these to calibrate skills and calculate overall
export const skillFlawlessMap = new Map<string, string>([
    ['serving', 'servingFlawless'],
    ['hitting', 'hittingFlawless'],
]);
