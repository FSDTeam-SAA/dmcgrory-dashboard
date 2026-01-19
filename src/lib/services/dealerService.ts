// src/lib/services/dealerService.ts
import {
  CreateDealerPayload,
  CreateDealerResponse,
  DealersResponse,
  DeleteDealerResponse,
  UpdateDealerResponse,
} from "../types/dealer";
import axiosInstance from "../instance/axios-instance";

class DealerService {
  private baseUrl = "/dealer";

  /**
   * Get all dealers
   */
  async getAllDealers(signal?: AbortSignal): Promise<DealersResponse> {
    const response = await axiosInstance.get<DealersResponse>(this.baseUrl, {
      signal,
    });
    return response.data;
  }

  /**
   * Create a new dealer
   */
  async createDealer(
    payload: CreateDealerPayload,
  ): Promise<CreateDealerResponse> {
    const response = await axiosInstance.post<CreateDealerResponse>(
      this.baseUrl + "/create",
      payload,
    );
    return response.data;
  }

  /**
   * Delete a dealer
   */
  async deleteDealer(id: string): Promise<DeleteDealerResponse> {
    const response = await axiosInstance.delete<DeleteDealerResponse>(
      `${this.baseUrl}/${id}`,
    );
    return response.data;
  }

  /**
   * Update a dealer
   */
  async updateDealer(
    id: string,
    payload: Partial<CreateDealerPayload>,
  ): Promise<UpdateDealerResponse> {
    const response = await axiosInstance.patch<UpdateDealerResponse>(
      `${this.baseUrl}/${id}`,
      payload,
    );
    return response.data;
  }
}

export const dealerService = new DealerService();
