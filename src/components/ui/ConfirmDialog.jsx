import Button from "./Button.jsx";
import Modal from "./Modal.jsx";

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Delete", loading }) {
  return (
    <Modal
      open={open} onClose={onClose} title={title} size="sm"
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button></>}
    >
      <p className="text-muted">{description}</p>
    </Modal>
  );
}
