import { assert, object, string } from 'superstruct'

export default class {
  constructor (data) {
    this.data = parse(data)
    console.log(this.data, 'data')
    this.headers = {
      Authorization: `Bearer ${process.env.NOTION_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2021-05-13'
    }
  }

  async store () {
    const resource = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(this.data)
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
