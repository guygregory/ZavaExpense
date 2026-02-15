interface Props {
  onClose: () => void;
}

export default function AboutPanel({ onClose }: Props) {
  return (
    <div className="slide-panel" data-testid="about-panel">
      <div className="slide-panel__header">
        <h2>About</h2>
        <button className="btn-icon" onClick={onClose} aria-label="Close">✕</button>
      </div>

      <div className="about-content">
        <p>
          This is a demo expenses application created for demonstration and
          testing purposes only. <strong>Zava</strong> is a fictitious company
          and does not represent any real organisation.
        </p>
        <p>
          No user-provided data is stored server-side. All reports, expenses,
          and receipts shown are simulated sample data.
        </p>
      </div>
    </div>
  );
}
