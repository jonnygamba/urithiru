import faunadb from 'faunadb'
const q = faunadb.query

const { Create, Collection } = q

export async function add (client, data) {
  return await client.query(Create(Collection('items'), { data }))
}
