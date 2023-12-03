import { Gender } from './enums/gender.enum';

export class Player {
    overall = 0; // 0-10

    constructor(
        public name: string, // name has to be first in order, it has special logic according to that
        public gender: Gender, // gender has to be second in order, it has special logic according to that
        public serving: number, // 0-10
        public hitting: number, // 0-10
        public blocking: number, // 0-10
        public defense: number, // 0-10
    ) {
        this.calculateOverall();
    }

    calculateOverall() {
        this.overall = (this.serving + this.hitting + this.blocking + this.defense) / 4;
    }
}