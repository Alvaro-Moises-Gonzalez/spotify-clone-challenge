import { encodeBase64, verifier } from './encode64'
import sha256 from 'crypto-js/sha256'

export const challenge = encodeBase64(Array(sha256(verifier)))
