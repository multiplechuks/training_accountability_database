// ConfirmationModal component for reusable confirmation dialogs

interface ConfirmationModalProps {
  show: boolean;
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger" | "warning" | "success" | "info";
  loading?: boolean;
  showWarning?: boolean;
  warningMessage?: string;
  showCancel?: boolean;
  icon?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function ConfirmationModal({
  show,
  message,
  title,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  loading = false,
  showWarning = false,
  warningMessage = "This action cannot be undone. All associated data will be permanently removed.",
  showCancel = true,
  icon,
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  if (!show) return null;

  const confirmButtonClass = `btn btn-${confirmVariant}`;

  const getIconClass = () => {
    if (icon) return icon;
    
    switch (confirmVariant) {
      case "success":
        return "bi bi-check-circle-fill text-success";
      case "danger":
        return "bi bi-x-circle-fill text-danger";
      case "warning":
        return "bi bi-exclamation-triangle-fill text-warning";
      case "info":
        return "bi bi-info-circle-fill text-info";
      default:
        return "";
    }
  };

  const handleBackdropClick = () => {
    if (showCancel && onCancel) {
      onCancel();
    } else {
      onConfirm();
    }
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1040
        }}
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1050,
          pointerEvents: "none"
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "2rem",
            maxWidth: "500px",
            width: "90%",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            pointerEvents: "auto"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {showWarning && (
            <>
              <div style={{ marginBottom: "1rem", textAlign: "center" }}>
                <span style={{ fontSize: "3rem" }}>⚠️</span>
              </div>

              <div
                style={{
                  marginBottom: "1rem",
                  textAlign: "center",
                  fontSize: "0.875rem",
                  color: "#856404",
                  backgroundColor: "#fff3cd",
                  padding: "0.75rem",
                  borderRadius: "4px"
                }}
              >
                <strong>Warning: Permanent Action</strong>
                <p style={{ marginBottom: 0, marginTop: "0.25rem" }}>{warningMessage}</p>
              </div>
            </>
          )}

          {!showWarning && getIconClass() && (
            <div style={{ marginBottom: "1rem", textAlign: "center" }}>
              <i className={`${getIconClass()} fs-1`}></i>
            </div>
          )}

          {title && (
            <h5 style={{ marginBottom: "1rem", textAlign: "center" }}>{title}</h5>
          )}

          <p style={{ marginBottom: "1.5rem", textAlign: "center", fontSize: "1rem", color: title ? "#6c757d" : "inherit" }}>
            {message}
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            {showCancel && onCancel && (
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={onCancel}
                disabled={loading}
              >
                {cancelText}
              </button>
            )}

            <button
              type="button"
              className={`${confirmButtonClass} px-4`}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}