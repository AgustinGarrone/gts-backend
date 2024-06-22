export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export enum TradeState {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}
