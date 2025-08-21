# Critically Fumbled

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/W7W71K0WGP)

A comprehensive Foundry VTT module for D&D 5e that automatically detects critical failures and successes, then triggers roll tables to chat.

## Features

### Automatic Detection

- **Attack Rolls**: Detects natural 1s (fumbles) and natural 20s (crits) on attack rolls
- **Manual Rolls**: Detect natural 1s and natural highest out of any format (1d2,1d4,1d6, est.)
- **Saving Throws & Ability Checks**: Optional detection for skill checks and saves
- **Midi-QOL Integration**: Seamless compatibility with automated combat workflows

### Enhanced Dice Experience

- **Dice So Nice Integration**: Automatic 3D dice animations for table rolls
- **Fallback Audio**: Custom dice sound effects when Dice So Nice isn't available

### Rollable Table Integration

- **One-Click Rolling**: Interactive buttons appear in chat messages
- **Customizable Tables**: Configure separate tables for different weapon types and scenarios
- **Weapon Categories**: Support for melee, ranged, spell attacks, and manual rolls
- **Instant Results**: Table results replace the original prompt with full formatting

## Quick Setup

1. **Install the module** in Foundry VTT
2. **Create rollable tables** up to what your table agreed.
3. **Right-click in the sidebar** → copy UUID
4. **Configure the module**:
   - Go to Module Settings → Critically Fumbled
   - Paste table UUIDs for different weapon categories
5. **Start playing!** The module automatically detects and responds to crits/fumbles

## Table Configuration

The module supports separate tables for different scenarios:

| Setting           | Description                  | Example Use                    |
| ----------------- | ---------------------------- | ------------------------------ |
| **Melee Crit**    | Natural 20 on melee attacks  | Heroic weapon effects          |
| **Melee Fumble**  | Natural 1 on melee attacks   | Weapon breaks, friendly fire   |
| **Ranged Crit**   | Natural 20 on ranged attacks | Perfect shots, ricochet hits   |
| **Ranged Fumble** | Natural 1 on ranged attacks  | Bowstring snaps, missed target |
| **Spell Crit**    | Natural 20 on spell attacks  | Enhanced spell effects         |
| **Spell Fumble**  | Natural 1 on spell attacks   | Wild magic, spell backfire     |
| **Manual Crit**   | Max roll on manual dice      | Lucky breaks, perfect timing   |
| **Manual Fumble** | Natural 1 on manual dice     | Unfortunate accidents          |

## Compatibility

- **Foundry VTT**: v13+
- **D&D 5e System**: Required
- **Midi-QOL**: Required
- **Dice So Nice**: Optional enhancement

## Troubleshooting

**Table not rolling?**

- Check that the UUID is correct
- Verify the table exists and has results
- Ensure you have permission to access the table

**No dice animation?**

- Dice So Nice module may not be installed
- Fallback sound should still play
- Check browser audio permissions

**Button not appearing?**

- Module may be disabled
- Check if roll qualifies (nat 1 or nat 20)
- Verify actor ownership permissions

## Contributing

Contributions are welcome! Please feel free to:

- Report bugs or issues
- Suggest new features
- Submit pull requests
- Share your custom tables

## License

This module is provided as-is for the Foundry VTT community.

---

**Not affiliated with Wizards of the Coast or Foundry VTT. Use responsibly at your table!**
