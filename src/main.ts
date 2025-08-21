import { MODULE_ID, registerSettings } from "./config/settings.js";
import { onMidiAttackComplete } from "./handlers/midi.js";
import { onChatMessage } from "./handlers/chat.js";
import { setupChatListeners } from "./core/rolling.js";

Hooks.once("init", registerSettings);
Hooks.once("ready", () => {
  setupChatListeners();
  Hooks.on("midi-qol.AttackRollComplete", onMidiAttackComplete);
  Hooks.on("createChatMessage", onChatMessage);
  console.info(`[${MODULE_ID}] Loaded`);
});