import faunaDB from 'faunadb'
import { add as addNewItem } from './queries/item'

class QueryManager {
  constructor (token) {
    this.bootstrapToken = token || process.env.FAUNA_KEY
    this.client = new faunaDB.Client({
      secret: token || this.bootstrapToken
    })
  }

  async storeItem (data) {
    return await addNewItem(this.client, data)
  }
}

const faunadb = new QueryManager()

export { faunadb, QueryManager }
