import { QRCodeSVG } from "qrcode.react";

import { useQRCodeStore } from "../store/rq-code-store";
import { forwardRef } from "react";

export const QRCodeGenerator = forwardRef<HTMLDivElement>((props, ref) => {
  const url = useQRCodeStore((state) => state.url);

  return (
    <div className="overflow-hidden size-[256px]">
      <div ref={ref} {...props}>
        <QRCodeSVG
          value={url}
          marginSize={1}
          size={1000}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
});
