export const setAuth = (token, role, name) => {
  localStorage.setItem('campus_token', token)
  localStorage.setItem('campus_role', role)
  localStorage.setItem('campus_name', name)
}
export const clearAuth = ()=>{
  localStorage.removeItem('campus_token')
  localStorage.removeItem('campus_role')
  localStorage.removeItem('campus_name')
}
export const getToken = ()=> localStorage.getItem('campus_token')
export const getRole = ()=> localStorage.getItem('campus_role')
export const getName = ()=> localStorage.getItem('campus_name')
