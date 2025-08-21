import { MODULE_ID } from "../config/settings.js";
import { analyzeRoll, checkPermission } from "../core/engine.js";
import { processRoll } from "../core/processor.js";

export async function onChatMessage(message: any): Promise<void> {
  if (
    !message?.rolls?.length ||
    message.flags?.[MODULE_ID]?.isModuleGenerated ||
    message.flags?.[MODULE_ID]?.isTableRoll
  ) {
    return;
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const rollData = analyzeRoll(message);
    if (!rollData || !checkPermission(rollData, game.user.id)) {
      return;
    }

    const messageUserId = message.author?.id || message.user?.id;
    if (!rollData.actor && messageUserId !== game.user.id) {
      return;
    }

    if (rollData.category === "manual") {
      setTimeout(() => processRoll(rollData).catch(() => {}), 2500);
    } else {
      await processRoll(rollData);
    }
  } catch (err) {}
}
