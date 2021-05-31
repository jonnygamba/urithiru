import faunadb from 'faunadb'
const q = faunadb.query

const client = new faunadb.Client({
  secret: process.env.FAUNA_KEY
})

export default async function (req, res) {
  return res.json(
    await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('items'))),
        q.Lambda((x) => q.Get(x))
      )
    )
  )
}
