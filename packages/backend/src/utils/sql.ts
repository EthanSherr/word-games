export function sql(
  strings: TemplateStringsArray,
  ...values: any[]
): { query: string; params: any[] } {
  const params = new Array<any>();
  const queryComponents = new Array<string | number>();
  for (let i = 0; i < strings.length; i++) {
    const str = strings[i];
    const value = values[i];
    if (i >= values.length) {
      queryComponents.push(str);
    } else if (Array.isArray(value)) {
      queryComponents.push(str);
      const arrayComponents = new Array<string>();
      for (const val of value) {
        params.push(val);
        arrayComponents.push(`$${params.length}`);
      }
      queryComponents.push(`(${arrayComponents.join(", ")})`);
    } else {
      params.push(value);
      queryComponents.push(str, `$${params.length}`);
    }
  }

  return {
    query: queryComponents.join(""),
    params,
  };
}
