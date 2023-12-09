function validateResponseBody(body: object, keys: string[]) {
  for (let i = 0; i < keys.length; i++) {
    if (Object.hasOwn(body, keys[i])) continue;
    return false;
  }
  return true;
}

export { validateResponseBody };
