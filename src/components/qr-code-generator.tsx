import { QRCodeSVG } from "qrcode.react";

import { useQRCodeStore } from "../store/rq-code-store";
import { forwardRef } from "react";

const PLACEHOLDER = "https://benfo.github.io/qr/";

// Printer's crop marks at each corner of the sheet: a nod to where QR codes end up.
const cropMarks = [
  "-left-3 -top-3 border-l border-t",
  "-right-3 -top-3 border-r border-t",
  "-bottom-3 -left-3 border-b border-l",
  "-bottom-3 -right-3 border-b border-r",
];

export const QRCodeGenerator = forwardRef<HTMLDivElement>((props, ref) => {
  const url = useQRCodeStore((state) => state.url);
  const isEmpty = url.length === 0;

  return (
    <figure className="flex flex-col gap-4">
      <div className="relative bg-white p-6 ring-1 ring-ink/10 sm:p-8">
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
            <QRCodeSVG
              value={isEmpty ? PLACEHOLDER : url}
              marginSize={1}
              size={1000}
              title={isEmpty ? undefined : `QR code for ${url}`}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      </div>
      <figcaption className="w-0 min-w-full truncate font-mono text-meta text-ink-2">
        {isEmpty ? "Waiting for a link or text" : url}
      </figcaption>
    </figure>
  );
});
