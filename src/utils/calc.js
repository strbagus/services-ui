export const changeUnit = (w, f, t) => {
  const d = {
    Ki: 1,
    Mi: 2,
    Gi: 3,
  }
  let res
  const ds = d[f] - d[t]
  if (ds > 0) {
    res = w * Math.pow(1024, ds)
  } else if (ds < 0) {
    res = w / Math.pow(1024, Math.abs(ds))
  } else {
    res = w
  }
  return Number(res?.toFixed(2))
}
