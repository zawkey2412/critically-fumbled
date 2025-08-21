import { MODULE_ID, getSetting } from '../config/settings.js';
import { getColors, createTitle, createMessage, createResult, createButton } from '../ui/renderer.js';
import type { RollData } from '../types/index.js';

export async function processRoll(rollData: RollData): Promise<void> {
  const tableUuid = getSetting(`${rollData.category}${rollData.isCrit ? "Crit" : "Fumble"}`);
  if (!tableUuid) {
    console.warn(`[${MODULE_ID}] No table configured for ${rollData.category} ${rollData.isCrit ? "crit" : "fumble"}`);
    return;
  }

  try {
    const table = await fromUuid(tableUuid) as RollTable;
    if (!table?.documentName || table.documentName !== "RollTable") {
      console.error(`[${MODULE_ID}] Invalid table UUID: ${tableUuid}`);
      return;
    }

    const autoRoll = getSetting(rollData.actor?.hasPlayerOwner ? "autoRollPlayers" : "autoRollNPCs");
    const colors = getColors(rollData.isCrit);
    const title = createTitle(rollData);

    let content: string;
    if (autoRoll) {
      const result = await table.roll();
      const resultText = result.results.map((r: any) => r.text || r.getChatText()).join(", ");
      const rolledValue = result.total || result.roll?.total || 0;
      content = createResult(rolledValue, resultText, colors.bg, rollData.isCrit);
    } else {
      content = createButton(tableUuid, table.name, colors.border);
    }

    await ChatMessage.create({
      content: createMessage(title, colors, content),
      speaker: rollData.speaker
    });

    console.info(`[${MODULE_ID}] ${autoRoll ? "Auto-rolled" : "Created prompt for"} ${rollData.category} ${rollData.isCrit ? "crit" : "fumble"}`);
  } catch (error) {
    console.error(`[${MODULE_ID}] Error processing roll:`, error);
  }
}