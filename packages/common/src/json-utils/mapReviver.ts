export function mapSetReplacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      $type: "Map",
      value: Array.from(value.entries()), // Convert Map to array of entries
    };
  }
  if (value instanceof Set) {
    return {
      $type: "Set",
      value: Array.from(value), // Convert Set to array of values
    };
  }
  return value; // Leave other values unchanged
}

export function mapSetReviver(key: string, value: any) {
  if (value && value.$type === "Map") {
    return new Map(value.value); // Rebuild Map from entries array
  }
  if (value && value.$type === "Set") {
    return new Set(value.value); // Rebuild Set from values array
  }
  return value; // Leave other values unchanged
}
