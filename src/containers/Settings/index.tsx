import {
  FileInput,
  Label,
  Select,
  TextInput,
  ToggleSwitch
} from 'flowbite-react'
import { FC, useState } from 'react'
import Divider from 'src/components/Divider'

const Settings: FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => setShowPassword(!showPassword)

  return (
    <section className="w-full">
      <p className=" pb-4 pl-8 pr-8 pt-4 text-xl font-semibold dark:text-white">
        Settings
      </p>
      <Divider />
      <div className="flex w-3/5 flex-col gap-4 p-6">
        <div>
          <div className="mb-2 block">
            <Label
              className="text-sm font-medium text-gray-900 dark:text-gray-300"
              htmlFor="small"
              value="Small input"
            />
          </div>
          <TextInput id="small" type="text" sizing="sm" />
        </div>

        <div>
          <div className="mb-2 block">
            <Label
              className="text-sm font-medium text-gray-900 dark:text-gray-300"
              htmlFor="small"
              value="Secret Key"
            />
          </div>
          <TextInput
            id="small"
            type="text"
            sizing="sm"
            placeholder="Enter OpenAI Secret Key"
            helperText="Your secret key will only be stored in IndexedDB."
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label
              className="text-sm font-medium text-gray-900 dark:text-gray-300"
              htmlFor="small"
              value="Organization ID"
            />
          </div>
          <TextInput
            id="small"
            type="text"
            sizing="sm"
            placeholder="Enter OpenAI Organization ID"
          />
        </div>

        <div id="fileUpload">
          <div className="mb-2 block">
            <Label
              className="text-sm font-medium text-gray-900 dark:text-gray-300"
              htmlFor="file"
              value="Assistant Avatar"
            />
          </div>
          <FileInput
            id="file"
            helperText="A profile picture is useful to confirm your are logged into your account"
          />
        </div>

        <div id="fileUpload">
          <div className="mb-2 block">
            <Label
              className="text-sm font-medium text-gray-900 dark:text-gray-300"
              htmlFor="file"
              value="User Avatar"
            />
          </div>
          <FileInput
            id="file"
            helperText="A profile picture is useful to confirm your are logged into your account"
          />
        </div>

        <div id="select">
          <div className="mb-2 block">
            <Label
              className="text-sm font-medium text-gray-900 dark:text-gray-300"
              htmlFor="countries"
              value="Select your country"
            />
          </div>
          <Select id="countries" required={true}>
            <option>gpt-3.5-turbo</option>
            <option>gpt-4</option>
          </Select>
        </div>

        <div className="flex flex-col gap-4" id="toggle">
          <ToggleSwitch
            checked={true}
            label="Toggle me (checked)"
            onChange={() => {}}
          />
        </div>
      </div>
    </section>
  )
}

export default Settings
