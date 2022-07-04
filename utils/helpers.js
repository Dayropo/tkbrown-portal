export const timestampToDate = createdAt => {
  const myDate = new Date(createdAt)
  return `${myDate.getMonth() + 1}/${myDate.getDate()}/${myDate.getFullYear()}`
}
