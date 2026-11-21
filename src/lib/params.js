// Next gives search params as string | string[] | undefined.
export const first = (value) => (Array.isArray(value) ? value[0] : value) ?? "";

export const toPage = (value) => Math.max(1, parseInt(first(value), 10) || 1);