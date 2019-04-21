import Cookies from 'js-cookie'

const RoleKey = 'Role'
const JwtTokenKey = 'JwtToken'
const userKey = 'userId'

export function setRole(role) {
  return Cookies.set(RoleKey, role)
}

export function getRole() {
  return Cookies.get(RoleKey)
}

export function removeRole() {
  return Cookies.remove(RoleKey)
}

export function setJwtToken(token) {
  return Cookies.set(JwtTokenKey, token)
}

export function getJwtToken() {
  return Cookies.get(JwtTokenKey)
}

export function removeJwtToken() {
  return Cookies.remove(JwtTokenKey)
}

export function setUserId(UserId) {
  return Cookies.set(userKey, UserId)
}

export function getUserId() {
  return Cookies.get(userKey)
}

export function removeUserId() {
  return Cookies.remove(userKey)
}
