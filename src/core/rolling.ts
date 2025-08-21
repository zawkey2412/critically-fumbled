import { MODULE_ID } from "../config/settings.js";
import { getColors, createMessage, createResult } from "../ui/renderer.js";
import { analyzeRoll, checkButtonPermission } from "./engine.js";
import { showDiceAnimation, isDiceSoNiceAvailable } from "./dice-so-nice.js";

async function executeTableRoll(
  roll: Roll,
  table: RollTable,
  target: HTMLElement,
  tempMessage: any
): Promise<void> {
  try {
    if (tempMessage) await tempMessage.delete();
  } catch (error) {}

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

  const chatMessage = target.closest(".message") as HTMLElement;
  const messageId = chatMessage?.dataset?.messageId;

  if (!messageId) {
    ui.notifications.error("Could not find message ID");
    return;
  }

  const message = (game as any).messages?.get(messageId);
  if (!message) {
    ui.notifications.error("Could not find original message");
    return;
  }

  const isCrit = message.content.includes("#4CAF50");
  const colors = getColors(isCrit);
  const titleMatch = message.content.match(/<h4[^>]*>([^<]+)<\/h4>/);
  const title = (titleMatch?.[1] || "Roll Result").replace(/[<>"'&]/g, "");
  const resultText = (
    tableResult.description ||
    tableResult.name ||
    tableResult.getChatText() ||
    ""
  ).toString();

  await message.update({
    content: createMessage(
      title,
      colors,
      createResult(rolledValue, resultText, colors.bg, isCrit)
    ),
  });
}

async function rollTable(table: RollTable, target: HTMLElement): Promise<void> {
  try {
    const roll = new Roll(table.formula || "1d100");
    await roll.evaluate();

    (target as HTMLButtonElement).disabled = true;
    target.style.opacity = "0.7";
    target.textContent = "🎲 Rolling...";

    await showDiceAnimation(roll);
    target.textContent = "✓ Rolled!";

    await executeTableRoll(roll, table, target, null);
  } catch (error) {
    ui.notifications.error("Failed to roll table");

    (target as HTMLButtonElement).disabled = false;
    target.style.opacity = "1";
    target.textContent = `🎲 Roll ${(table as any).name || "Table"}`;
  }
}

export function setupChatListeners(): void {
  const clickHandler = async (event: Event) => {
    const target = event.target as HTMLElement;
    if (!target?.classList?.contains("crit-fumble-roll-btn")) return;

    event.preventDefault();
    event.stopPropagation();

    const chatMessage = target.closest(".message") as HTMLElement;
    if (!chatMessage) return;

    const messageId = chatMessage.dataset?.messageId;
    if (!messageId) return;

    const message = (game as any).messages?.get(messageId);
    if (!message) return;

    const rollData = analyzeRoll(message);
    if (rollData && !checkButtonPermission(rollData, game.user.id)) {
      ui.notifications.warn(
        rollData.actor
          ? "Only the character owner or GM can roll this table"
          : "Permission denied"
      );
      return;
    }

    const tableUuid = target.dataset.tableUuid;
    if (!tableUuid) {
      ui.notifications.error("No table UUID found on button");
      return;
    }

    try {
      const table = (await fromUuid(tableUuid)) as RollTable;
      if (table?.documentName === "RollTable") {
        await rollTable(table, target);
      } else {
        ui.notifications.error("Invalid table or not a RollTable");
      }
    } catch (error) {
      ui.notifications.error("Failed to roll table");
    }
  };

  document.addEventListener("click", clickHandler);

  // Store reference for cleanup
  (globalThis as any).critFumbleClickHandler = clickHandler;
}
