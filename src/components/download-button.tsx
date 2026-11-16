import * as htmlToImage from "html-to-image";
import { useQRCodeStore } from "../store/rq-code-store";

export interface DownloadButtonProps {
  qrRef: React.RefObject<HTMLDivElement>;
}

const EXPORT_SIZE = 1024;

function downloadAsFile(href: string, filename: string) {
  const a = document.createElement("a");
  a.download = filename;
  a.href = href;
  a.click();
}

const base =
  "h-12 rounded-md px-6 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page disabled:cursor-not-allowed";

export const DownloadButton = (props: DownloadButtonProps) => {
  const { qrRef } = props;
  const isEmpty = useQRCodeStore((state) => state.url.length === 0);

  const downloadAsSvg = () => {
    if (qrRef.current) {
      htmlToImage
        .toSvg(qrRef.current)
        .then((dataUrl) => {
          downloadAsFile(dataUrl, "qr-code.svg");
        })
        .catch((err) => {
          console.error("Failed to convert div to SVG", err);
        });
    }
  };

  const downloadAsPng = () => {
    if (qrRef.current) {
      htmlToImage
        .toPng(qrRef.current, {
          pixelRatio: EXPORT_SIZE / qrRef.current.offsetWidth,
        })
        .then((dataUrl) => {
          downloadAsFile(dataUrl, "qr-code.png");
        })
        .catch((err) => {
          console.error("Failed to convert div to PNG", err);
        });
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        className={`${base} bg-accent text-[#16181D] hover:brightness-95 disabled:bg-ink/10 disabled:text-ink-2 disabled:hover:brightness-100`}
        onClick={downloadAsPng}
        disabled={isEmpty}
      >
        Download PNG
      </button>
      <button
        className={`${base} border border-ink/15 text-ink hover:bg-ink/5 disabled:text-ink-2 disabled:hover:bg-transparent`}
        onClick={downloadAsSvg}
        disabled={isEmpty}
      >
        Download SVG
      </button>
    </div>
  );
};
