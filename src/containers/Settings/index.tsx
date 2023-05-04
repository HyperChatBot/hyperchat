import { MoonIcon } from '@heroicons/react/24/outline'
import { SunIcon } from '@heroicons/react/24/solid'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { FC, useState } from 'react'
import ChatGPTImg from 'src/assets/chatgpt-avatar.png'
import { SolidSettingsBrightnessIcon } from 'src/components/Icons'
import {
  audioResponseTypes,
  audios,
  chatCompletions,
  edits,
  imageSizes,
  moderations,
  textCompletions
} from 'src/openai/models'

const Settings: FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => setShowPassword(!showPassword)

  return (
    <section className="w-full">
      <p className="px-6 py-4 text-xl font-semibold dark:text-white">
        Settings
      </p>

      <Divider />

      <div className="no-scrollbar h-[calc(100vh_-_3.8125rem)] w-full overflow-y-scroll p-6">
        <Box
          component="form"
          noValidate
          autoComplete="off"
          className="flex flex-col gap-8"
        >
          <section className="flex flex-col gap-6">
            <header className="text-xl font-medium">OpenAI Account</header>

            <TextField
              required
              id="openai-secret-key-input"
              label="Secret Key"
              size="small"
              type="password"
              helperText={
                <span>
                  <strong>
                    Your secret key will only be stored in IndexedDB!
                  </strong>{' '}
                  Do not share it with others or expose it in any client-side
                  code.
                </span>
              }
              className="w-160"
            />

            <TextField
              id="openai-organization-id-input"
              label="Organization ID"
              size="small"
              type="text"
              className="w-160"
              helperText="For users who belong to multiple organizations, you can pass a header to specify which organization is used for an API request. Usage from these API requests will count against the specified organization's subscription quota."
            />

            <TextField
              id="openai-author-name-input"
              label="Author Name"
              size="small"
              type="text"
              className="w-160"
              helperText="The name of the author of this message. May contain a-z, A-Z, 0-9, and underscores, with a maximum length of 64 characters."
            />

            <Button variant="contained" sx={{ width: 'max-content' }}>
              Save
            </Button>
          </section>

          <Divider />

          <section className="flex flex-col gap-6">
            <header className="text-xl font-medium">Customization</header>

            <section>
              <Typography variant="body1">Theme</Typography>
              <ToggleButtonGroup
                color="primary"
                value={'web'}
                exclusive
                onChange={() => {}}
                aria-label="Platform"
                sx={{
                  marginTop: 1,
                  '& .Mui-selected': {
                    borderColor: '#615ef0'
                  }
                }}
              >
                <ToggleButton disableRipple value="web">
                  <SunIcon className="mr-2 h-6 w-6" /> Light
                </ToggleButton>
                <ToggleButton disableRipple value="android">
                  <SolidSettingsBrightnessIcon className="mr-2 h-6 w-6" />{' '}
                  System
                </ToggleButton>
                <ToggleButton disableRipple value="ios">
                  <MoonIcon className="mr-2 h-6 w-6" /> Dark
                </ToggleButton>
              </ToggleButtonGroup>
            </section>

            <section>
              <Typography variant="body1">Assistant Avatar</Typography>
              <FormHelperText>
                Upload your own assistant avatar for a better experience. The
                avatar will be shown in chat box.
              </FormHelperText>

              <section className="mt-2 flex items-center">
                <label className="cursor-pointer">
                  <Avatar
                    alt="assistant avatar"
                    src={ChatGPTImg}
                    sx={{ width: 128, height: 128 }}
                  />
                  <input hidden accept="image/*" type="file" />
                </label>
              </section>
            </section>
          </section>

          <Divider />

          <section className="flex flex-col gap-6">
            <header className="text-xl font-medium">Chat</header>

            <FormControl size="small">
              <InputLabel id="chat-model-select-label">Model</InputLabel>
              <Select
                className="w-80"
                labelId="chat-model-select-label"
                id="chat-model-select"
                value={chatCompletions[0]}
                label="Model"
                onChange={() => {}}
              >
                {chatCompletions.map((chatCompletion) => (
                  <MenuItem key={chatCompletion} value={chatCompletion}>
                    {chatCompletion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <section>
              <FormControlLabel
                control={<Switch defaultChecked disabled />}
                label="Stream Mode"
                labelPlacement="start"
                sx={{ marginLeft: 0 }}
              />
              <FormHelperText>
                Only stream mode is currently supported in chat completion.
              </FormHelperText>
            </section>
          </section>

          <Divider />

          <section className="flex flex-col gap-6">
            <header className="text-xl font-medium">Text Completions</header>

            <FormControl size="small">
              <InputLabel id="text-completion-model-select-label">
                Model
              </InputLabel>
              <Select
                className="w-80"
                labelId="text-completion-model-select-label"
                id="text-completion-model-select"
                value={textCompletions[0]}
                label="Model"
                onChange={() => {}}
              >
                {textCompletions.map((textCompletion) => (
                  <MenuItem key={textCompletion} value={textCompletion}>
                    {textCompletion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <section>
              <FormControlLabel
                control={<Switch disabled defaultChecked={false} />}
                label="Stream Mode"
                labelPlacement="start"
                sx={{ marginLeft: 0 }}
              />
              <FormHelperText>
                Currently, stream mode is not supported in text completion.
              </FormHelperText>
            </section>
          </section>

          <Divider />

          <section className="flex flex-col gap-6">
            <header className="text-xl font-medium">Edit</header>

            <FormControl size="small">
              <InputLabel id="edit-model-select-label">Model</InputLabel>
              <Select
                className="w-80"
                labelId="edit-model-select-label"
                id="edit-model-select"
                value={edits[0]}
                label="Model"
                onChange={() => {}}
              >
                {edits.map((edit) => (
                  <MenuItem key={edit} value={edit}>
                    {edit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </section>

          <Divider />

          <section className="flex flex-col gap-6">
            <header className="text-xl font-medium">Audio</header>

            <FormControl size="small">
              <InputLabel id="audio-transcription-model-select-label">
                Transcription Model
              </InputLabel>
              <Select
                className="w-80"
                labelId="audio-transcription-model-select-label"
                id="audio-transcription-model-select"
                value={audios[0]}
                disabled
                label="Transcription Model"
                onChange={() => {}}
              >
                {audios.map((audio) => (
                  <MenuItem key={audio} value={audio}>
                    {audio}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Only {audios[0]} is currently available.
              </FormHelperText>
            </FormControl>

            <FormControl size="small">
              <InputLabel id="audio-translation-model-select-label">
                Translation Model
              </InputLabel>
              <Select
                className="w-80"
                labelId="audio-translation-model-select-label"
                id="audio-translation-model-select"
                value={audios[0]}
                disabled
                label="Translation Model"
                onChange={() => {}}
              >
                {audios.map((audio) => (
                  <MenuItem key={audio} value={audio}>
                    {audio}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Only {audios[0]} is currently available.
              </FormHelperText>
            </FormControl>

            <FormControl size="small">
              <InputLabel id="audio-response-type-model-select-label">
                Audio Response Type
              </InputLabel>
              <Select
                className="w-80"
                labelId="audio-response-type-model-select-label"
                id="audio-response-type-model-select"
                value={audioResponseTypes[0]}
                label="Audio Response Type"
                onChange={() => {}}
              >
                {audioResponseTypes.map((audioResponseType) => (
                  <MenuItem key={audioResponseType} value={audioResponseType}>
                    {audioResponseType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider />

            <section className="flex flex-col gap-6">
              <header className="text-xl font-medium">Image Generations</header>

              <FormControl size="small">
                <InputLabel id="iamge-generation-model-select-label">
                  Size
                </InputLabel>
                <Select
                  className="w-80"
                  labelId="iamge-generation-model-select-label"
                  id="iamge-generation-model-select"
                  value={imageSizes[0]}
                  label="Size"
                  onChange={() => {}}
                >
                  {imageSizes.map((imageSize) => (
                    <MenuItem key={imageSize} value={imageSize}>
                      {imageSize}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </section>

            <Divider />

            <section className="flex flex-col gap-6">
              <header className="text-xl font-medium">Moderations</header>
              <FormControl size="small">
                <InputLabel id="moderation-model-select-label">
                  Model
                </InputLabel>
                <Select
                  className="w-80"
                  labelId="moderation-model-select-label"
                  id="moderation-model-select"
                  value={moderations[0]}
                  label="Model"
                  onChange={() => {}}
                >
                  {moderations.map((moderation) => (
                    <MenuItem key={moderation} value={moderation}>
                      {moderation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </section>
          </section>
        </Box>
      </div>
    </section>
  )
}

export default Settings
