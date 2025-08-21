import { MODULE_ID, getSetting } from "../config/settings.js";
import {
  getColors,
  createTitle,
  createMessage,
  createButton,
} from "../ui/renderer.js";
import type { RollData } from "../types/index.js";

export async function processRoll(rollData: RollData): Promise<void> {
  try {
    const table = await getTable(rollData);
    if (!table) return;

    const colors = getColors(rollData.isCrit);
    const title = createTitle(rollData);
    const content = createButton(table.uuid, table.name, colors.border);

    await ChatMessage.create({
      content: createMessage(title, colors, content),
      speaker: rollData.speaker,
      flags: { [MODULE_ID]: { isModuleGenerated: true } },
    });
  } catch (error) {}
}

async function getTable(
  rollData: RollData
): Promise<{ uuid: string; name: string } | null> {
  const tableUuid = getSetting(
    `${rollData.category}${rollData.isCrit ? "Crit" : "Fumble"}`
  );

  if (!tableUuid) {
    return null;
  }

  const table = (await fromUuid(tableUuid)) as RollTable;
  if (!table?.documentName || table.documentName !== "RollTable") {
    return null;
  }

  return { uuid: tableUuid, name: table.name };
}
