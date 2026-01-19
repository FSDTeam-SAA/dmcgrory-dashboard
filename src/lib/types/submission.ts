export interface Submission {
  _id: string;
  dealerId: string;
  auction: string;
  vin: string;
  vehicleYear: number;
  mileage: number;
  interiorChoice: string;
  model: string;
  series: string;
  floorPrice: number;
  announcement: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubmissionsResponse {
  success: boolean;
  message: string;
  data: Submission[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DeleteSubmissionResponse {
  success: boolean;
  message: string;
}

export interface OverviewData {
  totalDealers: number;
  totalAnnouncements: number;
}

export interface OverviewResponse {
  success: boolean;
  message: string;
  data: OverviewData;
}
