import { useRef } from "react";
import { ControlPanel } from "./components/control-panel";
import { DownloadButton } from "./components/download-button";
import { QRCodeGenerator } from "./components/qr-code-generator";
import { StylePanel } from "./components/style-panel";

export default function App() {
  const qrRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-dvh w-full">
      <div className="mx-auto grid max-w-xl gap-12 lg:max-w-5xl px-4 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start lg:gap-x-16 md:py-24">
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

        {/* The code and its download stay in view while you style it. */}
        <div className="flex w-full max-w-[26rem] flex-col gap-8 justify-self-center lg:sticky lg:top-12 lg:row-span-2">
          <QRCodeGenerator ref={qrRef} />
          <DownloadButton qrRef={qrRef} />
        </div>

        <section
          aria-labelledby="style-heading"
          className="flex flex-col gap-6 border-t border-ink/10 pt-8"
        >
          <h2 id="style-heading" className="text-lead font-semibold">
            Style
          </h2>
          <StylePanel />
        </section>
      </div>
    </main>
  );
}
