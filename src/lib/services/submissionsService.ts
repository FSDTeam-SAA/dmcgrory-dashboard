import {
  DeleteSubmissionResponse,
  SubmissionsResponse,
} from "../types/submission";
import axiosInstance from "../instance/axios-instance";

class SubmissionsService {
  private baseUrl = "/submissions";

  /**
   * Get all submissions
   */
  async getAllSubmissions(signal?: AbortSignal): Promise<SubmissionsResponse> {
    const response = await axiosInstance.get<SubmissionsResponse>(
      this.baseUrl,
      {
        signal,
      },
    );
    return response.data;
  }

  /**
   * Delete a submission
   */
  async deleteSubmission(id: string): Promise<DeleteSubmissionResponse> {
    const response = await axiosInstance.delete<DeleteSubmissionResponse>(
      `${this.baseUrl}/${id}`,
    );
    return response.data;
  }
}

export const submissionsService = new SubmissionsService();
