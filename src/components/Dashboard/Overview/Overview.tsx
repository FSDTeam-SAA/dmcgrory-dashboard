"use client"
import { Trash2 } from "lucide-react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useDealers, useDeleteDealer } from "@/lib/hooks/useDealer";
import { Dealer } from "@/lib/types/dealer";
import { toast } from "sonner";

export default function Overview() {
  const { data: dealersData, isLoading } = useDealers();
  const deleteDealerMutation = useDeleteDealer();

  // Use real data from API
  const dealers = useMemo(() => {
    return dealersData?.data || [];
  }, [dealersData]);

  // Take latest 5 dealers for overview
  const latestDealers = useMemo(() => {
    return dealers.slice(0, 5);
  }, [dealers]);

  const totalDealersCount = dealersData?.meta?.total || 0;

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
              {isLoading ? "..." : `${totalDealersCount} Dealers`}
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
              95 Submissions
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
                    VIN
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
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm text-slate-500 border border-slate-300"
                    >
                      Loading dealers...
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

                      <td className="px-6 py-4 text-sm text-center text-slate-600 border border-slate-300">
                        {dealer.vin}
                      </td>

                      <td className="px-6 py-4 text-sm text-center font-semibold text-slate-800 border border-slate-300">
                        {dealer.dealerName}
                      </td>

                      <td className="px-6 py-4 text-sm text-center text-slate-600 border border-slate-300">
                        {dealer.email}
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
