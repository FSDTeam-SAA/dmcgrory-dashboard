"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Submission } from "@/lib/types/submission";
import {
  useDeleteSubmission,
  useSubmissions,
} from "@/lib/hooks/useSubmissions";

export default function SubmissionForms() {
  const { data: submissionsData, isLoading } = useSubmissions();
  const deleteSubmissionMutation = useDeleteSubmission();

  const submissions = useMemo(() => {
    return submissionsData?.data || [];
  }, [submissionsData]);

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

  const handleDelete = async (submission: Submission) => {
    try {
      await deleteSubmissionMutation.mutateAsync(submission._id);
      toast.success("Submission deleted successfully");
    } catch (error) {
      console.error("Failed to delete submission:", error);
    }
  };

  // ===== Pagination =====
  const PAGE_SIZE = 5;
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
                VIN
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-600 uppercase border border-slate-300">
                Vehicle
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
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-slate-500 border border-slate-300"
                >
                  Loading submissions...
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-slate-500 border border-slate-300"
                >
                  No submissions found.
                </td>
              </tr>
            ) : (
              pageItems.map((submission) => (
                <tr
                  key={submission._id}
                  className="hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4 text-sm text-center text-slate-700 border border-slate-300">
                    {submission.createdAt
                      ? new Date(submission.createdAt).toLocaleDateString(
                          "en-GB",
                        )
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-center font-medium text-slate-800 border border-slate-300">
                    {submission.dealerId}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-slate-600 border border-slate-300">
                    {submission.vin}
                  </td>
                  <td className="px-6 py-4 text-sm text-center font-semibold text-slate-800 border border-slate-300">
                    {submission.vehicleYear} {submission.model}{" "}
                    {submission.series}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-slate-600 border border-slate-300">
                    {submission.mileage.toLocaleString()} km
                  </td>
                  <td className="px-6 py-4 text-sm text-center font-medium text-emerald-600 border border-slate-300">
                    ${submission.floorPrice.toLocaleString()}
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
                  value={
                    selectedSubmission.createdAt
                      ? new Date(selectedSubmission.createdAt).toLocaleString()
                      : "—"
                  }
                />
                <InfoItem
                  label="Dealer ID"
                  value={selectedSubmission.dealerId}
                />
                <InfoItem label="VIN" value={selectedSubmission.vin} />
                <InfoItem
                  label="Year"
                  value={String(selectedSubmission.vehicleYear)}
                />
                <InfoItem label="Model" value={selectedSubmission.model} />
                <InfoItem label="Series" value={selectedSubmission.series} />
                <InfoItem
                  label="Mileage"
                  value={`${selectedSubmission.mileage.toLocaleString()} km`}
                />
                <InfoItem label="Auction" value={selectedSubmission.auction} />
                <InfoItem
                  label="Interior Choice"
                  value={selectedSubmission.interiorChoice}
                />
                <InfoItem
                  label="Floor Price"
                  value={`$${selectedSubmission.floorPrice.toLocaleString()}`}
                />
                <div className="col-span-1 sm:col-span-2">
                  <InfoItem
                    label="Announcement"
                    value={selectedSubmission.announcement}
                  />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <InfoItem
                    label="Remarks"
                    value={selectedSubmission.remarks}
                  />
                </div>
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
