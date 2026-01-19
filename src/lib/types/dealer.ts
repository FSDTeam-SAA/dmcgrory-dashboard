// src/lib/types/dealer.ts

export interface Dealer {
  _id: string;
  dealerId: string;
  dealerName: string;
  email: string;
  contact: string;
  vin: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DealerMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DealersResponse {
  success: boolean;
  message: string;
  data: Dealer[];
  meta: DealerMeta;
}

export interface CreateDealerResponse {
  success: boolean;
  message: string;
  data: Dealer;
}

export interface DeleteDealerResponse {
  success: boolean;
  message: string;
}

export interface UpdateDealerResponse {
  success: boolean;
  message: string;
  data: Dealer;
}

export interface CreateDealerPayload {
  dealerId: string;
  dealerName: string;
  email: string;
  contact: string;
  vin: string;
}
