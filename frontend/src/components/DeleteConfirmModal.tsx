import { Service } from "../types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  service: Service | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function DeleteConfirmModal({ isOpen, service, onClose, onConfirm }: DeleteConfirmModalProps) {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#faf9f5] dark:bg-[#1c1b18] rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 border border-[#e8e6dc] dark:border-[#2c2b27]">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-[#141413] dark:text-[#faf9f5] text-center mb-2">
          Delete Service
        </h2>
        <p className="text-sm text-[#b0aea5] dark:text-[#8a8780] text-center mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium text-[#141413] dark:text-[#faf9f5]">
            {service.name}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm text-[#b0aea5] hover:text-[#141413] dark:hover:text-[#faf9f5] hover:bg-[#e8e6dc] dark:hover:bg-[#2c2b27] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(service.id);
              onClose();
            }}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
