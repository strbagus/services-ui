export const ShowDate = (iso) => {
  const date = new Date(iso)
  const formated = date.toLocaleString()
  return formated == 'Invalid Date' ? '-' : formated
}
