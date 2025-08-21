import { MODULE_ID, getSetting } from '../config/settings.js';
import type { AttackCategory, RollData } from '../types/index.js';

const ACTION_MAP: Record<string, AttackCategory> = {
  mwak: "melee", rwak: "ranged", msak: "spell", rsak: "spell"
};

const ABILITY_KEYWORDS = [
  "ability check", "skill check", "acrobatics", "athletics", "deception", 
  "history", "insight", "intimidation", "investigation", "medicine", 
  "nature", "perception", "performance", "persuasion", "religion", 
  "sleight", "stealth", "survival", "arcana", "animal handling"
];

export function analyzeRoll(message: any): RollData | null {
  if (!message.rolls?.length) return null;
  
  const roll = message.rolls[0];
  const actor = message.speaker?.actor ? game.actors?.get(message.speaker.actor) : null;
  
  if (actor) {
    const d20Die = roll.dice?.find((d: any) => d.faces === 20);
    if (!d20Die?.results?.length) return null;
    
    const naturalRoll = getUsedRoll(d20Die, roll);
    const isCrit = naturalRoll === 20;
    const isFumble = naturalRoll === 1;
    if (!isCrit && !isFumble) return null;
    
    const category = detectCategory(`${message.content || ""} ${message.flavor || ""}`);
    if (!category) return null;
    
    return { actor, category, isCrit, isFumble, naturalRoll, speaker: message.speaker };
  } else {
    if (!getSetting("checkManualRolls")) return null;
    
    const primaryDie = roll.dice?.[0];
    if (!primaryDie?.results?.length) return null;
    
    const naturalRoll = getUsedRoll(primaryDie, roll);
    const isCrit = naturalRoll === primaryDie.faces;
    const isFumble = naturalRoll === 1;
    if (!isCrit && !isFumble) return null;
    
    return { 
      actor: null, 
      category: "manual", 
      isCrit, 
      isFumble, 
      naturalRoll, 
      speaker: message.speaker,
      dieInfo: { value: naturalRoll, faces: primaryDie.faces }
    };
  }
}

export function checkPermission(rollData: RollData, userId: string): boolean {
  if (!rollData.actor) return true;
  
  const playerOwners = Object.keys(rollData.actor.ownership || {}).filter(id => {
    const user = game.users.find((u: any) => u.id === id);
    return rollData.actor.ownership[id] === 3 && id !== "default" && user && !user.isGM;
  });
  
  const onlineOwner = playerOwners.find(id => 
    game.users.find((u: any) => u.id === id && u.active)
  );
  
  if (playerOwners.length > 0) {
    return playerOwners.includes(userId) || (!onlineOwner && game.user.isGM);
  }
  
  return game.user.isGM;
}

export function checkButtonPermission(rollData: RollData, userId: string): boolean {
  if (!rollData.actor) return true;
  
  const playerOwners = Object.keys(rollData.actor.ownership || {}).filter(id => {
    const user = game.users.find((u: any) => u.id === id);
    return rollData.actor.ownership[id] === 3 && id !== "default" && user && !user.isGM;
  });
  
  const currentUser = game.users.find((u: any) => u.id === userId);
  return playerOwners.includes(userId) || (currentUser && currentUser.isGM);
}

function getUsedRoll(die: any, roll: any): number {
  if (die.results.length === 1) return die.results[0].result;
  const results = die.results.map((r: any) => r.result);
  return roll.options?.advantageMode === -1 ? Math.min(...results) : Math.max(...results);
}

function detectCategory(text: string): AttackCategory | null {
  const lower = text.toLowerCase();
  if (getSetting("checkSaves") && lower.includes("saving throw")) return "save";
  if (getSetting("checkAbility") && ABILITY_KEYWORDS.some(k => lower.includes(k))) return "ability";
  return null;
}

export function mapActionType(actionType: string): AttackCategory | null {
  return ACTION_MAP[actionType] || null;
}

export function shouldTrigger(actor: any): boolean {
  return actor && (!getSetting("playersOnly") || actor.hasPlayerOwner);
}