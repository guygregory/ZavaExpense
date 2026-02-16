import { useState, useRef } from "react";
import type { ReceiptRef } from "../types";
import { generateId } from "../state/store";

interface Props {
  existingReceipts: ReceiptRef[];
  onUpload: (receipt: ReceiptRef) => void;
  onSelectExisting: (receipt: ReceiptRef) => void;
  onClose: () => void;
}

export default function ReceiptUploadModal({
  existingReceipts,
  onUpload,
  onSelectExisting,
  onClose,
}: Props) {
  const [activeTab, setActiveTab] = useState<"add" | "existing">("add");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [docName, setDocName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supportedMimeTypes = ["image/png", "image/jpeg", "application/pdf"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!supportedMimeTypes.includes(file.type)) {
      setError("Only .png, .jpg, and .pdf files are allowed.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setDocName(file.name);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setError("Please select a .png, .jpg, or .pdf file first.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const receipt: ReceiptRef = {
        id: generateId(),
        filename: selectedFile.name,
        mimeType: selectedFile.type,
        size: selectedFile.size,
        dataUrl: reader.result as string,
      };
      onUpload(receipt);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="modal-backdrop" data-testid="receipt-modal-backdrop">
      <div className="modal" data-testid="receipt-upload-modal">
        <div className="modal__header">
          <h2>Attach receipt</h2>
          <button className="close-btn" data-testid="receipt-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "add" ? "tab--active" : ""}`}
            data-testid="receipt-tab-add-new"
            onClick={() => setActiveTab("add")}
          >
            Add new
          </button>
          <button
            className={`tab ${activeTab === "existing" ? "tab--active" : ""}`}
            data-testid="receipt-tab-select-existing"
            onClick={() => setActiveTab("existing")}
          >
            Select existing
          </button>
        </div>

        {activeTab === "add" && (
          <div className="modal__body" data-testid="receipt-add-new-body">
            {error && (
              <div className="validation-error" data-testid="receipt-validation-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <button
                className="btn"
                data-testid="receipt-browse-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
                style={{ display: "none" }}
                data-testid="receipt-file-input"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <span className="file-name" data-testid="receipt-selected-filename">
                  {selectedFile.name}
                </span>
              )}
              <span className="file-name" data-testid="receipt-supported-types">
                Supported: .png, .jpg, .pdf
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="receipt-name">Name</label>
              <input
                id="receipt-name"
                type="text"
                data-testid="receipt-name"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="receipt-notes">Notes</label>
              <input
                id="receipt-notes"
                type="text"
                data-testid="receipt-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="receipt-doc-type">Document type</label>
              <input
                id="receipt-doc-type"
                type="text"
                data-testid="receipt-doc-type"
                value="File"
                readOnly
              />
            </div>

            <div className="modal__actions">
              <button
                className="btn btn--primary"
                data-testid="receipt-upload-btn"
                onClick={handleUpload}
              >
                Upload
              </button>
              <button className="btn" data-testid="receipt-ok-btn" onClick={onClose}>
                OK
              </button>
            </div>
          </div>
        )}

        {activeTab === "existing" && (
          <div className="modal__body" data-testid="receipt-select-existing-body">
            {existingReceipts.length === 0 ? (
              <p>No receipts uploaded this session.</p>
            ) : (
              <ul className="receipt-list">
                {existingReceipts.map((r) => (
                  <li key={r.id} className="receipt-list-item">
                    <span data-testid={`existing-receipt-${r.id}`}>{r.filename}</span>
                    <button
                      className="btn btn--small"
                      data-testid={`select-receipt-${r.id}`}
                      onClick={() => onSelectExisting(r)}
                    >
                      Select
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="modal__actions">
              <button className="btn" data-testid="receipt-close-btn" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
