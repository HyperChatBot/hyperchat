import { Button, Card, Label, Select, TextInput } from 'flowbite-react'
import { FC, useState } from 'react'
import Divider from 'src/components/Divider'
import {
  audios,
  chatCompletions,
  edits,
  moderations,
  textCompletions
} from 'src/openai/models'

const Settings: FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => setShowPassword(!showPassword)

  return (
    <section className="w-full">
      <p className="pb-4 pl-8 pr-8 pt-4 text-xl font-semibold dark:text-white">
        Settings
      </p>

      <Divider />

      <div className="no-scrollbar flex h-[calc(100vh_-_3.8125rem)] w-full flex-col gap-8 overflow-y-scroll p-6">
        <Card className="w-3/5 shadow-none">
          <form>
            <div className="mb-6">
              <div className="mb-2 block">
                <span className="text-red-600">* </span>
                <Label htmlFor="$$openai-secret-key" value="Secret Key" />
              </div>
              <div className="flex">
                <div className="w-full">
                  <TextInput
                    required
                    id="$$openai-secret-key"
                    type="password"
                    sizing="sm"
                    placeholder="Enter OpenAI Secret Key"
                    helperText={
                      <>Your secret key will only be stored in IndexedDB.</>
                    }
                  />
                </div>
                <Button className="ml-4 cursor-pointer" type="submit">
                  Save
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-2 block">
                <Label
                  htmlFor="$$openai-organization-key"
                  value="Organization ID"
                />
              </div>
              <div className="flex">
                <div className="w-full">
                  <TextInput
                    id="$$openai-organization-key"
                    type="text"
                    sizing="sm"
                    placeholder="Enter OpenAI Organization ID"
                  />
                </div>
                <Button className="ml-4 cursor-pointer" type="submit">
                  Save
                </Button>
              </div>
            </div>

            <div className="mb-6 flex flex-col">
              <Label htmlFor="$$assistant-avatar" value="Assistant Avatar" />
              <div className="mt-2 flex items-center">
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80"
                  alt="Current profile photo"
                />
                <label className="block">
                  <span className="sr-only">Choose assistant avatar</span>
                  <input
                    id="$$assistant-avatar"
                    type="file"
                    className="ml-4 block w-full rounded-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
                  />
                </label>
              </div>
            </div>

            <div className="mb-6 flex flex-col">
              <Label htmlFor="$$user-avatar" value="User Avatar" />
              <div className="mt-2 flex items-center">
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80"
                  alt="Current profile photo"
                />
                <label className="block">
                  <span className="sr-only">Choose user avatar</span>
                  <input
                    id="$$user-avatar"
                    type="file"
                    className="ml-4 block w-full rounded-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
                  />
                </label>
              </div>
            </div>
          </form>
        </Card>

        <Card className="mb-8 w-3/5 shadow-none">
          <form>
            <div id="$$chat-completion-model-selector" className="mb-6">
              <div className="mb-2 block">
                <Label
                  htmlFor="$$chat-completion-model-selector"
                  value="Chat Completion Model"
                />
              </div>
              <Select id="$$chat-completion-model-selector" required={true}>
                {chatCompletions.map((chatCompletion) => (
                  <option key={chatCompletion}>{chatCompletion}</option>
                ))}
              </Select>
            </div>

            <div id="$$text-completion-model-selector" className="mb-6">
              <div className="mb-2 block">
                <Label
                  htmlFor="$$text-completion-model-selector"
                  value="Text Completion Model"
                />
              </div>
              <Select id="$$text-completion-model-selector" required={true}>
                {textCompletions.map((textCompletion) => (
                  <option key={textCompletion}>{textCompletion}</option>
                ))}
              </Select>
            </div>

            <div id="$$edits-model-selector" className="mb-6">
              <div className="mb-2 block">
                <Label htmlFor="$$edits-model-selector" value="Edits Model" />
              </div>
              <Select id="$$edits-model-selector" required={true}>
                {edits.map((edit) => (
                  <option key={edit}>{edit}</option>
                ))}
              </Select>
            </div>

            <div id="$$audio-model-selector" className="mb-6">
              <div className="mb-2 block">
                <Label htmlFor="$$audio-model-selector" value="Audio Model" />
              </div>
              <Select id="$$audio-model-selector" required={true}>
                {audios.map((audio) => (
                  <option key={audio}>{audio}</option>
                ))}
              </Select>
            </div>

            <div id="$$moderations-model-selector" className="mb-6">
              <div className="mb-2 block">
                <Label
                  htmlFor="$$moderations-model-selector"
                  value="Moderations Model"
                />
              </div>
              <Select id="$$moderations-model-selector" required={true}>
                {moderations.map((moderation) => (
                  <option key={moderation}>{moderation}</option>
                ))}
              </Select>
            </div>
          </form>
        </Card>
      </div>
    </section>
  )
}

export default Settings
