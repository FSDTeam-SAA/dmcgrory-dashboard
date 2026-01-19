// src/lib/hooks/useDealer.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dealerService } from "../services/dealerService";
import { CreateDealerPayload, DealersResponse } from "../types/dealer";

// Get All Dealers
export function useDealers() {
  return useQuery<DealersResponse>({
    queryKey: ["dealers"],
    queryFn: async ({ signal }) => {
      const response = await dealerService.getAllDealers(signal);
      return response;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

// Create New Dealer
export function useCreateDealer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDealerPayload) =>
      dealerService.createDealer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dealers"] });
    },
  });
}

// Update Dealer
export function useUpdateDealer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateDealerPayload>;
    }) => dealerService.updateDealer(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dealers"] });
    },
  });
}

// Delete Dealer
export function useDeleteDealer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dealerService.deleteDealer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dealers"] });
    },
  });
}
