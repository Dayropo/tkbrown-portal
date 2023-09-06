import clientPromise from "."

let client
let db
let admins

async function init() {
  if (db) return
  try {
    client = await clientPromise
    console.log({ client })
    db = await client.db()
    console.log({ db })
    admins = await db.collections("admins")
    console.log({ admins })
  } catch (error) {
    throw new Error("Failed to establish connection to database")
  }
}

;(async () => {
  await init()
})()

export async function getAdmin(data) {
  try {
    if (!admins) await init()
    const result = await admins.findOne({ email: data.email })

    console.log({ result })

    return { admin: result }
  } catch (error) {
    return { error: "Failed to fetch admin!" }
  }
}
