import { AudioWaveform, BookOpen } from 'lucide-react'

export const data = {
  navMain: [
    {
      title: 'General',
      icon: AudioWaveform
    },
    {
      title: 'Provider',
      icon: BookOpen,
      items: [
        {
          title: 'OpenAI GPT'
        },
        {
          title: 'Azure OpenAI'
        },
        {
          title: 'Anthropic Claude'
        },
        {
          title: 'Google Gemini'
        },
        {
          title: 'xAI Grok'
        },
        {
          title: 'Ollama'
        }
      ]
    },
    {
      title: 'Software Update'
    },
    {
      title: 'About Hyper Chat'
    }
  ]
}
