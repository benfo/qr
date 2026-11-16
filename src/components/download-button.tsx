import * as htmlToImage from "html-to-image";
import { useEffect, useState } from "react";
import { getPreset } from "../presets";
import { useEncodedValue, useQRCodeStore } from "../store/rq-code-store";
import { focusRing } from "./ui";

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

const canCopyImages =
  typeof window !== "undefined" &&
  "ClipboardItem" in window &&
  !!navigator.clipboard?.write;

const base = `h-12 rounded-md px-6 font-medium transition-colors disabled:cursor-not-allowed ${focusRing}`;

type Done = "png" | "svg" | "copy" | "failed" | null;

const doneMessage: Record<Exclude<Done, null>, string> = {
  png: "Saved to your downloads.",
  svg: "Saved to your downloads. SVG stays sharp at any size.",
  copy: "Copied. Paste it into a document or message.",
  failed: "That didn't work. Try again, or use Download.",
};

export const DownloadButton = (props: DownloadButtonProps) => {
  const { qrRef } = props;
  const isEmpty = useEncodedValue().length === 0;
  const presetId = useQRCodeStore((state) => state.presetId);
  const [done, setDone] = useState<Done>(null);

  // Let the confirmation fade after a moment.
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => setDone(null), 4000);
    return () => clearTimeout(timer);
  }, [done]);

  const filename = `qr-${getPreset(presetId).id}`;

  const renderPng = () => {
    const node = qrRef.current!;
    return { node, pixelRatio: EXPORT_SIZE / node.offsetWidth };
  };

  const downloadAsSvg = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", String(EXPORT_SIZE));
    clone.setAttribute("height", String(EXPORT_SIZE));
    clone.removeAttribute("style");

    const markup = new XMLSerializer().serializeToString(clone);
    const href = URL.createObjectURL(
      new Blob([markup], { type: "image/svg+xml" })
    );
    downloadAsFile(href, `${filename}.svg`);
    URL.revokeObjectURL(href);
    setDone("svg");
  };

  const downloadAsPng = () => {
    if (!qrRef.current) return;
    const { node, pixelRatio } = renderPng();
    htmlToImage
      .toPng(node, { pixelRatio })
      .then((dataUrl) => {
        downloadAsFile(dataUrl, `${filename}.png`);
        setDone("png");
      })
      .catch(() => setDone("failed"));
  };

  const copyPng = () => {
    if (!qrRef.current) return;
    const { node, pixelRatio } = renderPng();
    // Hand the clipboard a promise so Safari keeps the user's click.
    const blob = htmlToImage
      .toBlob(node, { pixelRatio })
      .then((b) => b ?? Promise.reject(new Error("No image")));
    navigator.clipboard
      .write([new ClipboardItem({ "image/png": blob })])
      .then(() => setDone("copy"))
      .catch(() => setDone("failed"));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          className={`${base} flex-1 bg-accent text-[#16181D] hover:brightness-95 disabled:bg-ink/10 disabled:text-ink-2 disabled:hover:brightness-100`}
          onClick={downloadAsPng}
          disabled={isEmpty}
        >
          {done === "png" ? "Saved ✓" : "Download"}
        </button>
        {canCopyImages && (
          <button
            className={`${base} border border-ink/15 text-ink hover:bg-ink/5 disabled:text-ink-2 disabled:hover:bg-transparent`}
            onClick={copyPng}
            disabled={isEmpty}
          >
            {done === "copy" ? "Copied ✓" : "Copy"}
          </button>
        )}
      </div>
      <p className="text-meta text-ink-2">
        {done === "failed"
          ? doneMessage.failed
          : done === "copy"
            ? doneMessage.copy
            : "A sharp image, 1024 pixels square. For print or design tools, get the "}
        {done !== "failed" && done !== "copy" && (
          <>
            <button
              className={`rounded-sm font-medium text-ink underline underline-offset-4 hover:text-accent disabled:text-ink-2 disabled:no-underline ${focusRing}`}
              onClick={downloadAsSvg}
              disabled={isEmpty}
            >
              {done === "svg" ? "SVG ✓" : "SVG"}
            </button>{" "}
            instead.
          </>
        )}
      </p>
      {/* Screen readers hear what happened; the buttons show it. */}
      <p className="sr-only" aria-live="polite">
        {done ? doneMessage[done] : ""}
      </p>
    </div>
  );
};
