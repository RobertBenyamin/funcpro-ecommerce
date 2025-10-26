export type Result<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export type ApiResponse<T> = Result<T, ApiError>;

export type ApiError = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};

// Pagination types
export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
