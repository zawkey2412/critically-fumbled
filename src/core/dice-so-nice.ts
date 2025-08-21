const DICE_SOUND = "modules/critically-fumbled/assets/sounds/dice_roll.ogg";

export function isDiceSoNiceAvailable(): boolean {
  return !!(game as any).dice3d;
}

async function playCustomDiceSound(): Promise<void> {
  try {
    const audio = new Audio(DICE_SOUND);
    audio.volume = 0.7;
    audio.currentTime = 0;
    await audio.play();
  } catch (error) {
    // Silent fail for audio
  }
}

export async function showDiceAnimation(roll: Roll): Promise<void> {
  if (isDiceSoNiceAvailable()) {
    try {
      const dice3d = (game as any).dice3d;
      await dice3d.showForRoll(roll, game.user, true);
    } catch (error) {
      await playCustomDiceSound();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  } else {
    await playCustomDiceSound();
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
