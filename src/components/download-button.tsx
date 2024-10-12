import * as htmlToImage from "html-to-image";

export interface DownloadButtonProps {
  qrRef: React.RefObject<HTMLDivElement>;
}

function downloadAsFile(href: string, filename: string) {
  const a = document.createElement("a");
  a.download = filename;
  a.href = href;
  a.click();
}

export const DownloadButton = (props: DownloadButtonProps) => {
  const { qrRef } = props;

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
        .toPng(qrRef.current)
        .then((dataUrl) => {
          downloadAsFile(dataUrl, "qr-code.png");
        })
        .catch((err) => {
          console.error("Failed to convert div to PNG", err);
        });
    }
  };

  return (
    <div className="flex gap-2 flex-col md:flex-row">
      <button className="btn btn-secondary" onClick={downloadAsSvg}>
        Download as SVG
      </button>
      <button className="btn btn-accent" onClick={downloadAsPng}>
        Download as PNG
      </button>
    </div>
  );
};
