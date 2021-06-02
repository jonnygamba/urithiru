import faunaDB from 'faunadb'
import { add as addNewItem } from './queries/item'

function queryManager (token) {
  const bootstrapToken = token || process.env.FAUNA_KEY
  const client = new faunaDB.Client({
    secret: token || bootstrapToken
  })

  return async function (data) {
    return await addNewItem(client, data)
  }
}

const faunadb = queryManager()

export { faunadb, queryManager }
