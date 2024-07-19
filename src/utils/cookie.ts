function setCookie (cname: string, cvalue: string, exdays: number): void {
  const d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  const expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + '; ' + expires
}
function getCookie (cname: string): string {
  const name = cname + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim()
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}
function clearCookie (cname: string, cvalue: string, exdays: number): void {
  setCookie(cname, cvalue, exdays)
}
function checkCookie (cname: string, cookie: string, exdays: number): void {
  const user = getCookie(cname)
  if (user !== '') {
    setCookie('token', '', exdays)
  } else {
    setCookie('token', cookie, exdays)
  }
}
export { setCookie, getCookie, checkCookie, clearCookie }
