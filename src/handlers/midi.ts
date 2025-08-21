import { MODULE_ID } from "../config/settings.js";
import { mapActionType, shouldTrigger } from "../core/engine.js";
import { processRoll } from "../core/processor.js";

export async function onMidiAttackComplete(workflow: any): Promise<void> {
  try {
    if (!workflow?.attackRoll && !workflow?.item) return;
    if (!shouldTrigger(workflow.actor)) return;

    const isCrit = !!workflow.isCritical;
    const isFumble = !!workflow.isFumble;
    if (!isCrit && !isFumble) return;

    const category =
      mapActionType(workflow.item?.system?.actionType || "mwak") || "melee";

    await processRoll({
      actor: workflow.actor,
      category,
      isCrit,
      isFumble,
      naturalRoll: isCrit ? 20 : 1,
      speaker: ChatMessage.getSpeaker({ actor: workflow.actor }),
    });
  } catch (err) {}
}
