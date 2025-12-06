const sortObj = (obj: any) => {
  const sorted: Record<any, any> = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((k) => (sorted[k] = obj[k]));
  return sorted;
};

export {
    sortObj
}