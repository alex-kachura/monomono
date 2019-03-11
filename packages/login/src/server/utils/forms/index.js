
export function mergeValuesWithFields(values, fields) {
  return fields.map((field) => ({
    ...field,
    value: values[field.id] || '',
  }));
}
