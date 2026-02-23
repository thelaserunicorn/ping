import { useState } from "react";
import { Service, ServiceInput, ServiceUpdate } from "./types";
import { useServices } from "./hooks/useServices";
import { ServiceCard } from "./components/ServiceCard";
import { AddServiceModal } from "./components/AddServiceModal";
import { EditServiceModal } from "./components/EditServiceModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  const { services, loading, error, addService, updateService, deleteService } =
    useServices();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const handleAdd = async (input: ServiceInput) => {
    await addService(input);
  };

  const handleEdit = async (id: string, updates: ServiceUpdate) => {
    await updateService(id, updates);
    setEditingService(null);
  };

  const handleDelete = async (id: string) => {
    await deleteService(id);
    setDeletingService(null);
  };

  const healthyCount = services.filter(
    (s) => s.lastCheck?.status === "healthy",
  ).length;
  const downCount = services.filter(
    (s) => s.lastCheck?.status === "down",
  ).length;
  const slowCount = services.filter(
    (s) => s.lastCheck?.status === "slow",
  ).length;

  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#141413] transition-colors flex flex-col">
      <header className="bg-white dark:bg-[#1c1b18] border-b border-[#e8e6dc] dark:border-[#2c2b27] sticky top-0 z-40 w-full">
        <div className="w-full px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#d97757] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[#141413] dark:text-[#faf9f5] tracking-tight">
                  Ping!
                </h1>
                <p className="text-xs text-[#b0aea5] dark:text-[#8a8780]">
                  Real-time service monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#d97757] hover:bg-[#c96848] text-white rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Service
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-6 py-8 flex-1">
        {services.length > 0 && (
          <div className="flex gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#788c5d]/10 dark:bg-[#788c5d]/20 rounded-full border border-[#788c5d]/20">
              <span className="w-2 h-2 rounded-full bg-[#788c5d] animate-pulse" />
              <span className="text-sm font-medium text-[#788c5d]">
                {healthyCount} Healthy
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#d97757]/10 dark:bg-[#d97757]/20 rounded-full border border-[#d97757]/20">
              <span className="w-2 h-2 rounded-full bg-[#d97757]" />
              <span className="text-sm font-medium text-[#d97757]">
                {slowCount} Slow
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 dark:bg-red-500/20 rounded-full border border-red-500/20">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-red-500">
                {downCount} Down
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-[#d97757]/30 border-t-[#d97757] rounded-full animate-spin" />
              <p className="text-sm text-[#b0aea5]">Loading services...</p>
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#e8e6dc] dark:bg-[#2c2b27] flex items-center justify-center">
              <svg className="w-10 h-10 text-[#b0aea5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-[#141413] dark:text-[#faf9f5] mb-2">
              No services being monitored
            </h3>
            <p className="text-[#b0aea5] dark:text-[#8a8780] mb-8 max-w-md mx-auto">
              Add your first service to start tracking its health and performance in real-time.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d97757] hover:bg-[#c96848] text-white rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={setEditingService}
                onDelete={setDeletingService}
              />
            ))}
          </div>
        )}
      </main>

      <AddServiceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
      />

      <EditServiceModal
        isOpen={!!editingService}
        service={editingService}
        onClose={() => setEditingService(null)}
        onSubmit={handleEdit}
      />

      <DeleteConfirmModal
        isOpen={!!deletingService}
        service={deletingService}
        onClose={() => setDeletingService(null)}
        onConfirm={handleDelete}
      />

      <footer className="border-t border-[#e8e6dc] dark:border-[#2c2b27] py-6 w-full">
        <div className="w-full px-6 text-center">
          <p className="text-sm text-[#b0aea5] dark:text-[#8a8780]">
            Made with <span className="text-[#d97757]">❤</span> by Rashid Iftekhar
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
