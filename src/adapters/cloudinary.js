import { pickAll, keys } from 'ramda'
import { create, object, string, array } from 'superstruct'

export default function (data) {
  console.log(data, 'data')
  const props = {
    metadata: object(),
    public_id: string(),
    secure_url: string(),
    tags: array(),
    asset_id: string()
  }

  return create(pickAll(keys(props))(data), object(props))
}
