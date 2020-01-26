const byteToFloat = byte => byte / 255;

const mapEntries = (obj, mapFn) =>
  Object.entries(obj).reduce(
    (acc, curr) => ({ ...acc, [curr[0]]: mapFn(curr[1]) }),
    {}
  );

export { mapEntries, byteToFloat };
