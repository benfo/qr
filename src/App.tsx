import { useRef } from "react";
import { ControlPanel } from "./components/control-panel";
import { DownloadButton } from "./components/download-button";
import { QRCodeGenerator } from "./components/qr-code-generator";
import { StylePanel } from "./components/style-panel";

export default function App() {
  const qrRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-dvh w-full">
      <div className="mx-auto grid max-w-5xl gap-12 px-4 py-12 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-x-16 md:py-24">
        {/* What goes in the code: changes with the type you pick. */}
        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-4">
            <h1 className="text-title font-semibold">QR code generator</h1>
            <p className="max-w-md text-lead text-ink-2">
              Print-ready codes for links, WhatsApp, email, calls and Wi‑Fi.
              Made in your browser, so nothing you type leaves this page.
            </p>
          </header>
          <ControlPanel />
        </div>

        {/* The code itself and how it looks: the same for every type. */}
        <div className="flex flex-col gap-8 justify-self-center">
          <QRCodeGenerator ref={qrRef} />
          <StylePanel />
          <DownloadButton qrRef={qrRef} />
        </div>
      </div>
    </main>
  );
}
