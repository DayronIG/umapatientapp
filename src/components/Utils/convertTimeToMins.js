export default function (time) {
  const minsFromHours = parseInt(time.slice(0, 2)) * 60
  const mins = parseInt(time.slice(3, 5))
  return mins + minsFromHours
}