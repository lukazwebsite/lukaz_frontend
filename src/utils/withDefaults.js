// Fills blank text fields from `defaults`. A field counts as blank when it is
// missing, null or only spaces, so a section the admin has not filled in yet
// still shows its default heading instead of an empty gap.
export function withDefaults(source, defaults) {
  const result = { ...(source || {}) };

  for (const [key, fallback] of Object.entries(defaults)) {
    const value = result[key];
    if (typeof value !== "string" || value.trim() === "") {
      result[key] = fallback;
    }
  }

  return result;
}
