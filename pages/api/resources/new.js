import { path } from 'ramda'
import { faunadb } from '../../../src/faunadb'
import buildFromCloudinary from '../../../src/adapters/cloudinary'
import { notion } from '../../../src/notion'

export default async function (req, res) {
  try {
    // const { from, to } = getRoute(req.query)
    const asset = buildFromCloudinary(await req.body)
    const response = await notion.addTask(asset)

    const resource = await faunadb.storeItem({
      cloudinary: { ...asset },
      notion: {
        id: response.id,
        parent: response.parent,
        name: path(
          ['properties', 'Name', 'title', 0, 'text', 'content'],
          response
        )
      }
    })

    res.status(201).json({ resource })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

// function getRoute (query) {
//   const Route = object({ from: string(), to: string() })
//   return create(query, Route)
// }
