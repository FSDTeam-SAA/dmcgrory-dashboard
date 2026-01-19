"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Trash2, X } from "lucide-react";

interface Submission {
  id: number;
  createdDate: string;
  dealerId: string;
  modelsSeries: string;
  mileage: string;
  auctions: string;
  color: string;
  floorPrice: string;
}

export default function SubmissionForms() {
  const initialSubmissions: Submission[] = useMemo(
    () => [
      {
        id: 1,
        createdDate: "28/12/2022",
        dealerId: "DE3456",
        modelsSeries: "Toyota Corolla 2023",
        mileage: "12,000 km",
        auctions: "Live Auction A",
        color: "Silver",
        floorPrice: "$22,000",
      },
      {
        id: 2,
        createdDate: "02/04/2022",
        dealerId: "DE3258",
        modelsSeries: "Honda Civic 2022",
        mileage: "15,500 km",
        auctions: "Bidding B",
        color: "Black",
        floorPrice: "$24,500",
      },
      {
        id: 3,
        createdDate: "12/01/2023",
        dealerId: "DE9911",
        modelsSeries: "Mazda CX-5 2023",
        mileage: "8,000 km",
        auctions: "Premium Auction",
        color: "Soul Red",
        floorPrice: "$31,000",
      },
      {
        id: 4,
        createdDate: "23/06/2023",
        dealerId: "DE7788",
        modelsSeries: "Nissan Altima 2021",
        mileage: "45,000 km",
        auctions: "Global Auction C",
        color: "White",
        floorPrice: "$18,000",
      },
      {
        id: 5,
        createdDate: "15/07/2023",
        dealerId: "DE5544",
        modelsSeries: "BMW 3 Series 2024",
        mileage: "2,000 km",
        auctions: "Elite Sale",
        color: "Blue",
        floorPrice: "$42,000",
      },
    ],
    [],
  );

  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [open, setOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const handleView = (submission: Submission) => {
    setSelectedSubmission(submission);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedSubmission(null);
  };

  const handleDelete = (submission: Submission) => {
    const ok = confirm(`Delete submission for Dealer: ${submission.dealerId}?`);
    if (!ok) return;

    setSubmissions((prev) => prev.filter((s) => s.id !== submission.id));
    if (selectedSubmission?.id === submission.id) closeModal();
  };

  // ===== Pagination =====
  const PAGE_SIZE = 4;
  const [page, setPage] = useState(1);
  const totalItems = submissions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const pageItems = submissions.slice(startIndex, endIndex);

  const goToPage = (p: number) => {
    const next = Math.min(Math.max(p, 1), totalPages);
    setPage(next);
  };

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);
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
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-1">
          Submission Forms
        </h2>
        <p className="text-slate-500 text-sm">
          Review vehicle submission details
        </p>
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
                Models & Series
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-600 uppercase border border-slate-300">
                Mileage
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-600 uppercase border border-slate-300">
                Floor Price
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
                  colSpan={8}
                  className="px-6 py-10 text-center text-sm text-slate-500 border border-slate-300"
                >
                  No submissions found.
                </td>
              </tr>
            ) : (
              pageItems.map((submission) => (
                <tr
                  key={submission.id}
                  className="hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4 text-sm text-center text-slate-700 border border-slate-300">
                    {submission.createdDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-center font-medium text-slate-800 border border-slate-300">
                    {submission.dealerId}
                  </td>
                  <td className="px-6 py-4 text-sm text-center font-semibold text-slate-800 border border-slate-300">
                    {submission.modelsSeries}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-slate-600 border border-slate-300">
                    {submission.mileage}
                  </td>
                  <td className="px-6 py-4 text-sm text-center font-medium text-emerald-600 border border-slate-300">
                    {submission.floorPrice}
                  </td>
                  <td className="px-6 py-4 text-sm text-center border border-slate-300">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(submission)}
                        className="inline-flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition cursor-pointer"
                        title="View"
                      >
                        <Eye size={18} className="cursor-pointer" />
                      </button>
                      <button
                        onClick={() => handleDelete(submission)}
                        className="inline-flex items-center justify-center text-slate-600 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={18} className="cursor-pointer" />
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
          Showing{" "}
          <span className="font-semibold">
            {totalItems === 0 ? 0 : startIndex + 1}
          </span>{" "}
          to <span className="font-semibold">{endIndex}</span> of{" "}
          <span className="font-semibold">{totalItems}</span> entries
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            className="px-3 py-2 text-sm rounded-xl border border-[#07589E] text-[#07589E] cursor-pointer hover:bg-[#07589E] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`h-9 w-9 text-sm rounded-xl border transition ${
                safePage === i + 1
                  ? "border-[#07589E] bg-[#07589E] text-white cursor-pointer"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            className="px-3 py-2 text-sm rounded-xl border text-slate-700 cursor-pointer border-[#07589E] hover:bg-[#07589E] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* View Modal */}
      {open && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />
          <div className="relative w-[92%] max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Submission Details
                </h3>
                <p className="text-sm text-slate-500">
                  Full vehicle and dealer information
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  label="Created Date"
                  value={selectedSubmission.createdDate}
                />
                <InfoItem
                  label="Dealer ID"
                  value={selectedSubmission.dealerId}
                />
                <InfoItem
                  label="Models & Series"
                  value={selectedSubmission.modelsSeries}
                />
                <InfoItem label="Mileage" value={selectedSubmission.mileage} />
                <InfoItem
                  label="Auctions"
                  value={selectedSubmission.auctions}
                />
                <InfoItem label="Color" value={selectedSubmission.color} />
                <InfoItem
                  label="Floor Price"
                  value={selectedSubmission.floorPrice}
                />
              </div>
            </div>
            <div className="p-6 pt-0 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl bg-[#07589E] text-white hover:bg-[#07589E]/80 transition cursor-pointer"
              >
                Close
              </button>
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
