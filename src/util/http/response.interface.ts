export interface IResponse<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export const SuccessResponse = <T>(data: T): IResponse<T> => ({
  success: true,
  data,
});

export const ErrorResponse = <T>(errors: string[]): IResponse<T> => ({
  success: false,
  errors,
});
