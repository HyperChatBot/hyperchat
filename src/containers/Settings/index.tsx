import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { FC, useState } from 'react'
import Divider from 'src/components/Divider'
import {
  audioResponseTypes,
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

      <div className="no-scrollbar  h-[calc(100vh_-_3.8125rem)] w-full  overflow-y-scroll p-6">
        <Box
          component="form"
          noValidate
          autoComplete="off"
          className="flex w-3/5 flex-col gap-8"
        >
          <div className="flex flex-col gap-8 rounded-2xl border border-black border-opacity-5 p-8 dark:border-gray-600 dark:border-opacity-100">
            <TextField
              required
              id="outlined-basic"
              label="Secret Key"
              variant="standard"
              size="small"
              type="password"
              placeholder="Enter OpenAI Secret Key"
              helperText="Your secret key will only be stored in IndexedDB."
              fullWidth
            />

            <TextField
              id="outlined-basic"
              label="Organization ID"
              variant="standard"
              size="small"
              type="text"
              fullWidth
            />
          </div>

          <div className="flex flex-col gap-8 rounded-2xl border border-black border-opacity-5 p-8 dark:border-gray-600 dark:border-opacity-100">
            <FormControl size="small">
              <InputLabel id="chat-completion-model-select-label">
                Chat Completion Model
              </InputLabel>
              <Select
                labelId="chat-completion-model-select-label"
                id="chat-completion-model-select"
                value={chatCompletions[0]}
                label="Chat Completion Model"
                onChange={() => {}}
              >
                {chatCompletions.map((chatCompletion) => (
                  <MenuItem key={chatCompletion} value={chatCompletion}>
                    {chatCompletion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel id="demo-select-small-label">Edit Model</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={10}
                label="Edit Model"
                onChange={() => {}}
              >
                {edits.map((edit) => (
                  <MenuItem key={edit} value={edit}>
                    {edit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel id="demo-select-small-label">
                Text Completion Model
              </InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={10}
                label="Text Completion Model"
                onChange={() => {}}
              >
                {textCompletions.map((textCompletion) => (
                  <MenuItem key={textCompletion} value={textCompletion}>
                    {textCompletion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col gap-8 rounded-2xl border border-black border-opacity-5 p-8 dark:border-gray-600 dark:border-opacity-100">
            <FormControl size="small">
              <InputLabel id="demo-select-small-label">
                Moderation Model
              </InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={10}
                label="Moderation Model"
                onChange={() => {}}
              >
                {moderations.map((moderation) => (
                  <MenuItem key={moderation} value={moderation}>
                    {moderation}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="flex flex-col gap-8 rounded-2xl border border-black border-opacity-5 p-8 dark:border-gray-600 dark:border-opacity-100">
            <FormControl size="small">
              <InputLabel id="demo-select-small-label">
                Audio Transcription Model
              </InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={10}
                label="Audio Transcription Model"
                onChange={() => {}}
              >
                {audios.map((audio) => (
                  <MenuItem key={audio} value={audio}>
                    {audio}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel id="demo-select-small-label">
                Audio Translation Model
              </InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={10}
                label="Audio Translation Model"
                onChange={() => {}}
              >
                {audios.map((audio) => (
                  <MenuItem key={audio} value={audio}>
                    {audio}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel id="demo-select-small-label">
                Audio Response Type
              </InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={10}
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
          </div>
        </Box>
      </div>
    </section>
  )
}

export default Settings
