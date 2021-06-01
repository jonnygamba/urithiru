import { pickAll, keys } from 'ramda'
import { create, object, string, array } from 'superstruct'

export default function (from) {
  return function (data) {
    if (from === 'cloudinary') {
      try {
        const props = {
          metadata: object(),
          public_id: string(),
          secure_url: string(),
          tags: array(),
          asset_id: string(),
          original_filename: string()
        }

        return create(pickAll(keys(props))(data), object(props))
      } catch (error) {
        console.log(error)
        return error
      }
    }
  }
}
