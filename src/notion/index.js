import { newTask } from './formatters/tasks'

class Notion {
  constructor () {
    this.headers = {
      Authorization: `Bearer ${process.env.NOTION_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2021-05-13'
    }
  }

  addTask (data) {
    return this.sendToNotion(newTask(data))
  }

  async sendToNotion (data) {
    try {
      const resource = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      })

      return await resource.json()
    } catch (err) {
      console.log(err)
    }
  }
}

const notion = new Notion()

export { notion }
