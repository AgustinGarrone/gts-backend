export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export enum TradeState {
  PENDING = "PENDING",
  PROPOSED = "PROPOSED",
  COMPLETED = "COMPLETED",
}

export enum TradeResponse {
  REJECT = "REJECT",
  CONFIRM = "CONFIRM",
}
