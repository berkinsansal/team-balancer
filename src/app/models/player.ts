import { Gender } from './enums/gender.enum';

export class Player {

    constructor(
        public name: string,
        public gender: Gender,
        public serving: number,
        public hitting: number,
        public blocking: number,
        public defense: number,
    ) { }
}