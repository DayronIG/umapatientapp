export default () => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  // alert(userAgent, window.navigator)
  return /iphone|ipad|ipod|Instagram|opera|instagram/.test(userAgent)
}