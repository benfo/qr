import QRCode from "qrcode";
import { SVGProps, useMemo } from "react";

export type DotStyle = "square" | "rounded" | "dots";

export interface QRSvgProps
  extends Omit<SVGProps<SVGSVGElement>, "children" | "viewBox"> {
  value: string;
  color: string;
  /** Background colour; omit for a transparent code. */
  background?: string;
  dotStyle: DotStyle;
  /** Image drawn in the centre; the modules under it are cleared. */
  icon?: { src: string; ratio: number };
  title?: string;
}

const MARGIN = 1;
const FINDER = 7;

const isFinder = (size: number, r: number, c: number) =>
  (r < FINDER && c < FINDER) ||
  (r < FINDER && c >= size - FINDER) ||
  (r >= size - FINDER && c < FINDER);

/** One module at (x, y) as a path segment, rounding only its free corners. */
function modulePath(
  x: number,
  y: number,
  style: DotStyle,
  on: (dr: number, dc: number) => boolean
) {
  if (style === "square") return `M${x} ${y}h1v1h-1z`;
  if (style === "dots") {
    const r = 0.45;
    return `M${x + 0.5 - r} ${y + 0.5}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
  }

  // Rounded: a corner rounds when neither neighbour touching it is on,
  // so runs of modules join up into smooth blobs.
  const r = 0.45;
  const up = on(-1, 0);
  const down = on(1, 0);
  const left = on(0, -1);
  const right = on(0, 1);
  const tl = up || left ? 0 : r;
  const tr = up || right ? 0 : r;
  const br = down || right ? 0 : r;
  const bl = down || left ? 0 : r;
  const arc = (rad: number, dx: number, dy: number) =>
    rad ? `a${rad} ${rad} 0 0 1 ${dx} ${dy}` : "";

  return (
    `M${x + tl} ${y}` +
    `h${1 - tl - tr}${arc(tr, tr, tr)}` +
    `v${1 - tr - br}${arc(br, -br, br)}` +
    `h${-(1 - br - bl)}${arc(bl, -bl, -bl)}` +
    `v${-(1 - bl - tl)}${arc(tl, tl, -tl)}z`
  );
}

/** The three corner eyes: a 7×7 ring around a 3×3 centre. */
function finderPath(x: number, y: number) {
  return (
    `M${x} ${y}h7v7h-7z M${x + 1} ${y + 1}v5h5v-5z` +
    ` M${x + 2} ${y + 2}h3v3h-3z`
  );
}

export function QRSvg(props: QRSvgProps) {
  const { value, color, background, dotStyle, icon, title, ...rest } = props;

  const { size, path, iconBox } = useMemo(() => {
    const { modules } = QRCode.create(value, {
      errorCorrectionLevel: icon ? "H" : "L",
    });
    const n = modules.size;
    const total = n + MARGIN * 2;

    // The icon box, in grid coordinates, and the modules it covers.
    let box: { x: number; y: number; w: number } | undefined;
    if (icon) {
      const w = total * icon.ratio;
      box = { x: (total - w) / 2, y: (total - w) / 2, w };
    }
    const covered = (r: number, c: number) =>
      !!box &&
      c + MARGIN + 1 > box.x &&
      c + MARGIN < box.x + box.w &&
      r + MARGIN + 1 > box.y &&
      r + MARGIN < box.y + box.w;

    const on = (r: number, c: number) =>
      r >= 0 &&
      c >= 0 &&
      r < n &&
      c < n &&
      !!modules.get(r, c) &&
      !isFinder(n, r, c) &&
      !covered(r, c);

    let d = "";
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (!on(r, c)) continue;
        d += modulePath(c + MARGIN, r + MARGIN, dotStyle, (dr, dc) =>
          on(r + dr, c + dc)
        );
      }
    }
    d +=
      finderPath(MARGIN, MARGIN) +
      finderPath(n - FINDER + MARGIN, MARGIN) +
      finderPath(MARGIN, n - FINDER + MARGIN);

    return { size: total, path: d, iconBox: box };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, dotStyle, icon?.src, icon?.ratio]);

  return (
    <svg
      {...rest}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering={dotStyle === "square" ? "crispEdges" : undefined}
      role="img"
    >
      {title && <title>{title}</title>}
      {background && <rect width={size} height={size} fill={background} />}
      <path d={path} fill={color} fillRule="evenodd" />
      {icon && iconBox && (
        <image
          href={icon.src}
          x={iconBox.x}
          y={iconBox.y}
          width={iconBox.w}
          height={iconBox.w}
          preserveAspectRatio="xMidYMid meet"
        />
      )}
    </svg>
  );
}
