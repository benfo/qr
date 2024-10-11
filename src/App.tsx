import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import * as htmlToImage from "html-to-image";

function downloadAsFile(href: string, filename: string) {
  const a = document.createElement("a");
  a.download = filename;
  a.href = href;
  a.click();
}

function App() {
  const [url, setUrl] = useState("");
  const [size, setSize] = useState(128 * 2);
  const divRef = useRef<HTMLDivElement>(null);

  const downloadAsSvg = () => {
    if (divRef.current) {
      htmlToImage
        .toSvg(divRef.current)
        .then((dataUrl) => {
          downloadAsFile(dataUrl, "qr-code.svg");
        })
        .catch((err) => {
          console.error("Failed to convert div to SVG", err);
        });
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col font-sans">
      <div className="flex justify-center p-4 md:p-10">
        <h1 className="text-2xl md:text-5xl font-bold">
          <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
            Free
          </span>{" "}
          QR Code Generator
        </h1>
      </div>
      <div className="flex flex-1 items-center gap-4 flex-col">
        <div className="bg-gradient-to-tl p-2 from-primary to-secondary rounded-3xl shadow-2xl">
          <div className="card card-compact md:card-normal bg-base-100">
            <div className="card-body items-center gap-5">
              <input
                placeholder="Type URL here"
                className="input input-bordered w-full"
                value={url}
                onChange={(ev) => setUrl(ev.target.value)}
              />
              <div>
                <input
                  type="range"
                  min="128"
                  max="384"
                  value={size}
                  className="range"
                  step="128"
                  onChange={(ev) => setSize(parseInt(ev.target.value))}
                />
                <div className="flex w-full justify-between px-2 text-xs">
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                </div>
              </div>

              <div className="card-actions flex">
                <button
                  className="btn btn-primary btn-wide"
                  onClick={downloadAsSvg}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="size-[384px] flex justify-center items-start">
          <div
            ref={divRef}
            className="border-spacing-4 rounded bg-white p-2 flex flex-col border-black gap-2"
          >
            <h1 contentEditable className="text-white bg-black p-2 text-center">
              Scan Me
            </h1>

            <QRCodeSVG
              value={url}
              size={size}
              bgColor="white"
              fgColor="black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
