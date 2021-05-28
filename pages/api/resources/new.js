import { keys, pickAll } from 'ramda'
import { object, string, create, array } from 'superstruct'
import faunadb from 'faunadb'
const q = faunadb.query

const client = new faunadb.Client({
  secret: process.env.FAUNA_KEY
})

export default async function (req, res) {
  try {
    const { from, to } = getRoute(req.query)
    const asset = buildAsset(await req.body)
    const notionResponse = await sendToNotion(asset)
    const resource = await storeInFauna({
      ...asset,
      notionId: notionResponse.id
    })

    res.send(resource)
  } catch (err) {
    console.error(err)
    res.send(err)
  }
}

function getRoute (query) {
  const Route = object({ from: string(), to: string() })
  return create(query, Route)
}

function buildAsset (input) {
  const requiredProps = {
    metadata: object(),
    public_id: string(),
    secure_url: string(),
    tags: array(),
    asset_id: string()
  }

  const Asset = object(requiredProps)
  const pickOnlyRequiredValues = pickAll(keys(requiredProps))

  return create(pickOnlyRequiredValues(input), Asset)
}

async function sendToNotion (asset) {
  const notionObject = {
    parent: { database_id: '24a2356964104481ac700d0ad77148c0' },
    properties: {
      Name: {
        title: [{ text: { content: Date.now().toString() } }]
      },
      Description: {
        rich_text: [{ text: { content: asset.metadata.metadata_ocr } }]
      },
      Url: {
        rich_text: [{ text: { content: asset.metadata.metadata_url } }]
      }
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              text: {
                content: asset.secure_url
              }
            }
          ]
        }
      }
    ]
  }

  try {
    const resource = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2021-05-13'
      },
      body: JSON.stringify(notionObject)
    })

    return await resource.json()
  } catch (err) {
    console.log(err)
  }
}

async function storeInFauna (item) {
  return await client.query(q.Create(q.Collection('items'), { data: item }))
}
