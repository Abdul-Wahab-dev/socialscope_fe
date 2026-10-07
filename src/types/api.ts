export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T, M = undefined> {
  success: true;
  message?: string;
  data: T;
  meta?: M;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId?: string;
}

export interface Paginated<T, M = PaginationMeta> {
  items: T[];
  meta: M;
}
