import { useQRCodeStore } from "../store/rq-code-store";

export const ControlPanel = () => {
  const { url, setUrl } = useQRCodeStore();

  return (
    <div>
      <input
        type="text"
        autoFocus
        placeholder="Enter a URL here"
        className="input input-bordered w-full"
        value={url}
        onChange={(ev) => setUrl(ev.target.value)}
      />
    </div>
  );
};
