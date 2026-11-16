import { useQRCodeStore } from "../store/rq-code-store";

export const ControlPanel = () => {
  const { url, setUrl } = useQRCodeStore();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="qr-content" className="text-meta font-medium text-ink-2">
        Link or text
      </label>
      <input
        id="qr-content"
        type="text"
        autoFocus
        autoComplete="off"
        spellCheck={false}
        placeholder="https://example.com"
        className="h-12 w-full rounded-md border border-ink/15 bg-surface px-4 text-body text-ink placeholder:text-ink-2/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        value={url}
        onChange={(ev) => setUrl(ev.target.value)}
      />
    </div>
  );
};
