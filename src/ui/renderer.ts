import type { AttackCategory, Colors, RollData } from "../types/index.js";

const ROLL_TYPES: Record<AttackCategory, string> = {
  save: "saving throw",
  ability: "ability check",
  melee: "melee attack",
  ranged: "ranged attack",
  spell: "spell attack",
  manual: "manual roll",
};

export function getColors(isCrit: boolean): Colors {
  return {
    border: isCrit ? "#4CAF50" : "#f72525ff",
    bg: isCrit ? "76,175,80" : "255,107,107",
  };
}

export function createTitle(rollData: RollData): string {
  const name = rollData.speaker?.alias || "Someone";

  if (rollData.category === "manual" && rollData.dieInfo) {
    return `${name} rolled ${rollData.dieInfo.value} out of d${rollData.dieInfo.faces} on ${ROLL_TYPES.manual}!`;
  }

  const action =
    rollData.category === "save" || rollData.category === "ability"
      ? rollData.isCrit
        ? "critically succeeded on"
        : "critically failed"
      : rollData.isCrit
      ? "critically hit"
      : "fumbled";

  const preposition =
    rollData.category === "save" || rollData.category === "ability"
      ? ""
      : "with";

  return `${name} ${action} ${preposition} ${
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
  const rollColor = isCrit ? "#008000" : "#FF0000";
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
