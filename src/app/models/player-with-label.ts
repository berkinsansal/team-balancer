import { Player } from './player';


export interface PlayerWithLabel {
  player: Player,
  label: string,
  labelOverall: number,
}

export type PlayerSelection = {
  [label: string]: Player[];
};