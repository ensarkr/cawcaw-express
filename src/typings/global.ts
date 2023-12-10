type doubleReturn<T> = T extends undefined
  ? { status: true } | { status: false; message: string }
  : { status: true; value: T } | { status: false; message: string };

export { doubleReturn };
