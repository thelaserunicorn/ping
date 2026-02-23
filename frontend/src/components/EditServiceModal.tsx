import { useState, useEffect } from "react";
import { Service, ServiceUpdate } from "../types";

interface EditServiceModalProps {
  isOpen: boolean;
  service: Service | null;
  onClose: () => void;
  onSubmit: (id: string, updates: ServiceUpdate) => void;
}

export function EditServiceModal({ isOpen, service, onClose, onSubmit }: EditServiceModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setUrl(service.url);
    }
  }, [service]);

  if (!isOpen || !service) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    setLoading(true);
    await onSubmit(service.id, { name: name.trim(), url: url.trim() });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#faf9f5] dark:bg-[#1c1b18] rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 border border-[#e8e6dc] dark:border-[#2c2b27]">
        <h2 className="text-lg font-semibold text-[#141413] dark:text-[#faf9f5] mb-5">
          Edit Service
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-xs font-medium text-[#b0aea5] dark:text-[#8a8780] uppercase tracking-wide mb-2">
              Service Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8e6dc] dark:border-[#2c2b27] bg-white dark:bg-[#141413] text-[#141413] dark:text-[#faf9f5] focus:ring-2 focus:ring-[#d97757]/30 focus:border-[#d97757] outline-none transition-all text-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-medium text-[#b0aea5] dark:text-[#8a8780] uppercase tracking-wide mb-2">
              Service URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8e6dc] dark:border-[#2c2b27] bg-white dark:bg-[#141413] text-[#141413] dark:text-[#faf9f5] focus:ring-2 focus:ring-[#d97757]/30 focus:border-[#d97757] outline-none transition-all text-sm"
              required
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#b0aea5] hover:text-[#141413] dark:hover:text-[#faf9f5] hover:bg-[#e8e6dc] dark:hover:bg-[#2c2b27] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim() || !url.trim()}
              className="px-5 py-2 bg-[#d97757] hover:bg-[#c96848] text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
