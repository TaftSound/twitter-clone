
let visitedUser = false

export const setVisitedUser = (userId) => {
  visitedUser = userId
  sessionStorage.setItem()
}

export const getVisitedUser = () => {
  return visitedUser
}