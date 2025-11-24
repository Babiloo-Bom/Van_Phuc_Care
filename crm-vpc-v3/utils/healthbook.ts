// Hàm lấy label từ value dựa trên options
export function getHealthRecordOptionLabel(value: string, options: Array<{ label: string; value: string }>): string {
  const found = options.find((opt) => opt.value === value);
  return found ? found.label : value || "";
}
