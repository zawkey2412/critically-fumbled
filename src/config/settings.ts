export const MODULE_ID = "critically-fumbled";

const SETTINGS = {
  boolean: [
    {
      key: "playersOnly",
      name: "Players Only",
      hint: "Only trigger tables for player-owned actors",
      default: false,
    },
    {
      key: "checkSaves",
      name: "Check Saving Throws",
      hint: "Also trigger on natural 1s and 20s for saving throws",
      default: false,
    },
    {
      key: "checkAbility",
      name: "Check Ability Checks",
      hint: "Also trigger on natural 1s and 20s for ability checks",
      default: false,
    },
    {
      key: "checkManualRolls",
      name: "Check Manual Rolls",
      hint: "Also trigger on min/max values for manual dice rolls (no character)",
      default: false,
    },
  ],
  table: [
    "meleeCrit",
    "meleeFumble",
    "rangedCrit",
    "rangedFumble",
    "spellCrit",
    "spellFumble",
    "saveCrit",
    "saveFumble",
    "abilityCrit",
    "abilityFumble",
    "manualCrit",
    "manualFumble",
  ],
};

async function validateTable(value: string): Promise<void> {
  if (!value) return;
  try {
    const table = await fromUuid(value);
    ui.notifications[table?.name ? "info" : "warn"](
      table?.name ? `Table found: ${table.name}` : "Invalid UUID"
    );
  } catch {
    ui.notifications.error("Could not resolve UUID");
  }
}

function formatTableName(key: string): string {
  return (
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(" Crit", " Critical")
      .replace(" Fumble", " Fumble") + " Table UUID"
  );
}

export function registerSettings(): void {
  SETTINGS.boolean.forEach(({ key, name, hint, default: defaultValue }) => {
    game.settings.register(MODULE_ID, key, {
      name,
      hint,
      scope: "world",
      config: true,
      type: Boolean,
      default: defaultValue,
    });
  });
  SETTINGS.table.forEach((key) => {
    game.settings.register(MODULE_ID, key, {
      name: formatTableName(key),
      hint: `UUID of the RollTable for ${key
        .toLowerCase()
        .replace(/crit|fumble/, (match) =>
          match === "crit" ? "critical hits" : "fumbles"
        )}`,
      scope: "world",
      config: true,
      type: String,
      default: "",
      onChange: validateTable,
    });
  });
}

export const getSetting = (key: string): any =>
  game.settings.get(MODULE_ID, key);
