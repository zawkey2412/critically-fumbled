import { MODULE_ID, registerSettings } from "./config/settings.js";
import { onMidiAttackComplete } from "./handlers/midi.js";
import { onChatMessage } from "./handlers/chat.js";
import { setupChatListeners } from "./core/rolling.js";
import { isDiceSoNiceAvailable } from "./core/dice-so-nice.js";

Hooks.once("init", registerSettings);

Hooks.once("ready", () => {
  setupChatListeners();
  Hooks.on("midi-qol.AttackRollComplete", onMidiAttackComplete);
  Hooks.on("createChatMessage", onChatMessage);

  const status = isDiceSoNiceAvailable()
    ? "with Dice So Nice integration"
    : "using custom dice sounds for table rolls";
  console.info(`[${MODULE_ID}] Loaded ${status}`);
});

Hooks.on("hotReload", () => {
  // Clean up event listeners to prevent memory leaks
  const handler = (globalThis as any).critFumbleClickHandler;
  if (handler) {
    document.removeEventListener("click", handler);
    (globalThis as any).critFumbleClickHandler = null;
  }
});
