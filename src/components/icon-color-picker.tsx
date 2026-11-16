import { getPreset } from "../presets";
import { useIconColor, useQRCodeStore } from "../store/rq-code-store";
import { focusRing, Label } from "./ui";

const swatchButton = (selected: boolean) =>
  `grid size-10 cursor-pointer place-items-center rounded-full transition-shadow ${
    selected
      ? "ring-2 ring-ink ring-offset-2 ring-offset-page"
      : "hover:ring-1 hover:ring-ink/30 hover:ring-offset-2 hover:ring-offset-page"
  }`;

const Dot = (props: { color?: string; rainbow?: boolean }) => (
  <span
    aria-hidden
    className="size-8 rounded-full ring-1 ring-inset ring-ink/15"
    style={
      props.rainbow
        ? {
            background:
              "conic-gradient(#e5484d, #f5a524, #46a758, #0090ff, #8e4ec6, #e5484d)",
          }
        : { backgroundColor: props.color }
    }
  />
);

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
    iconCustomColor,
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
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-pressed={mode === "code"}
          aria-label="Same colour as the QR code"
          title="Same colour as the QR code"
          onClick={() => setIconColorMode("code")}
          className={`${swatchButton(mode === "code")} ${focusRing}`}
        >
          <Dot color={color} />
        </button>
        {preset.iconColor && (
          <button
            type="button"
            aria-pressed={mode === "brand"}
            aria-label={`${preset.label}’s own colour`}
            title={`${preset.label}’s own colour`}
            onClick={() => setIconColorMode("brand")}
            className={`${swatchButton(mode === "brand")} ${focusRing}`}
          >
            <Dot color={preset.iconColor} />
          </button>
        )}
        <label
          title="Pick any colour"
          className={`${swatchButton(mode === "custom")} has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-page`}
        >
          {mode === "custom" ? <Dot color={iconCustomColor} /> : <Dot rainbow />}
          <input
            type="color"
            aria-label="Pick any colour"
            value={shown}
            onClick={() => setIconColorMode("custom")}
            onChange={(ev) => {
              setIconColorMode("custom");
              setIconCustomColor(ev.target.value);
            }}
            className="sr-only"
          />
        </label>
        <span className="ml-1 text-meta text-ink-2">{note}</span>
      </div>
    </div>
  );
};
