export const timestampToDate = createdAt => {
  const myDate = new Date(createdAt)
  return `${myDate.getMonth() + 1}/${myDate.getDate()}/${myDate.getFullYear()}`
}

export const formatDate = date => {
  return `${date?.getFullYear()}-${date?.getMonth() + 1}-${date?.getDate()}`
}

export const trimDate = date => {
  let array = date.split("-")
  return `${parseInt(array[0])}-${parseInt(array[1])}-${parseInt(array[2])}}`
}
