import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submissionsService } from "../services/submissionsService";
import { SubmissionsResponse } from "../types/submission";

// Get All Submissions
export function useSubmissions() {
  return useQuery<SubmissionsResponse>({
    queryKey: ["submissions"],
    queryFn: async ({ signal }) => {
      return submissionsService.getAllSubmissions(signal);
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

// Delete Submission
export function useDeleteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => submissionsService.deleteSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}
