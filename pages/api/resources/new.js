import { pipe, path } from 'ramda'
import from from '../../../src/from'
import notion from '../../../src/notion'
import { faunadb } from '../../../src/faunadb'

const storeInNotion = notion('https://api.notion.com/v1/pages')

export default async function (req, res) {
  try {
    const data = await req.body
    const notionResponse = await pipe(
      from('cloudinary'),
      normalize,
      storeInNotion
    )(data)

    const resource = await faunadb.storeItem({
      cloudinary: { ...data },
      notion: {
        id: notionResponse.id,
        parent: notionResponse.parent,
        name: path(
          ['properties', 'Name', 'title', 0, 'text', ''],
          notionResponse
        )
      }
    })

    res.status(201).json(resource)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

function normalize (data) {
  return {
    title: data.original_filename,
    description: data.metadata.metadata_ocr,
    url: data.metadata.metadata_url,
    content: data.secure_url
  }
}
