import { getPreset } from "../presets";
import { useIconColor, useQRCodeStore } from "../store/rq-code-store";
import { CustomSwatch, Label, Swatch } from "./ui";

/**
 * Colour swatches for the centre icon: the code's colour (it follows when the
 * code changes), the icon's brand colour if it has one, or any colour.
 */
export const IconColorPicker = () => {
  const {
    presetId,
    color,
    iconColorMode,
    setIconColorMode,
    setIconCustomColor,
  } = useQRCodeStore();
  const shown = useIconColor();
  const preset = getPreset(presetId);

  const mode =
    iconColorMode === "brand" && !preset.iconColor ? "code" : iconColorMode;

  const note = {
    code: "Same colour as the QR code",
    brand: `${preset.label}’s own colour`,
    custom: "Your own colour",
  }[mode];

  return (
    <div className="flex flex-col gap-2">
      <Label>Icon colour</Label>
      <div className="flex items-center gap-2">
        <Swatch
          color={color}
          label="Same colour as the QR code"
          selected={mode === "code"}
          onClick={() => setIconColorMode("code")}
        />
        {preset.iconColor && (
          <Swatch
            color={preset.iconColor}
            label={`${preset.label}’s own colour`}
            selected={mode === "brand"}
            onClick={() => setIconColorMode("brand")}
          />
        )}
        <CustomSwatch
          value={shown}
          selected={mode === "custom"}
          onSelect={() => setIconColorMode("custom")}
          onPick={(value) => {
            setIconColorMode("custom");
            setIconCustomColor(value);
          }}
        />
        <span className="ml-2 text-meta text-ink-2">{note}</span>
      </div>
    </div>
  );
};
