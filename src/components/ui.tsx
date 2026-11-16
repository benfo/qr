import { ReactNode } from "react";

export const fieldClass =
  "w-full rounded-md border border-ink/15 bg-surface px-4 text-body text-ink placeholder:text-ink-2/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page";

export const Label = (props: {
  htmlFor?: string;
  id?: string;
  children: ReactNode;
}) => (
  <label
    htmlFor={props.htmlFor}
    id={props.id}
    className="text-meta font-medium text-ink-2"
  >
    {props.children}
  </label>
);

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  wrap?: boolean;
}

/** A row of mutually exclusive options. The selected one is solid ink. */
export function Segmented<T extends string>(props: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={props.label}
      className={`flex gap-2 ${props.wrap ? "flex-wrap" : ""}`}
    >
      {props.options.map((option) => {
        const selected = option.value === props.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => props.onChange(option.value)}
            className={`h-10 rounded-md px-4 text-body font-medium transition-colors ${focusRing} ${
              selected
                ? "bg-ink text-page"
                : "border border-ink/15 text-ink hover:bg-ink/5"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
