import CryptoJS from 'crypto-js'
import Cookies from 'universal-cookie'

export function hash(text) {
  return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex)
}

const cookies = new Cookies()

export function getCsrfToken() {
  return cookies.get('csrftoken')
}
