export function sql(
  strings: TemplateStringsArray,
  ...values: any[]
): { query: string; params: any[] } {
  let params: any[] = [];
  const query = strings.reduce((acc, str, i) => {
    if (i < values.length) {
      const value = values[i];
      if (Array.isArray(value)) {
        // Expand arrays into individual placeholders
        const placeholders = value.map(
          (_, index) => `$${params.length + index + 1}`,
        );
        params = params.concat(value);
        return `${acc}${str}(${placeholders.join(", ")})`;
      } else {
        // Regular substitution
        params.push(value);
        return `${acc}${str}$${params.length}`;
      }
    }
    return acc + str;
  }, "");
  return { query, params };
}
