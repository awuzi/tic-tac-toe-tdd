export type Success<T> = {
  type: 'SUCCESS';
  result: T;
  map: <U>(fn: (t: T) => Result<U>) => Result<U>
}

export type Error<T> = {
  type: 'ERROR';
  message: string;
  map: <U>(fn: (t: T) => Result<U>) => Result<U>
}

export type Result<T> = Success<T> | Error<T>;

export const success = <T>(result: T): Success<T> => {
  return {
    result,
    type: 'SUCCESS',
    map: fn => fn(result)
  };
};

export const error = <T>(message: string): Error<T> => {
  return {
    type: 'ERROR',
    message,
    map: () => error(message)
  };
};
