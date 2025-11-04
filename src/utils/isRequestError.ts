import { RequestError } from './request'; // или путь, где определён RequestError

export function isRequestError(error: any): error is RequestError {
  return (
    error &&
    typeof error.message === 'string' &&
    (error.status === undefined || typeof error.status === 'number')
  );
}
