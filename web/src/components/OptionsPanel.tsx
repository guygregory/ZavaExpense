import { useLocale } from "../localization/useLocale";

interface Props {
  onClose: () => void;
}

const LOCALES = [
  { id: "uk", label: "United Kingdom" },
  { id: "us", label: "United States" },
  { id: "eu", label: "European Union" },
] as const;

export default function OptionsPanel({ onClose }: Props) {
  const { locale, setLocale } = useLocale();

  return (
    <div className="slide-panel" data-testid="options-panel">
      <div className="slide-panel__header">
        <h2>Options</h2>
        <button className="btn-icon" onClick={onClose} aria-label="Close">✕</button>
      </div>

      <div className="form-group">
        <label>Locale</label>
        <select
          value={locale.id}
          onChange={(e) => setLocale(e.target.value)}
        >
          {LOCALES.map((loc) => (
            <option key={loc.id} value={loc.id}>{loc.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
