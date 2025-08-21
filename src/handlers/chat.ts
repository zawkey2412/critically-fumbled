import { MODULE_ID } from '../config/settings.js';
import { analyzeRoll, checkPermission } from '../core/engine.js';
import { processRoll } from '../core/processor.js';

export async function onChatMessage(message: any): Promise<void> {
  try {
    const rollData = analyzeRoll(message);
    if (!rollData) return;
    
    if (!checkPermission(rollData, game.user.id)) return;
    
    // For manual rolls, only the message creator should handle it
    const messageUserId = message.author?.id || message.user?.id || message.user;
    if (!rollData.actor && messageUserId !== game.user.id) return;
    await processRoll(rollData);
  } catch (err) {
    console.error(`[${MODULE_ID}] Chat handler error:`, err);
  }
}