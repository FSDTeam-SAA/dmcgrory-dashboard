"use client";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useDealers, useDeleteDealer } from "@/lib/hooks/useDealer";
import { Dealer } from "@/lib/types/dealer";
import { toast } from "sonner";
import { useOverview } from "@/lib/hooks/useOverView";

export default function Overview() {
  const { data: dealersData, isLoading } = useDealers();
  const deleteDealerMutation = useDeleteDealer();

  const { data: overviewData, isLoading: overviewLoading } = useOverview();

  // Use real data from API
  const dealers = useMemo(() => {
    return dealersData?.data || [];
  }, [dealersData]);

  const stats = useMemo(() => {
    return (
      overviewData?.data || {
        totalDealers: 0,
        totalAnnouncements: 0,
      }
    );
  }, [overviewData]);

  // Take latest 5 dealers for overview
  const latestDealers = useMemo(() => {
    return dealers.slice(0, 5);
  }, [dealers]);

  const handleDelete = async (dealer: Dealer) => {
    try {
      await deleteDealerMutation.mutateAsync(dealer._id);
      toast.success("Dealer deleted successfully");
    } catch (error) {
      console.error("Failed to delete dealer:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8"
    >
      <div className="mx-auto container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">
            Total Revenue
          </h1>
          <p className="text-slate-500 text-sm">
            Monitor monthly dealership instantly
          </p>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* Total Dealer Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-blue-500 to-blue-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-blue-100 text-sm mb-2 font-medium">
              Total Dealer
            </div>
            <div className="text-white text-4xl font-bold">
              {overviewLoading ? "..." : `${stats.totalDealers} Dealers`}
            </div>
          </motion.div>

          {/* Submissions Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-md border border-slate-200 hover:shadow-lg transition-shadow"
          >
            <div className="text-slate-600 text-sm mb-2 font-medium">
              Submissions
            </div>
            <div className="text-blue-600 text-4xl font-bold">
              {overviewLoading
                ? "..."
                : `${stats.totalAnnouncements} Submissions`}
            </div>
          </motion.div>
        </motion.div>

        {/* Latest Dealers Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-1">
              Latest Dealers
            </h2>
            <p className="text-slate-500 text-sm">
              Get the information of car dealers
            </p>
          </div>

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
                  <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-slate-600 uppercase border border-slate-300">
                    Contact
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
                      colSpan={7}
                      className="px-6 py-10 border border-slate-300 bg-white"
                    >
                      <div className="flex flex-col items-center justify-center gap-4">
                        {/* Spinner */}
                        <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-[#07589E] animate-spin" />

                        {/* Text */}
                        <p className="text-sm text-slate-600 font-medium">
                          Loading dealers...
                        </p>

                        {/* Skeleton lines */}
                        <div className="w-full max-w-md space-y-2">
                          <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
                          <div className="h-3 w-5/6 bg-slate-100 rounded animate-pulse" />
                          <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : latestDealers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm text-slate-500 border border-slate-300"
                    >
                      No dealers found.
                    </td>
                  </tr>
                ) : (
                  latestDealers.map((dealer: Dealer) => (
                    <tr
                      key={dealer._id}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-center text-slate-700 border border-slate-300 ">
                        {dealer.createdAt
                          ? new Date(dealer.createdAt).toLocaleDateString(
                              "en-GB",
                            )
                          : "—"}
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

                      <td className="px-6 py-4 text-sm text-center text-slate-600 border border-slate-300">
                        {dealer.contact}
                      </td>

                      <td className="px-6 py-4 text-sm text-center border border-slate-300">
                        <button
                          onClick={() => handleDelete(dealer)}
                          className="inline-flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
