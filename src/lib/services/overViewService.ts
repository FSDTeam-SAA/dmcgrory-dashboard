import { OverviewResponse } from "../types/submission";
import axiosInstance from "../instance/axios-instance";

class OverviewService {
  private baseUrl = "/submissions/totals";

  /**
   * Get all submissions totals
   */
  async getAllSubmissions(signal?: AbortSignal): Promise<OverviewResponse> {
    const response = await axiosInstance.get<OverviewResponse>(this.baseUrl, {
      signal,
    });
    return response.data;
  }
}

export const overviewService = new OverviewService();
