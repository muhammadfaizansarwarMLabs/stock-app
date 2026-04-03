// EffectsPanel — Two-column filter slider grid + geometric transform button row
// FR-016–FR-028: brightness, contrast, blur, grayscale, opacity sliders +
//               rotate, flip H/V toggles, Reset All, per-control reset icons

const SLIDERS = [
  { key: "opacity",    label: "Opacity",    min: 0,   max: 100,  step: 1,  defaultVal: 100, unit: "%" },
  { key: "brightness", label: "Brightness", min: 0,   max: 200,  step: 1,  defaultVal: 100, unit: "%" },
  { key: "contrast",   label: "Contrast",   min: 0,   max: 200,  step: 1,  defaultVal: 100, unit: "%" },
  { key: "blur",       label: "Blur",       min: 0,   max: 10,   step: 0.5, defaultVal: 0,  unit: "px" },
  { key: "grayscale",  label: "Grayscale",  min: 0,   max: 100,  step: 1,  defaultVal: 0,   unit: "%" },
];

// Minimal inline SVG icons — no external dependency required
function ResetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5" aria-hidden="true">
      <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201-4.42l.003-.12h1.5a.75.75 0 0 0 .536-1.274L6.1 3.56a.75.75 0 0 0-1.072 0L2.98 5.61A.75.75 0 0 0 3.516 6.88H5.02l-.003.12a7 7 0 1 0 7.548 7.262.75.75 0 1 0-1.496-.168 5.5 5.5 0 0 1-5.43-5.174L5.64 9h1.435a.75.75 0 0 0 .53-1.28L5.56 5.665A5.501 5.501 0 0 1 15.312 11.424Z" clipRule="evenodd" />
    </svg>
  );
}

function RotateCWIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
      <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201-4.42l.003-.12h1.5a.75.75 0 0 0 .536-1.274L6.1 3.56a.75.75 0 0 0-1.072 0L2.98 5.61A.75.75 0 0 0 3.516 6.88H5.02l-.003.12a7 7 0 1 0 7.548 7.262.75.75 0 1 0-1.496-.168 5.5 5.5 0 0 1-5.43-5.174L5.64 9h1.435a.75.75 0 0 0 .53-1.28L5.56 5.665A5.501 5.501 0 0 1 15.312 11.424Z" clipRule="evenodd" />
    </svg>
  );
}

function FlipHIcon() {
  // Horizontal flip — two mirrored arrows
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
      <path d="M10 3.75a.75.75 0 0 1 .75.75v11a.75.75 0 0 1-1.5 0v-11A.75.75 0 0 1 10 3.75ZM5.47 7.22a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 0 1-1.06-1.06l1.47-1.47-1.47-1.47a.75.75 0 0 1 0-1.06ZM14.53 7.22a.75.75 0 0 1 0 1.06L13.06 9.75l1.47 1.47a.75.75 0 1 1-1.06 1.06l-2-2a.75.75 0 0 1 0-1.06l2-2a.75.75 0 0 1 1.06 0Z" />
    </svg>
  );
}

function FlipVIcon() {
  // Vertical flip — rotated variant
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
      <path d="M3.75 10a.75.75 0 0 1 .75-.75h11a.75.75 0 0 1 0 1.5h-11A.75.75 0 0 1 3.75 10ZM7.22 5.47a.75.75 0 0 1 1.06-1.06l2 2a.75.75 0 0 1 0 1.06l-2 2A.75.75 0 0 1 7.22 9.41L8.69 9.75l-1.47 1.47a.75.75 0 1 1-1.06-1.06l2-2a.75.75 0 0 1 0-1.06l-2-2ZM7.22 14.53a.75.75 0 0 1 0-1.06L8.69 12l-1.47-1.47a.75.75 0 0 1 1.06-1.06l2 2a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 0 1-1.06 0Z" />
    </svg>
  );
}

/**
 * EffectsPanel — all filter sliders and geometric controls.
 *
 * @param {{ zoom, opacity, brightness, contrast, blur, grayscale, rotation, flipH, flipV }} effects
 * @param {(key: string, value: any) => void} onUpdate - update one effect
 * @param {(key: string) => void} onReset - reset one effect to default
 * @param {() => void} onResetAll - reset every effect to default
 */
export function EffectsPanel({ effects, onUpdate, onReset, onResetAll }) {
  return (
    <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      {/* Two-column labeled slider grid (T030-T032, FR-016–FR-019, FR-006/FR-024) */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {SLIDERS.map(({ key, label, min, max, step, defaultVal, unit }) => {
          const value = effects[key];
          const isDefault = value === defaultVal;
          return (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`effect-${key}`}
                  className="text-xs font-medium text-slate-600"
                >
                  {label}
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs tabular-nums text-slate-400">
                    {value}{unit}
                  </span>
                  {/* Per-slider reset icon (FR-027) */}
                  <button
                    type="button"
                    onClick={() => onReset(key)}
                    disabled={isDefault}
                    aria-label={`Reset ${label} to default`}
                    className="rounded p-0.5 text-slate-400 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
                  >
                    <ResetIcon />
                  </button>
                </div>
              </div>
              {/* Compact slider (FR-024 — smaller visual size) */}
              <input
                id={`effect-${key}`}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onUpdate(key, Number(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded bg-slate-200 accent-orange-500"
                aria-label={`${label} ${value}${unit}`}
              />
            </div>
          );
        })}
      </div>

      {/* Button row: Rotate, Flip H, Flip V, Reset All (T036, T037, FR-020–FR-022, FR-026) */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3">
        {/* Rotate CW (FR-020) */}
        <button
          type="button"
          onClick={() => onUpdate("rotation", (effects.rotation + 90) % 360)}
          aria-label={`Rotate clockwise (current: ${effects.rotation}°)`}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-500 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
        >
          <RotateCWIcon />
          Rotate {effects.rotation}°
          {/* Per-control reset */}
          {effects.rotation !== 0 && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); onReset("rotation"); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onReset("rotation"); } }}
              aria-label="Reset rotation"
              className="ml-0.5 text-slate-400 hover:text-orange-500"
            >
              <ResetIcon />
            </span>
          )}
        </button>

        {/* Flip Horizontal toggle (FR-021) */}
        <button
          type="button"
          onClick={() => onUpdate("flipH", !effects.flipH)}
          aria-pressed={effects.flipH}
          aria-label="Flip horizontal"
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 ${
            effects.flipH
              ? "border-orange-400 bg-orange-50 text-orange-700"
              : "border-slate-300 text-slate-700 hover:border-slate-500 hover:bg-white"
          }`}
        >
          <FlipHIcon />
          Flip H
        </button>

        {/* Flip Vertical toggle (FR-022) */}
        <button
          type="button"
          onClick={() => onUpdate("flipV", !effects.flipV)}
          aria-pressed={effects.flipV}
          aria-label="Flip vertical"
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 ${
            effects.flipV
              ? "border-orange-400 bg-orange-50 text-orange-700"
              : "border-slate-300 text-slate-700 hover:border-slate-500 hover:bg-white"
          }`}
        >
          <FlipVIcon />
          Flip V
        </button>

        {/* Reset All (FR-026) */}
        <button
          type="button"
          onClick={onResetAll}
          aria-label="Reset all effects to defaults"
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-500 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
        >
          <ResetIcon />
          Reset All
        </button>
      </div>
    </div>
  );
}
