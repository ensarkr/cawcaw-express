type doubleReturn<T> =
  | { status: true; value: T }
  | { status: false; message: string };

export { doubleReturn };
