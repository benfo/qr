import { useRef } from "react";
import { ControlPanel } from "./components/control-panel";
import { DownloadButton } from "./components/download-button";
import { QRCodeGenerator } from "./components/qr-code-generator";

export default function App() {
  const qrRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-dvh w-full">
      <div className="mx-auto grid max-w-5xl gap-12 px-4 py-12 sm:px-8 md:min-h-dvh md:grid-cols-[minmax(0,1fr)_auto] md:grid-rows-[1fr_auto_1fr] md:gap-x-16 md:gap-y-8 md:py-16">
        <div className="flex flex-col gap-8 md:row-start-2">
          <header className="flex flex-col gap-4">
            <h1 className="text-title font-semibold">QR code generator</h1>
            <p className="max-w-md text-lead text-ink-2">
              Paste a link and download a code that’s ready to print. It’s made
              in your browser, so nothing you type leaves this page.
            </p>
          </header>
          <ControlPanel />
          <div className="hidden md:block">
            <DownloadButton qrRef={qrRef} />
          </div>
        </div>

        <div className="justify-self-center md:col-start-2 md:row-span-3 md:row-start-1 md:self-center">
          <QRCodeGenerator ref={qrRef} />
        </div>

        <div className="md:hidden">
          <DownloadButton qrRef={qrRef} />
        </div>
      </div>
    </main>
  );
}
