import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";

function downloadStringAsFile(data: string, filename: string) {
  const a = document.createElement("a");
  a.download = filename;
  a.href = data;
  a.click();
}

function App() {
  const [url, setUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadQRCode = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      downloadStringAsFile(url, "qrcode.png");
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col font-sans">
      <div className="flex justify-center p-10">
        <h1 className="text-5xl font-bold">
          <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
            Free
          </span>{" "}
          QR Code Generator
        </h1>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-gradient-to-tl p-2 from-primary to-secondary rounded-3xl shadow-2xl">
          <div className="card bg-base-100">
            <div className="card-body items-center gap-5">
              <input
                placeholder="Type URL here"
                className="input input-bordered w-full"
                value={url}
                onChange={(ev) => setUrl(ev.target.value)}
              />
              <div className="items-center text-center rounded bg-white">
                <QRCodeCanvas
                  ref={canvasRef}
                  value={url}
                  size={256}
                  marginSize={1}
                  className="rounded border"
                />
              </div>
              <div className="card-actions flex">
                <button
                  className="btn btn-primary btn-wide"
                  onClick={downloadQRCode}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
