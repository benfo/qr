import { useRef } from "react";
import { ControlPanel } from "./components/control-panel";
import { DownloadButton } from "./components/download-button";
import { QRCodeGenerator } from "./components/qr-code-generator";

export default function App() {
  const qrRef = useRef<HTMLDivElement>(null);

  return (
    <div className="100dvh w-full">
      <div className="flex justify-center p-2">
        <h1 className="font-bold text-2xl md:text-4xl">
          <span className="text-primary">Free</span> QR Code Generator
        </h1>
      </div>
      <div className="flex justify-center mt-10">
        <div className="max-w-lg flex flex-col drop-shadow-lg rounded-lg overflow-hidden md:flex-row">
          <div className="w bg-neutral text-neutral-content p-4">
            <ControlPanel />
          </div>
          <div className="size bg-base-200 p-4 flex justify-center">
            <QRCodeGenerator ref={qrRef} />
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <DownloadButton qrRef={qrRef} />
      </div>
    </div>
  );
}
