export type AttackCategory = "melee" | "ranged" | "spell" | "save" | "ability" | "manual";

export interface RollData {
  actor: any;
  category: AttackCategory;
  isCrit: boolean;
  isFumble: boolean;
  naturalRoll: number;
  speaker: any;
  dieInfo?: { value: number; faces: number };
}

export interface Colors {
  border: string;
  bg: string;
}