export const ShowDate = (iso) => {
  const date = new Date(iso)
  const formated = date.toLocaleString(undefined, { hour12: false })
  return formated == 'Invalid Date' ? '-' : formated
}
