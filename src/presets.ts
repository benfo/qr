import { siWhatsapp } from "simple-icons";

export type PresetId = "link" | "whatsapp" | "email" | "phone" | "wifi";

export interface PresetField {
  key: string;
  label: string;
  placeholder?: string;
  kind?: "text" | "textarea" | "choice";
  inputType?: "text" | "email" | "tel" | "password";
  options?: { value: string; label: string }[];
  optional?: boolean;
  hidden?: (values: Record<string, string>) => boolean;
  /** Returns what's wrong with a non-empty value, or nothing when it's fine. */
  validate?: (value: string) => string | undefined;
}

export interface Preset {
  id: PresetId;
  label: string;
  fields: PresetField[];
  defaults?: Record<string, string>;
  /** What scanning the code does, in plain words, for the caption. */
  describe: (values: Record<string, string>) => string;
  /** Builds the string to encode. Returns "" while required fields are empty. */
  encode: (values: Record<string, string>) => string;
  /** Centre icon as SVG markup, drawn in `color`. */
  icon: (color: string) => string;
  /** The icon's default colour; without one it follows the code colour. */
  iconColor?: string;
}

// Icons are drawn inside a 24×24 box with a 3-unit margin so the excavated
// area around them stays clear of modules.
const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -3 30 30">${body}</svg>`;

const stroke = (color: string, paths: string) =>
  svg(
    `<g fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`
  );

const digits = (value = "") => value.replace(/[^\d]/g, "");

// International format, so the code works from any country: + then 8–15 digits.
const checkPhone = (value: string) => {
  const v = value.trim();
  if (!v.startsWith("+"))
    return "Start with + and the country code, like +27 82 123 4567.";
  if (/[^\d\s()+-]/.test(v.slice(1)) || v.indexOf("+", 1) !== -1)
    return "Use only digits, spaces, dashes and brackets.";
  const n = digits(v).length;
  if (n < 8 || n > 15) return "That number looks too short or too long.";
};

const checkEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ? undefined
    : "Enter a full email address, like hello@example.com.";

const query = (params: Record<string, string | undefined>) => {
  const parts = Object.entries(params)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`);
  return parts.length ? `?${parts.join("&")}` : "";
};

// Wi-Fi payloads escape \ ; , : and " with a backslash.
const wifiEscape = (value: string) => value.replace(/([\\;,:"])/g, "\\$1");

export const PRESETS: Preset[] = [
  {
    id: "link",
    label: "Link",
    fields: [
      { key: "text", label: "Link or text", placeholder: "https://example.com" },
    ],
    encode: (v) => v.text ?? "",
    describe: (v) => v.text ?? "",
    icon: (c) =>
      stroke(
        c,
        `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`
      ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    fields: [
      {
        key: "phone",
        label: "Phone number, with country code",
        placeholder: "+27 82 123 4567",
        inputType: "tel",
        validate: checkPhone,
      },
      {
        key: "message",
        label: "Message",
        placeholder: "Hi! I’d like to book a table.",
        kind: "textarea",
        optional: true,
      },
    ],
    describe: (v) => `Opens a WhatsApp chat with ${v.phone?.trim()}`,
    encode: (v) =>
      digits(v.phone)
        ? `https://wa.me/${digits(v.phone)}${query({ text: v.message })}`
        : "",
    icon: (c) => svg(`<path fill="${c}" d="${siWhatsapp.path}"/>`),
    iconColor: `#${siWhatsapp.hex}`,
  },
  {
    id: "email",
    label: "Email",
    fields: [
      {
        key: "to",
        label: "Email address",
        placeholder: "hello@example.com",
        inputType: "email",
        validate: checkEmail,
      },
      { key: "subject", label: "Subject", optional: true },
      { key: "body", label: "Message", kind: "textarea", optional: true },
    ],
    describe: (v) => `Starts an email to ${v.to?.trim()}`,
    encode: (v) =>
      v.to?.trim()
        ? `mailto:${v.to.trim()}${query({ subject: v.subject, body: v.body })}`
        : "",
    icon: (c) =>
      stroke(
        c,
        `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`
      ),
  },
  {
    id: "phone",
    label: "Phone",
    fields: [
      {
        key: "phone",
        label: "Phone number",
        placeholder: "+27 82 123 4567",
        inputType: "tel",
        validate: checkPhone,
      },
    ],
    describe: (v) => `Calls ${v.phone?.trim()}`,
    encode: (v) => {
      const n = digits(v.phone);
      if (!n) return "";
      return `tel:${v.phone.trim().startsWith("+") ? "+" : ""}${n}`;
    },
    icon: (c) =>
      stroke(
        c,
        `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>`
      ),
  },
  {
    id: "wifi",
    label: "Wi‑Fi",
    fields: [
      { key: "ssid", label: "Network name", placeholder: "Cafe Guest" },
      {
        key: "security",
        label: "Security",
        kind: "choice",
        options: [
          { value: "WPA", label: "WPA/WPA2" },
          { value: "WEP", label: "WEP" },
          { value: "nopass", label: "None" },
        ],
      },
      {
        key: "password",
        label: "Password",
        inputType: "password",
        hidden: (v) => v.security === "nopass",
        // WPA needs 8 to 63 characters; WEP keys are shorter, so only check WPA.
        validate: (value) =>
          value.length > 63 ? "That password is too long for Wi‑Fi." : undefined,
      },
    ],
    defaults: { security: "WPA" },
    describe: (v) =>
      `Joins the ${v.ssid} Wi‑Fi${v.security === "nopass" ? "" : " with its password"}`,
    encode: (v) => {
      if (!v.ssid) return "";
      const open = v.security === "nopass";
      // A secured network can't be joined without its password.
      if (!open && !v.password) return "";
      const password = open ? "" : `P:${wifiEscape(v.password ?? "")};`;
      return `WIFI:T:${v.security};S:${wifiEscape(v.ssid)};${password};`;
    },
    icon: (c) =>
      stroke(
        c,
        `<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.86a10 10 0 0 1 14 0"/><path d="M8.5 16.43a5 5 0 0 1 7 0"/>`
      ),
  },
];

export const getPreset = (id: PresetId) => PRESETS.find((p) => p.id === id)!;

/** What's wrong with a field's value, if anything. Empty values are fine. */
export const fieldProblem = (field: PresetField, value = "") =>
  value.trim() ? field.validate?.(value) : undefined;

/** True when any field the user can see has a problem. */
export const hasProblem = (preset: Preset, values: Record<string, string>) =>
  preset.fields.some(
    (f) => !f.hidden?.(values) && fieldProblem(f, values[f.key])
  );
