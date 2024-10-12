import { QRCodeSVG } from "qrcode.react";

import { useQRCodeStore } from "../store/rq-code-store";
import { forwardRef } from "react";
import { QRCode } from "./qr-code";

export const QRCodeGenerator = forwardRef<HTMLDivElement>((props, ref) => {
  const url = useQRCodeStore((state) => state.url);

  return (
    <div className="">
      <div ref={ref} {...props}>
        {/* <QRCodeSVG value={url} marginSize={1} size={128} /> */}
      </div>
      <div>
        <QRCode text={url} scale={3} />
      </div>
    </div>
  );
});
