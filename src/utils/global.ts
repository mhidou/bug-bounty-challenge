
export type ResultOrErrorResponse<T> =
  | readonly [T, null]
  | readonly [null, unknown];

export const resultOrError = async <T>(
  promise: Promise<T>
): Promise<ResultOrErrorResponse<T>> => {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};
