import { MODULE_ID } from '../config/settings.js';
import { getColors, createMessage, createResult } from '../ui/renderer.js';
import { analyzeRoll, checkButtonPermission } from './engine.js';

async function executeTableRoll(roll: Roll, table: RollTable, target: HTMLElement, tempMessage: any): Promise<void> {
  try {
    if (tempMessage) await tempMessage.delete();
  } catch (error) {
    console.warn(`[${MODULE_ID}] Failed to delete temp message:`, error);
  }

  const rolledValue = roll.total;
  if (!rolledValue) {
    ui.notifications.error("Roll failed to produce a result");
    return;
  }

  const tableResult = table.results.find((result: any) => {
    const [min, max] = result.range;
    return rolledValue >= min && rolledValue <= max;
  });

  if (!tableResult) {
    ui.notifications.error(`No table result found for roll: ${rolledValue}`);
    return;
  }

  const chatMessage = target.closest(".message");
  const messageId = (chatMessage as HTMLElement)?.dataset?.messageId;
  const message = (game as any).messages?.get(messageId);

  if (!message) {
    ui.notifications.error("Could not find original message");
    return;
  }

  const isCrit = message.content.includes("critically succeeded") || message.content.includes("critically hit");
  const colors = getColors(isCrit);
  const titleMatch = message.content.match(/<h4[^>]*>([^<]+)<\/h4>/);
  const title = (titleMatch?.[1] || "Roll Result").replace(/[<>"'&]/g, '');
  const resultText = (tableResult.text || tableResult.getChatText() || '').toString();

  await message.update({
    content: createMessage(title, colors, createResult(rolledValue, resultText, colors.bg, isCrit))
  });
}

async function rollTable(table: RollTable, target: HTMLElement): Promise<void> {
  try {
    const roll = new Roll(table.formula || "1d100");
    await roll.evaluate();

    (target as HTMLButtonElement).disabled = true;
    target.style.opacity = "0.7";
    target.textContent = "✓ Rolled!";

    const tempMessage = await roll.toMessage();

    setTimeout(async () => {
      try {
        await executeTableRoll(roll, table, target, tempMessage);
      } catch (error) {
        console.error(`[${MODULE_ID}] Error executing table roll:`, error);
        ui.notifications.error("Failed to process table result");
      }
    }, 2500);
  } catch (error) {
    console.error(`[${MODULE_ID}] Error rolling table:`, error);
    ui.notifications.error("Failed to roll table");
  }
}

export function setupChatListeners(): void {
  document.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    if (!target?.classList?.contains("crit-fumble-roll-btn")) return;

    const chatMessage = target.closest(".message");
    const messageId = (chatMessage as HTMLElement)?.dataset?.messageId;
    const message = (game as any).messages?.get(messageId);
    const rollData = analyzeRoll(message);
    
    if (rollData && !checkButtonPermission(rollData, game.user.id)) {
      ui.notifications.warn(rollData.actor ? "Only the character owner or GM can roll this table" : "Permission denied");
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const tableUuid = target.dataset.tableUuid;
    if (!tableUuid) {
      ui.notifications.error("No table UUID found on button");
      return;
    }

    try {
      const table = await fromUuid(tableUuid) as RollTable;
      if (table?.documentName === "RollTable") {
        await rollTable(table, target);
      } else {
        ui.notifications.error("Invalid table or not a RollTable");
      }
    } catch (error) {
      console.error(`[${MODULE_ID}] Error with button click:`, error);
      ui.notifications.error("Failed to roll table");
    }
  });
}