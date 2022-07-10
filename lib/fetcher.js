import axios from "axios"

export const fetcher = async url => {
  const res = await axios.get(url)
  return res?.data
}

export const options = {
  revalidateOnFocus: false,
  refreshInterval: 120000,
}
