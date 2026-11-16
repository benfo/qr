import { useEffect, useRef, useState } from "react";
import {
  fieldProblem,
  getPreset,
  PRESETS,
  PresetField,
  PresetId,
} from "../presets";
import { useQRCodeStore } from "../store/rq-code-store";
import { fieldClass, Label, Segmented } from "./ui";

// An invalid field keeps a warning border, focused or not.
const problemClass = "aria-[invalid]:border-danger aria-[invalid]:ring-danger/30";

const Field = ({
  presetId,
  field,
}: {
  presetId: PresetId;
  field: PresetField;
}) => {
  const value = useQRCodeStore(
    (state) => state.values[presetId][field.key] ?? "",
  );
  const setValue = useQRCodeStore((state) => state.setValue);
  const id = `field-${presetId}-${field.key}`;
  // Wait until the user leaves the field before pointing out a problem.
  const [touched, setTouched] = useState(false);
  const problem = touched ? fieldProblem(field, value) : undefined;
  const problemId = `${id}-problem`;
  const label = (
    <>
      {field.label}
      {field.optional && <span className="font-normal"> (optional)</span>}
    </>
  );

  if (field.kind === "choice") {
    return (
      <div className="flex flex-col gap-2">
        <Label id={id}>{label}</Label>
        <Segmented
          label={field.label}
          value={value}
          options={field.options ?? []}
          onChange={(v) => setValue(field.key, v)}
        />
      </div>
    );
  }

  const common = {
    id,
    value,
    placeholder: field.placeholder,
    onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(field.key, ev.target.value),
    onBlur: () => setTouched(true),
    "aria-invalid": problem ? true : undefined,
    "aria-describedby": problem ? problemId : undefined,
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {field.kind === "textarea" ? (
        <textarea
          {...common}
          rows={3}
          className={`${fieldClass} resize-y py-3 ${problemClass}`}
        />
      ) : (
        <input
          {...common}
          type={field.inputType ?? "text"}
          autoComplete="off"
          spellCheck={false}
          className={`${fieldClass} h-12 ${problemClass}`}
        />
      )}
      {problem && (
        <p id={problemId} className="text-meta text-ink">
          <span aria-hidden className="mr-2 text-danger">
            ●
          </span>
          {problem}
        </p>
      )}
    </div>
  );
};

export const ControlPanel = () => {
  const presetId = useQRCodeStore((state) => state.presetId);
  const setPreset = useQRCodeStore((state) => state.setPreset);
  const values = useQRCodeStore((state) => state.values[presetId]);
  const fieldsRef = useRef<HTMLDivElement>(null);

  // Put the cursor in the first field on load and whenever the type changes.
  useEffect(() => {
    fieldsRef.current
      ?.querySelector<HTMLElement>("input, textarea")
      ?.focus({ preventScroll: true });
  }, [presetId]);

  return (
    <div className="flex flex-col gap-6">
      <Segmented
        label="Type of code"
        value={presetId}
        options={PRESETS.map((p) => ({ value: p.id, label: p.label }))}
        onChange={setPreset}
        wrap
      />
      <div ref={fieldsRef} className="flex flex-col gap-4">
        {getPreset(presetId)
          .fields.filter((field) => !field.hidden?.(values))
          .map((field) => (
            <Field key={field.key} presetId={presetId} field={field} />
          ))}
      </div>
    </div>
  );
};
