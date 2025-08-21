import { getSetting } from '../config/settings.js';
import type { AttackCategory } from '../types/index.js';

const ACTION_MAPPING: Record<string, AttackCategory> = {
  mwak: "melee", rwak: "ranged", msak: "spell", rsak: "spell"
};

const ABILITY_KEYWORDS = [
  "ability check", "skill check", "acrobatics", "athletics", "deception", 
  "history", "insight", "intimidation", "investigation", "medicine", 
  "nature", "perception", "performance", "persuasion", "religion", 
  "sleight", "stealth", "survival", "arcana", "animal handling"
];

export function mapActionTypeToCategory(actionType: string): AttackCategory | null {
  return ACTION_MAPPING[actionType] || null;
}

export function shouldTriggerForSpeaker(actor: any): boolean {
  return actor && (!getSetting("playersOnly") || actor.hasPlayerOwner);
}

export function getUsedRoll(die: any, roll: any): number {
  if (die.results.length === 1) return die.results[0].result;
  const results = die.results.map((r: any) => r.result);
  return roll.options?.advantageMode === -1 ? Math.min(...results) : Math.max(...results);
}

export function detectRollCategory(text: string): "save" | "ability" | null {
  const lowerText = text.toLowerCase();
  
  if (getSetting("checkSaves") && lowerText.includes("saving throw")) return "save";
  if (getSetting("checkAbility") && ABILITY_KEYWORDS.some(keyword => lowerText.includes(keyword))) return "ability";
  
  return null;
}

export function checkOwnership(actor: any, userId: string): boolean {
  if (!actor) return true; // Manual rolls
  
  const playerOwners = Object.keys(actor.ownership || {}).filter(id => {
    const user = game.users.find((u: any) => u.id === id);
    return actor.ownership[id] === 3 && id !== "default" && user && !user.isGM;
  });
  
  // Check if any player owner is online
  const onlinePlayerOwner = playerOwners.find(id => {
    const user = game.users.find((u: any) => u.id === id);
    return user && user.active;
  });
  
  if (playerOwners.length > 0) {
    // Has player owners - check if current user is owner OR GM (GM can always override)
    const currentUser = game.users.find((u: any) => u.id === userId);
    return playerOwners.includes(userId) || (currentUser && currentUser.isGM);
  }
  
  // No player owners - only GM
  return game.user.isGM;
}