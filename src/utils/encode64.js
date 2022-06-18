export const encodeBase64 = (str) => {
  return str
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '-')
    .replace(/=/g, '')
}

const randomString = (number) => {
  let randomString = ''
  const possibleChars = 'abcdefghijklmnopqrstuvwxyz1234567890'
  let i = 0
  while (i <= number) {
    randomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length))
    i++
  }
  return randomString
}

export const verifier = encodeBase64(randomString(64))
