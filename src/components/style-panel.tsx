import { useQRCodeStore } from "../store/rq-code-store";
import { focusRing, Label, Segmented } from "./ui";

// WCAG relative luminance, used to warn when a colour is too light to scan.
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastOnWhite = (hex: string) => 1.05 / (luminance(hex) + 0.05);

export const StylePanel = () => {
  const {
    color,
    setColor,
    transparent,
    setTransparent,
    showIcon,
    setShowIcon,
  } = useQRCodeStore();

  const tooLight = contrastOnWhite(color) < 4;

  const hint = transparent
    ? "Place it on a background that contrasts strongly with the code so it scans."
    : tooLight
      ? "This colour is light. Some phones may not scan it, so pick something darker."
      : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="qr-color">Colour</Label>
          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-ink/15 pl-2 pr-4 hover:bg-ink/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent">
            <span
              aria-hidden
              className="size-6 rounded-sm ring-1 ring-inset ring-ink/15"
              style={{ backgroundColor: color }}
            />
            <span className="font-mono text-meta uppercase">{color}</span>
            <input
              id="qr-color"
              type="color"
              value={color}
              onChange={(ev) => setColor(ev.target.value)}
              className="sr-only"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Background</Label>
          <Segmented
            label="Background"
            value={transparent ? "transparent" : "white"}
            options={[
              { value: "white", label: "White" },
              { value: "transparent", label: "Transparent" },
            ]}
            onChange={(v) => setTransparent(v === "transparent")}
          />
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-2 self-start">
        <input
          type="checkbox"
          checked={showIcon}
          onChange={(ev) => setShowIcon(ev.target.checked)}
          className={`size-5 cursor-pointer accent-[rgb(var(--ink))] ${focusRing}`}
        />
        <span>Show an icon in the centre</span>
      </label>
      {hint && (
        <p role="status" className="max-w-xs text-meta text-ink-2">
          {hint}
        </p>
      )}
    </div>
  );
};
