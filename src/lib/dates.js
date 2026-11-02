export function formatDate(iso) {
  const date = new Date(iso)
  return iso && !Number.isNaN(date.getTime()) ? date.toLocaleString() : 'Date unknown'
}
