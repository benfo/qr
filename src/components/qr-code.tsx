import { useCallback, useEffect, useMemo, useRef } from "react";
import { Ecc, QrCode } from "../lib/qrcodegen";

const useQRCode = (text: string) => {
  const qrCode = useMemo(() => {
    return QrCode.encodeText(text, Ecc.MEDIUM);
  }, [text]);

  const render = useCallback(
    (
      callback: (
        x: number,
        y: number,
        isDark: boolean,
        isAlignmentCorner: boolean
      ) => void
    ) => {
      for (let y = 0; y < qrCode.size; y++) {
        for (let x = 0; x < qrCode.size; x++) {
          const isDark = qrCode.getModule(x, y);
          const isAlignment =
            isAlignmentCorner(x, y, 0, 0) ||
            isAlignmentCorner(x, y, qrCode.size - 7, 0) ||
            isAlignmentCorner(x, y, 0, qrCode.size - 7);
          callback(x, y, isDark, isAlignment);
        }
      }
    },
    [qrCode]
  );

  return { qrCode, render };
};

export const QRCode = ({
  text,
  lightColor = "#ffffff",
  darkColor = "#000000",
  size = 128,
}: {
  text: string;
  lightColor?: string;
  darkColor?: string;
  size?: number;
}) => {
  const { qrCode, render } = useQRCode(text);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const moduleSize = Math.floor(size / qrCode.size);
      const canvasSize = moduleSize * qrCode.size;

      canvasRef.current.width = canvasSize;
      canvasRef.current.height = canvasSize;

      const ctx = canvasRef.current.getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      ctx.fillStyle = lightColor;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      render((x, y, isDark, isAlignmentCorner) => {
        const fillColor = isDark ? darkColor : lightColor;
        ctx.fillStyle = fillColor;

        if (isAlignmentCorner) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
        } else {
          // ctx.fillStyle = isDark ? darkColor : lightColor;
          // ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
          // Draw a circle for dark non-alignment points
          const centerX = x * moduleSize + moduleSize / 2;
          const centerY = y * moduleSize + moduleSize / 2;
          const radius = moduleSize / 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    }
  }, [darkColor, lightColor, qrCode, render, size]);

  return <canvas ref={canvasRef} />;
};

// function drawCanvas(
//   qr: QrCode,
//   scale: number,
//   border: number,
//   lightColor: string,
//   darkColor: string,
//   canvas: HTMLCanvasElement
// ): void {
//   if (scale <= 0 || border < 0) throw new RangeError("Value out of range");
//   const width: number = (qr.size + border * 2) * scale;
//   canvas.width = width;
//   canvas.height = width;

//   const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
//   // Set canvas background to white
//   ctx.fillStyle = lightColor;
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   for (let y = -border; y < qr.size + border; y++) {
//     for (let x = -border; x < qr.size + border; x++) {
//       const isDark = qr.getModule(x, y);
//       const fillColor = isDark ? darkColor : lightColor;
//       ctx.fillStyle = fillColor;

//       if (
//         isAlignmentCorner(x, y, 0, 0) ||
//         isAlignmentCorner(x, y, qr.size - 7, 0) ||
//         isAlignmentCorner(x, y, 0, qr.size - 7)
//       ) {
//         ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
//         continue;
//       }
//       if (isDark) {
//         // Draw a circle for the dark modules
//         const centerX = (x + border) * scale + scale / 2;
//         const centerY = (y + border) * scale + scale / 2;
//         const radius = scale / 2;
//         ctx.beginPath();
//         ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
//         ctx.fill();
//       } else {
//         // Keep light modules as squares (or you can leave them blank)
//         ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
//       }
//     }
//   }
// }

function isAlignmentCorner(
  pointX: number,
  pointY: number,
  squareX: number,
  squareY: number
): boolean {
  // Check if the point is within the bounds of the square
  const withinXBounds = pointX >= squareX && pointX <= squareX + 7;
  const withinYBounds = pointY >= squareY && pointY <= squareY + 7;

  return withinXBounds && withinYBounds;
}
