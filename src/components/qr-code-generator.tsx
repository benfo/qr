import { QRSvg } from "./qr-svg";

import { getPreset } from "../presets";
import {
  useEncodedValue,
  useHasProblem,
  useIconColor,
  useQRCodeStore,
} from "../store/rq-code-store";
import { forwardRef } from "react";

const PLACEHOLDER = "https://benfo.github.io/qr/";
// Share of the code's width the centre icon takes up.
const ICON_RATIO = 0.24;

// Printer's crop marks at each corner of the sheet: a nod to where QR codes end up.
const cropMarks = [
  "-left-3 -top-3 border-l border-t",
  "-right-3 -top-3 border-r border-t",
  "-bottom-3 -left-3 border-b border-l",
  "-bottom-3 -right-3 border-b border-r",
];

// Checkerboard shown behind a transparent code; it's on the sheet, not the export.
const checker = {
  backgroundColor: "#fff",
  backgroundImage:
    "conic-gradient(#e6e7ea 25%, transparent 0 50%, #e6e7ea 0 75%, transparent 0)",
  backgroundSize: "16px 16px",
};

export const QRCodeGenerator = forwardRef<HTMLDivElement>((props, ref) => {
  const value = useEncodedValue();
  const {
    presetId,
    color,
    transparent,
    showIcon,
    dotStyle,
    eyeFrame,
    eyeCentre,
  } = useQRCodeStore();
  const iconColor = useIconColor();
  const problem = useHasProblem();
  const isEmpty = value.length === 0;

  const iconSrc = showIcon
    ? `data:image/svg+xml;utf8,${encodeURIComponent(getPreset(presetId).icon(iconColor))}`
    : undefined;

  return (
    <figure className="flex flex-col gap-4 self-center">
      <div
        className="relative bg-white p-6 ring-1 ring-ink/10 sm:p-8"
        style={transparent ? checker : undefined}
      >
        {cropMarks.map((position) => (
          <span
            key={position}
            aria-hidden
            className={`absolute size-4 border-ink-2/50 ${position}`}
          />
        ))}
        <div
          className={`size-64 transition-opacity duration-300 sm:size-80 md:size-[22rem] ${
            isEmpty ? "opacity-10" : "opacity-100"
          }`}
        >
          <div ref={ref} {...props}>
            <QRSvg
              value={isEmpty ? PLACEHOLDER : value}
              color={color}
              background={transparent ? undefined : "#FFFFFF"}
              dotStyle={dotStyle}
              eyeFrame={eyeFrame}
              eyeCentre={eyeCentre}
              icon={iconSrc ? { src: iconSrc, ratio: ICON_RATIO } : undefined}
              title={isEmpty ? undefined : `QR code for ${value}`}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
      <figcaption className="w-0 min-w-full truncate font-mono text-meta text-ink-2">
        {isEmpty
          ? problem
            ? "Check the details"
            : "Waiting for details"
          : // Keep Wi-Fi passwords off the screen; they're still in the code.
            value.replace(/;P:(?:\\.|[^;\\])+;/, ";P:••••••;")}
      </figcaption>
    </figure>
  );
});
