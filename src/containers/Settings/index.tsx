import { Card, Label, Select, TextInput } from 'flowbite-react'
import { FC, useState } from 'react'
import Divider from 'src/components/Divider'
import {
  audios,
  chatCompletions,
  edits,
  embeddings,
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

      <form className=" no-scrollbar flex h-[calc(100vh_-_3.8125rem)] w-full flex-col gap-8 overflow-y-scroll p-6">
        <div className="w-3/5">
          <Card className="mb-6 shadow-none">
            <div>
              <div className="mb-2 block">
                <span className="text-red-600">* </span>
                <Label htmlFor="$$openai-secret-key" value="Secret Key" />
              </div>
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

            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="$$openai-organization-id"
                  value="Organization ID"
                />
              </div>
              <TextInput
                id="$$openai-organization-id"
                type="text"
                sizing="sm"
                placeholder="Enter OpenAI Organization ID"
              />
            </div>

            <form className="flex flex-col">
              <Label
                htmlFor="$$openai-organization-id"
                value="Organization ID"
              />
              <div className="mt-2 flex items-center">
                <div className="shrink-0">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80"
                    alt="Current profile photo"
                  />
                </div>
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    className="ml-4 block w-full rounded-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
                  />
                </label>
              </div>
            </form>
          </Card>

          <Card className="mb-8 shadow-none">
            <div id="select">
              <div className="mb-2 block">
                <Label htmlFor="countries" value="Chat Completion Model" />
              </div>
              <Select id="countries" required={true}>
                {chatCompletions.map((chatCompletion) => (
                  <option>{chatCompletion}</option>
                ))}
              </Select>
            </div>

            <div id="select">
              <div className="mb-2 block">
                <Label htmlFor="countries" value="Text Completion Model" />
              </div>
              <Select id="countries" required={true}>
                {textCompletions.map((textCompletion) => (
                  <option>{textCompletion}</option>
                ))}
              </Select>
            </div>

            <div id="select">
              <div className="mb-2 block">
                <Label htmlFor="countries" value="Edits Model" />
              </div>
              <Select id="countries" required={true}>
                {edits.map((edit) => (
                  <option>{edit}</option>
                ))}
              </Select>
            </div>

            <div id="select">
              <div className="mb-2 block">
                <Label htmlFor="countries" value="Audio Model" />
              </div>
              <Select id="countries" required={true}>
                {audios.map((audio) => (
                  <option>{audio}</option>
                ))}
              </Select>
            </div>

            <div id="select">
              <div className="mb-2 block">
                <Label htmlFor="countries" value="Embeddings Model" />
              </div>
              <Select id="countries" required={true}>
                {embeddings.map((embedding) => (
                  <option>{embedding}</option>
                ))}
              </Select>
            </div>

            <div id="select">
              <div className="mb-2 block">
                <Label htmlFor="countries" value="Moderations Model" />
              </div>
              <Select id="countries" required={true}>
                {moderations.map((moderation) => (
                  <option>{moderation}</option>
                ))}
              </Select>
            </div>
          </Card>
        </div>
      </form>
    </section>
  )
}

export default Settings
