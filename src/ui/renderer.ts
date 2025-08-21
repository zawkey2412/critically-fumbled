import type { AttackCategory, Colors, RollData } from "../types/index.js";


const ROLL_TYPES: Record<AttackCategory, string> = {
  save: "saving throw",
  ability: "ability check",
  melee: "melee attack",
  ranged: "ranged attack",
  spell: "spell attack",
  manual: "manual roll",
} as const;

const COLORS = {
  CRIT: { border: "#4CAF50", bg: "76,175,80" },
  FUMBLE: { border: "#f72525ff", bg: "255,107,107" },
} as const;

const ROLL_COLORS = {
  CRIT: "#008000",
  FUMBLE: "#FF0000",
} as const;

const ACTIONS = {
  save: { crit: "critically succeeded on", fumble: "critically failed" },
  ability: { crit: "critically succeeded on", fumble: "critically failed" },
  attack: { crit: "critically hit", fumble: "fumbled" },
} as const;

export function getColors(isCrit: boolean): Colors {
  return isCrit ? COLORS.CRIT : COLORS.FUMBLE;
}

function getDisplayName(rollData: RollData): string {
  if (rollData.category === "manual") {
    return (game.user as any)?.name || rollData.speaker?.alias || "Someone";
  }
  return rollData.actor?.name || rollData.speaker?.alias || "Someone";
}

function isAbilityOrSave(category: AttackCategory): boolean {
  return category === "save" || category === "ability";
}

export function createTitle(rollData: RollData): string {
  const displayName = getDisplayName(rollData);

  
  if (rollData.category === "manual" && rollData.dieInfo) {
    return `${displayName} rolled ${rollData.dieInfo.value} out of d${rollData.dieInfo.faces} on ${ROLL_TYPES.manual}!`;
  }

  const isAbilitySave = isAbilityOrSave(rollData.category);
  const actionType = isAbilitySave ? ACTIONS.save : ACTIONS.attack;
  const action = rollData.isCrit ? actionType.crit : actionType.fumble;
  const preposition = isAbilitySave ? "" : "with";

  return `${displayName} ${action} ${preposition} ${
    ROLL_TYPES[rollData.category]
  }!`.replace(/\s+/g, " ");
}

export function createMessage(
  title: string,
  colors: Colors,
  content: string
): string {
  return `<div style="border: 2px solid ${colors.border}; padding: 10px; margin: 5px; border-radius: 5px; background: rgba(${colors.bg}, 0.1);">
    <h4 style="text-align: center; margin: 0 0 10px 0;">${title}</h4>
    <div id="crit-fumble-content">${content}</div>
  </div>`;
}

export function createResult(
  rolledValue: number,
  resultText: string,
  bgColor: string,
  isCrit: boolean
): string {
  const rollColor = isCrit ? ROLL_COLORS.CRIT : ROLL_COLORS.FUMBLE;

  return `<div style="background: rgba(${bgColor}, 0.1); padding: 10px; margin: 5px; border-radius: 5px;">
    <p style="text-align: center; margin: 5px 0;"><strong>Rolled</strong></p>
    <h4 style="text-align: center; margin: 5px 0; color: ${rollColor};"><strong>${rolledValue}</strong></h4>
    <p style="text-align: center; margin: 15px 0 5px 0;"><strong>Effect</strong></p>
    <div style="text-align: center; margin: 5px 0;">${resultText}</div>
  </div>`;
}

export function createButton(
  tableUuid: string,
  tableName: string,
  borderColor: string
): string {
  return `<div style="text-align: center;">
    <button class="crit-fumble-roll-btn" data-table-uuid="${tableUuid}" 
            style="display: block; padding: 8px 16px; margin: 5px auto; background: ${borderColor}; 
                   color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
      🎲 Roll ${tableName}
    </button>
  </div>`;
}
