export function generateRandomString (number) {
  let randomString = ''
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  let i = 0
  while (i < number) {
    randomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length))
    i++
  }
  return randomString
}
