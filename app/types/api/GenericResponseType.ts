import type { NetworkResponseStatus } from "./ResponseStatusType";
type TData<T> = { status: NetworkResponseStatus; result: T };
export class GenericResponse<T> {
  private status: NetworkResponseStatus;
  private result: T;

  constructor(private data: TData<T>) {
    this.status = this.data.status;
    this.result = this.data.result;
  }

  getStatus() {
    return this.status;
  }

  getResult() {
    return this.result;
  }
}
export interface BaseResponse<T> {
  result: T;
  status: NetworkResponseStatus;
}
