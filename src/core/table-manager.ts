import { MODULE_ID, getSetting } from '../config/settings.js';
import { getColors, createTitle, createChatTemplate, createResultContent, createButton } from '../ui/templates.js';
import type { RollTableDrawParams } from '../types/index.js';

export async function drawConfiguredTable(params: RollTableDrawParams): Promise<void> {
  const { category, isCrit, isFumble, speaker, dieInfo } = params;

  const tableUuid = getSetting(`${category}${isCrit ? "Crit" : "Fumble"}`);
  if (!tableUuid) {
    console.warn(`[${MODULE_ID}] No table configured for ${category} ${isCrit ? "crit" : "fumble"}`);
    return;
  }

  try {
    const table = await fromUuid(tableUuid) as RollTable;
    if (!table?.documentName || table.documentName !== "RollTable") {
      console.error(`[${MODULE_ID}] Invalid table UUID: ${tableUuid}`);
      return;
    }

    const actor = speaker?.actor ? game.actors?.get(speaker.actor) : null;
    const autoRoll = getSetting(actor?.hasPlayerOwner ? "autoRollPlayers" : "autoRollNPCs");
    const colors = getColors(isCrit);
    const title = createTitle(speaker, category, isCrit, dieInfo);

    let content: string;
    if (autoRoll) {
      const result = await table.roll();
      const resultText = result.results.map((r: any) => r.text || r.getChatText()).join(", ");
      const rolledValue = result.total || result.roll?.total || 0;
      content = createResultContent(rolledValue, resultText, colors.bg, isCrit);
    } else {
      content = createButton(tableUuid, table.name, colors.border);
    }

    await ChatMessage.create({
      content: createChatTemplate(title, colors, content),
      speaker
    });

    console.info(`[${MODULE_ID}] ${autoRoll ? "Auto-rolled" : "Created prompt for"} ${category} ${isCrit ? "crit" : "fumble"}`);
  } catch (error) {
    console.error(`[${MODULE_ID}] Error with table:`, error);
  }
}