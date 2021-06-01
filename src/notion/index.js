import { assert, object, string } from 'superstruct'

export default function (url) {
  const headers = {
    Authorization: `Bearer ${process.env.NOTION_KEY}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2021-05-13'
  }

  return async function (input) {
    const data = parse(input)
    const resource = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    })

    return await resource.json()
  }
}

function parse (asset) {
  validate(asset)
  return {
    parent: { database_id: '24a2356964104481ac700d0ad77148c0' },
    properties: {
      Name: {
        title: [{ text: { content: asset.title } }]
      },
      Description: {
        rich_text: [{ text: { content: asset.description } }]
      },
      Url: {
        rich_text: [{ text: { content: asset.url } }]
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
                content: asset.content
              }
            }
          ]
        }
      }
    ]
  }
}

function validate (data) {
  const Asset = object({
    title: string(),
    url: string(),
    description: string(),
    content: string()
  })

  return assert(data, Asset)
}
