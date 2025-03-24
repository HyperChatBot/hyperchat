import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { ImapFlow } from 'imapflow'
import { Source, simpleParser } from 'mailparser'

class AiMail {
  private imapFlowClient: ImapFlow

  constructor() {
    this.imapFlowClient = new ImapFlow({
      host: 'imap.gmail.com',
      port: 993,
      secure: true,
      auth: {
        user: process.env.GMAIL_ADDRESS as string,
        pass: process.env.GMAIL_PASSWORD
      }
    })
  }

  public async initialize() {
    try {
      await this.imapFlowClient.connect()
      await this.imapFlowClient.mailboxOpen('INBOX')
      return this.getMailInfo()
    } catch {
      return new Error('Could not connect Mail service.')
    }
  }

  public getMailInfo() {
    return {
      authenticated: this.imapFlowClient.authenticated,
      capabilities: this.imapFlowClient.capabilities,
      enabled: this.imapFlowClient.enabled,
      id: this.imapFlowClient.id,
      idling: this.imapFlowClient.idling,
      mailbox: this.imapFlowClient.mailbox,
      secureConnection: this.imapFlowClient.secureConnection,
      serverInfo: this.imapFlowClient.serverInfo,
      usable: this.imapFlowClient.usable
    }
  }

  private async aiAnalyze(html: string) {
    try {
      const { text } = await generateText({
        model: openai('gpt-4o'),
        system:
          'You are a helpful assistant to summarize the given Mail html string. Less than 100 words.',
        messages: [{ role: 'user', content: html }]
      })

      return text
    } catch (err) {
      console.error('AI Analysis failed', err)
    }
  }

  public watchNewMail(callback: (text: string) => void) {
    this.imapFlowClient.on('exists', () => {
      this.fetchTheNewestMail()
        .then((text) => {
          if (typeof text === 'string') {
            callback(text)
          }
        })
        .catch(() => {
          // TODO:
        })
    })
  }

  private fetchTheNewestMail = async () => {
    try {
      const message = await this.imapFlowClient.fetchOne('*', { source: true })
      const source = Buffer.from(message.source)
      const response = await this.parseMail(source)

      if (typeof response?.html === 'string') {
        return this.aiAnalyze(response.html)
      }
    } catch (err) {
      console.error('Failed to fetch Mail', err)
    }
  }

  private parseMail = async (source: Source) => {
    try {
      const parsedMail = await simpleParser(source)

      return {
        subject: parsedMail.subject,
        text: parsedMail.text,
        html: parsedMail.html,
        attachments: parsedMail.attachments
      }
    } catch (err) {
      console.error('Failed to parse Mail', err)
    }
  }
}

export default AiMail
