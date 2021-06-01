import { pipe } from 'ramda'
import from from '../../../src/from'
import Notion from '../../../src/notion'

export default async function (req, res) {
  try {
    const data = await req.body
    const normalizeFromCloudinary = pipe(from('cloudinary'), normalize)
    await new Notion(normalizeFromCloudinary(data)).store()

    // const resource = await faunadb.storeItem({
    //   cloudinary: { ...asset },
    //   notion: {
    //     id: response.id,
    //     parent: response.parent,
    //     name: path(
    //       ['properties', 'Name', 'title', 0, 'text', ''],
    //       response
    //     )
    //   }
    // })

    res.status(201).json({ tews: 'skhh' })
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
