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
  /** With an icon, the option shows only the icon; the label names it. */
  options: { value: T; label: string; icon?: ReactNode }[];
  onChange: (value: T) => void;
  wrap?: boolean;
}

/** A row of mutually exclusive options. The selected one is solid ink. */
export function Segmented<T extends string>(props: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={props.label}
      className={`flex ${props.options.some((o) => o.icon) ? "gap-1" : "gap-2"} ${
        props.wrap ? "flex-wrap" : ""
      }`}
    >
      {props.options.map((option) => {
        const selected = option.value === props.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.icon ? option.label : undefined}
            title={option.icon ? option.label : undefined}
            onClick={() => props.onChange(option.value)}
            className={`h-10 rounded-md text-body font-medium transition-colors ${focusRing} ${
              option.icon ? "grid w-10 place-items-center" : "px-4"
            } ${
              selected
                ? "bg-ink text-page"
                : "border border-ink/15 text-ink hover:bg-ink/5"
            }`}
          >
            {option.icon ?? option.label}
          </button>
        );
      })}
    </div>
  );
}

/** A round colour swatch inside a 40px target; the selected one gets a ring. */
export const swatchClass = (selected: boolean) =>
  `grid size-10 cursor-pointer place-items-center rounded-full transition-shadow ${
    selected
      ? "ring-2 ring-ink ring-offset-2 ring-offset-page"
      : "hover:ring-1 hover:ring-ink/30 hover:ring-offset-2 hover:ring-offset-page"
  }`;

export const SwatchDot = (props: { color?: string; rainbow?: boolean }) => (
  <span
    aria-hidden
    className="size-8 rounded-full ring-1 ring-inset ring-ink/25"
    style={
      props.rainbow
        ? {
            background:
              "conic-gradient(#e5484d, #f5a524, #46a758, #0090ff, #8e4ec6, #e5484d)",
          }
        : { backgroundColor: props.color }
    }
  />
);

/** One swatch that picks a fixed colour or mode. */
export const Swatch = (props: {
  color: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-pressed={props.selected}
    aria-label={props.label}
    title={props.label}
    onClick={props.onClick}
    className={`${swatchClass(props.selected)} ${focusRing}`}
  >
    <SwatchDot color={props.color} />
  </button>
);

/**
 * The "any colour" swatch: a rainbow that opens the system colour picker,
 * showing the chosen colour once it's in use.
 */
export const CustomSwatch = (props: {
  value: string;
  selected: boolean;
  onPick: (color: string) => void;
  onSelect?: () => void;
}) => (
  <label
    title="Pick any colour"
    className={`${swatchClass(props.selected)} has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-page`}
  >
    {props.selected ? <SwatchDot color={props.value} /> : <SwatchDot rainbow />}
    <input
      type="color"
      aria-label="Pick any colour"
      value={props.value}
      onClick={props.onSelect}
      onChange={(ev) => props.onPick(ev.target.value)}
      className="sr-only"
    />
  </label>
);
