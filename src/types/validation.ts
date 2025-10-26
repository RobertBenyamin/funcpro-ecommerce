export type Validation<E, A> =
  | { type: 'Success'; value: A }
  | { type: 'Failure'; errors: E[] };

export type ValidationError = {
  field: string;
  message: string;
};
