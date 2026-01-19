"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, Trash2, X } from "lucide-react";

interface Dealer {
  id: number;
  createdDate: string;
  dealerId: string;
  dealerName: string;
  email: string;
  contact: string;
  address: string;
  vin: string;
}

export default function DealersTable() {
  // NOTE: useMemo not necessary here, but fine. We'll keep it.
  const initialDealers: Dealer[] = useMemo(
    () => [
      {
        id: 1,
        createdDate: "28/12/2022",
        dealerId: "DE3456",
        dealerName: "Esther Howard",
        email: "howard@gmail.com",
        contact: "+880 1711-000000",
        address: "Dhaka, Bangladesh",
        vin: "1HGCM82633A004352",
      },
      {
        id: 2,
        createdDate: "02/04/2022",
        dealerId: "DE3258",
        dealerName: "Kristin Watson",
        email: "watson@gmail.com",
        contact: "+880 1811-000000",
        address: "Chattogram, Bangladesh",
        vin: "2HGCM82633A004999",
      },
      {
        id: 3,
        createdDate: "28/12/2022",
        dealerId: "DE3456",
        dealerName: "Esther Howard",
        email: "howard@gmail.com",
        contact: "+880 1911-000000",
        address: "Sylhet, Bangladesh",
        vin: "3HGCM82633A004888",
      },
      {
        id: 4,
        createdDate: "02/04/2022",
        dealerId: "DE3258",
        dealerName: "Kristin Watson",
        email: "watson@gmail.com",
        contact: "+880 1611-000000",
        address: "Rajshahi, Bangladesh",
        vin: "4HGCM82633A004777",
      },
      {
        id: 5,
        createdDate: "12/01/2023",
        dealerId: "DE9911",
        dealerName: "Robert Fox",
        email: "robert@gmail.com",
        contact: "+880 1511-000000",
        address: "Khulna, Bangladesh",
        vin: "5HGCM82633A004111",
      },
      {
        id: 6,
        createdDate: "23/06/2023",
        dealerId: "DE7788",
        dealerName: "Jenny Wilson",
        email: "jenny@gmail.com",
        contact: "+880 1411-000000",
        address: "Barishal, Bangladesh",
        vin: "6HGCM82633A004222",
      },
    ],
    [],
  );

  // Keep dealers in state so delete can work.
  const [dealers, setDealers] = useState(initialDealers);

  // ===== Modal state =====
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<"view" | "add" | "edit" | null>(
    null,
  );
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

  const handleView = (dealer: Dealer) => {
    setSelectedDealer(dealer);
    setModalType("view");
    setOpen(true);
  };

  const handleAdd = () => {
    setSelectedDealer(null);
    setModalType("add");
    setOpen(true);
  };

  const handleEdit = (dealer: Dealer) => {
    setSelectedDealer(dealer);
    setModalType("edit");
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedDealer(null);
    setModalType(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(`${modalType === "add" ? "Adding" : "Editing"} dealer:`, data);
    closeModal();
  };

  const handleDelete = (dealer: Dealer) => {
    // Replace with confirm modal + API call
    const ok = confirm(`Delete dealer: ${dealer.dealerName}?`);
    if (!ok) return;

    setDealers((prev) => prev.filter((d) => d.id !== dealer.id));
    // if deleted dealer was open in modal, close it
    if (selectedDealer?.id === dealer.id) closeModal();
  };

  // ===== Pagination =====
  const PAGE_SIZE = 4;
  const [page, setPage] = useState(1);

  const totalItems = dealers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const safePage = Math.min(Math.max(page, 1), totalPages);

  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const pageItems = dealers.slice(startIndex, endIndex);

  const goToPage = (p: number) => {
    const next = Math.min(Math.max(p, 1), totalPages);
    setPage(next);
  };

  // ===== Modal UX: ESC close + body scroll lock =====
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", onKeyDown);

    // lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">
            Latest Dealers
          </h2>
          <p className="text-slate-500 text-sm">
            Get the information of car dealers
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-[#07589E] text-white px-4 py-2 flex items-center gap-2 cursor-pointer rounded-xl text-sm font-semibold hover:bg-[#07589E]/80 transition shadow-sm"
        >
          <Plus size={16} /> Add New Dealer
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-600 uppercase border border-slate-300 rounded-tl-xl">
                Created Date
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-600 uppercase border border-slate-300">
                Dealer ID
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-600 uppercase border border-slate-300">
                Dealer&apos;s Name
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-600 uppercase border border-slate-300">
                Dealer&apos;s Email
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-600 uppercase border border-slate-300 rounded-tr-xl">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-slate-500 border border-slate-300"
                >
                  No dealers found.
                </td>
              </tr>
            ) : (
              pageItems.map((dealer) => (
                <tr key={dealer.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm text-center text-slate-700 border border-slate-300">
                    {dealer.createdDate}
                  </td>

                  <td className="px-6 py-4 text-sm text-center font-medium text-slate-800 border border-slate-300">
                    {dealer.dealerId}
                  </td>

                  <td className="px-6 py-4 text-sm text-center font-semibold text-slate-800 border border-slate-300">
                    {dealer.dealerName}
                  </td>

                  <td className="px-6 py-4 text-sm text-center text-slate-600 border border-slate-300">
                    {dealer.email}
                  </td>

                  <td className="px-6 py-4 text-sm text-center border border-slate-300">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(dealer)}
                        className="inline-flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition cursor-pointer"
                        type="button"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => handleEdit(dealer)}
                        className="inline-flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 p-2 rounded-full transition cursor-pointer"
                        type="button"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(dealer)}
                        className="inline-flex items-center justify-center text-slate-600 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition cursor-pointer"
                        type="button"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-white">
        <p className="text-sm text-slate-600">
          {totalItems === 0 ? (
            <>Showing 0 entries</>
          ) : (
            <>
              Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
              <span className="font-semibold">{endIndex}</span> of{" "}
              <span className="font-semibold">{totalItems}</span> entries
            </>
          )}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            className="px-3 py-2 text-sm rounded-xl border border-[#07589E] text-[#07589E] hover:bg-[#07589E] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            type="button"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const active = pageNum === safePage;

            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={[
                  "h-9 w-9 text-sm rounded-xl border transition",
                  active
                    ? "border-[#07589E] bg-[#07589E] text-white cursor-pointer"
                    : "border-[#07589E] text-[#07589E] hover:bg-[#07589E] hover:text-white cursor-pointer",
                ].join(" ")}
                type="button"
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            className="px-3 py-2 text-sm rounded-xl border border-[#07589E] text-[#07589E] hover:bg-[#07589E] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            type="button"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
            type="button"
            aria-label="Close modal"
          />

          {/* Modal Container */}
          <div className="relative w-[92%] max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {modalType === "view"
                    ? "Dealer Details"
                    : modalType === "add"
                      ? "Add New Dealer"
                      : "Edit Dealer"}
                </h3>
                <p className="text-sm text-slate-500">
                  {modalType === "view"
                    ? "View full information about this dealer"
                    : "Enter dealer information below"}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition"
                type="button"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {modalType === "view" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem
                    label="Created Date"
                    value={selectedDealer?.createdDate}
                  />
                  <InfoItem
                    label="Dealer ID"
                    value={selectedDealer?.dealerId}
                  />
                  <InfoItem
                    label="Dealer Name"
                    value={selectedDealer?.dealerName}
                  />
                  <InfoItem label="Email" value={selectedDealer?.email} />
                  <InfoItem
                    label="Contact Number"
                    value={selectedDealer?.contact}
                  />
                  <InfoItem label="VIN" value={selectedDealer?.vin} />
                  <div className="sm:col-span-2">
                    <InfoItem label="Address" value={selectedDealer?.address} />
                  </div>
                </div>
              ) : (
                <form
                  id="dealer-form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Dealer Name"
                      name="dealerName"
                      defaultValue={selectedDealer?.dealerName}
                      placeholder="e.g. Esther Howard"
                      required
                    />
                    <FormInput
                      label="Dealer ID"
                      name="dealerId"
                      defaultValue={selectedDealer?.dealerId}
                      placeholder="e.g. DE3456"
                      required
                    />
                    <FormInput
                      label="Email"
                      name="email"
                      type="email"
                      defaultValue={selectedDealer?.email}
                      placeholder="e.g. howard@gmail.com"
                      required
                    />
                    <FormInput
                      label="Contact Number"
                      name="contact"
                      defaultValue={selectedDealer?.contact}
                      placeholder="e.g. +880 1711-000000"
                      required
                    />
                    <FormInput
                      label="VIN"
                      name="vin"
                      defaultValue={selectedDealer?.vin}
                      placeholder="e.g. 1HGCM82633A004352"
                    />
                    <FormInput
                      label="Created Date"
                      name="createdDate"
                      type="text"
                      defaultValue={
                        selectedDealer?.createdDate ||
                        new Date().toLocaleDateString("en-GB")
                      }
                      placeholder="e.g. 28/12/2022"
                    />
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Address
                      </label>
                      <textarea
                        name="address"
                        defaultValue={selectedDealer?.address}
                        placeholder="Enter full address"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition min-h-[100px]"
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              {modalType !== "view" && (
                <button
                  form="dealer-form"
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#07589E] cursor-pointer text-white hover:bg-[#07589E]/80 transition"
                >
                  {modalType === "add" ? "Add Dealer" : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-slate-800 wrap-break-word">
        {value ?? "—"}
      </div>
    </div>
  );
}

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}

function FormInput({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required = false,
}: FormInputProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition"
      />
    </div>
  );
}
