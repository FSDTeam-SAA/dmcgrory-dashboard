import { useQuery } from "@tanstack/react-query";
import { overviewService } from "../services/overViewService";
import { OverviewResponse } from "../types/submission";

// Get All Overview
export function useOverview() {
  return useQuery<OverviewResponse>({
    queryKey: ["overview"],
    queryFn: async ({ signal }) => {
      return overviewService.getAllSubmissions(signal);
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
