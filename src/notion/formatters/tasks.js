export function newTask (asset) {
  return {
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
}
