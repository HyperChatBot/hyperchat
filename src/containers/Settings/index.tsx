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
import { Formik, useFormikContext } from 'formik'
import { ChangeEvent, FC, useEffect } from 'react'
import ChatGPTImg from 'src/assets/chatbot.png'
import { SolidSettingsBrightnessIcon } from 'src/components/Icons'
import toast from 'src/components/Snackbar'
import { useAppData, useSettings, useTheme } from 'src/hooks'
import {
  audioResponseTypes,
  audios,
  chatCompletions,
  imageSizes,
  textCompletions
} from 'src/shared/constants'
import { Companies, ThemeMode } from 'src/types/global'
import { Settings as SettingsParams } from 'src/types/settings'

const Settings: FC = () => {
  const { settings, updateSettings } = useSettings()
  const { toggleTheme } = useTheme()
  const { saveFileToAppDataDir } = useAppData()

  const handleUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]

    // FIXME: Even if I set accept="image/*" on the input file tag, non-image files can still be selected in tauri.
    if (file && file.type.startsWith('image/') && settings) {
      const filename = await saveFileToAppDataDir(file)
      if (filename) {
        updateSettings({ ...settings, assistant_avatar_filename: filename })
        toast.success('Assistant avatar updated successfully.')
      }
    }
  }

  const AutoSubmitToken = () => {
    const { initialValues, values, submitForm } =
      useFormikContext<SettingsParams>()

    useEffect(() => {
      if (initialValues !== values) {
        updateSettings(values)
      }
    }, [initialValues, values, submitForm])

    return null
  }

  if (!settings) return null

  return (
    <section className="w-full">
      <p className="px-6 py-4 text-xl font-semibold dark:text-white">
        Settings
      </p>

      <Divider />

      <div className="no-scrollbar h-[calc(100vh_-_3.8125rem)] w-full overflow-y-scroll p-6">
        <Formik<SettingsParams>
          initialValues={settings}
          onSubmit={updateSettings}
        >
          {(formik) => (
            <Box
              component="form"
              noValidate
              autoComplete="off"
              className="my-8"
            >
              <section className="flex flex-col gap-6">
                <header className="text-xl font-medium dark:text-white">
                  Account
                </header>

                <FormControl size="small">
                  <InputLabel id="company-select-label">Company</InputLabel>
                  <Select
                    className="w-80"
                    labelId="company-select-label"
                    id="company-select"
                    label="Company"
                    {...formik.getFieldProps('company')}
                  >
                    {Object.values(Companies).map((company) => (
                      <MenuItem key={company} value={company}>
                        {company}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {formik.values.company === Companies.OpenAI && (
                  <>
                    <TextField
                      autoComplete="current-password"
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
                          Do not share it with others or expose it in any
                          client-side code.
                        </span>
                      }
                      className="w-160"
                      {...formik.getFieldProps('openai_secret_key')}
                    />

                    <TextField
                      id="openai-organization-id-input"
                      label="Organization ID"
                      size="small"
                      type="text"
                      className="w-160"
                      helperText="For users who belong to multiple organizations, you can pass a header to specify which organization is used for an API request. Usage from these API requests will count against the specified organization's subscription quota."
                      {...formik.getFieldProps('openai_organization_id')}
                    />

                    <TextField
                      id="openai-author-name-input"
                      label="Author Name"
                      size="small"
                      type="text"
                      className="w-160"
                      helperText="The name of the author of this message. May contain a-z, A-Z, 0-9, and underscores, with a maximum length of 64 characters."
                      {...formik.getFieldProps('openai_author_name')}
                    />

                    <Button
                      variant="contained"
                      sx={{ width: 'max-content' }}
                      onClick={() => updateSettings(formik.values)}
                    >
                      Save
                    </Button>
                  </>
                )}

                {formik.values.company === Companies.Azure && (
                  <>
                    <TextField
                      autoComplete="current-password"
                      required
                      id="azure-secret-key-input"
                      label="Secret Key"
                      size="small"
                      type="password"
                      helperText={
                        <span>
                          <strong>
                            Your secret key will only be stored in IndexedDB!
                          </strong>{' '}
                          Do not share it with others or expose it in any
                          client-side code.
                        </span>
                      }
                      className="w-160"
                      {...formik.getFieldProps('azure_secret_key')}
                    />

                    <TextField
                      required
                      id="azure-endpoint-input"
                      label="Endpoint"
                      size="small"
                      type="text"
                      className="w-160"
                      helperText="Use this endpoint to make calls to the service. The format likes: https://YOUR_DOMAIN.openai.azure.com"
                      {...formik.getFieldProps('azure_endpoint')}
                    />

                    <TextField
                      required
                      id="azure-deployment-name-input"
                      label="Deployment Name"
                      size="small"
                      type="text"
                      className="w-160"
                      helperText="Deployments enable you to make completions and search calls against a provided base model or your fine-tuned model. You can also scale up and down your deployments easily by modifying the scale unit."
                      {...formik.getFieldProps('azure_deployment_name')}
                    />

                    <Button
                      variant="contained"
                      sx={{ width: 'max-content' }}
                      onClick={() => updateSettings(formik.values)}
                    >
                      Save
                    </Button>
                  </>
                )}
              </section>
            </Box>
          )}
        </Formik>

        <Divider />

        <Formik<SettingsParams>
          initialValues={settings}
          onSubmit={updateSettings}
        >
          {(formik) => (
            <Box
              component="form"
              noValidate
              autoComplete="off"
              className="my-8"
            >
              <section className="flex flex-col gap-6">
                <header className="text-xl font-medium dark:text-white">
                  Customization
                </header>

                <section>
                  <Typography variant="body1" className="dark:text-white">
                    Theme Mode
                  </Typography>
                  <ToggleButtonGroup
                    color="primary"
                    exclusive
                    aria-label="Theme Mode"
                    sx={{
                      marginTop: 1,
                      '& .Mui-selected': {
                        borderColor: '#615ef0'
                      },
                      '& .Mui-selected.MuiToggleButtonGroup-grouped': {
                        borderLeftColor: '#615ef0'
                      }
                    }}
                    value={formik.values.theme_mode}
                    onChange={(_, newVal) => {
                      formik.setFieldValue('theme_mode', newVal)
                      toggleTheme(newVal)
                    }}
                  >
                    <ToggleButton disableRipple value={ThemeMode.light}>
                      <SunIcon className="mr-2 h-6 w-6" /> Light
                    </ToggleButton>
                    <ToggleButton disableRipple value={ThemeMode.system}>
                      <SolidSettingsBrightnessIcon className="mr-2 h-6 w-6" />{' '}
                      System
                    </ToggleButton>
                    <ToggleButton disableRipple value={ThemeMode.dark}>
                      <MoonIcon className="mr-2 h-6 w-6" /> Dark
                    </ToggleButton>
                  </ToggleButtonGroup>
                </section>

                <section>
                  <Typography variant="body1" className="dark:text-white">
                    Assistant Avatar
                  </Typography>
                  <FormHelperText>
                    Upload your own assistant avatar for a better experience.
                    The avatar will be shown in chat box.
                  </FormHelperText>

                  <section className="mt-2 flex items-center">
                    <label className="cursor-pointer">
                      <Avatar
                        alt="assistant avatar"
                        src={
                          settings.assistant_avatar_filename
                            ? settings.assistant_avatar_filename
                            : ChatGPTImg
                        }
                        sx={{ width: 128, height: 128 }}
                      />
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleUploadChange}
                      />
                    </label>
                  </section>
                </section>
              </section>
            </Box>
          )}
        </Formik>

        <Divider />

        <Formik<SettingsParams>
          initialValues={settings}
          onSubmit={updateSettings}
        >
          {(formik) => (
            <Box
              component="form"
              noValidate
              autoComplete="off"
              className="mt-8 flex flex-col gap-8"
            >
              <section className="flex flex-col gap-6">
                <header className="text-xl font-medium dark:text-white">
                  Chat
                </header>

                <FormControl size="small">
                  <InputLabel id="chat-model-select-label">Model</InputLabel>
                  <Select
                    className="w-80"
                    labelId="chat-model-select-label"
                    id="chat-model-select"
                    label="Model"
                    {...formik.getFieldProps('chat_model')}
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
                    control={
                      <Switch
                        defaultChecked
                        disabled
                        {...formik.getFieldProps('chat_stream')}
                      />
                    }
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
                <header className="text-xl font-medium dark:text-white">
                  Text Completions
                </header>

                <FormControl size="small">
                  <InputLabel id="text-completion-model-select-label">
                    Model
                  </InputLabel>
                  <Select
                    className="w-80"
                    labelId="text-completion-model-select-label"
                    id="text-completion-model-select"
                    label="Model"
                    {...formik.getFieldProps('text_completion_model')}
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
                    control={
                      <Switch
                        disabled
                        {...formik.getFieldProps('text_completion_stream')}
                      />
                    }
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
                <header className="text-xl font-medium dark:text-white">
                  Audio
                </header>

                <FormControl size="small">
                  <InputLabel id="audio-transcription-model-select-label">
                    Transcription Model
                  </InputLabel>
                  <Select
                    className="w-80"
                    labelId="audio-transcription-model-select-label"
                    id="audio-transcription-model-select"
                    disabled
                    label="Transcription Model"
                    {...formik.getFieldProps('audio_transcription_model')}
                  >
                    {audios.map((audio) => (
                      <MenuItem key={audio} value={audio}>
                        {audio}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Only <strong>{audios[0]}</strong> is currently available.
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
                    disabled
                    label="Translation Model"
                    {...formik.getFieldProps('audio_translation_model')}
                  >
                    {audios.map((audio) => (
                      <MenuItem key={audio} value={audio}>
                        {audio}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Only <strong>{audios[0]}</strong> is currently available.
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
                    label="Audio Response Type"
                    {...formik.getFieldProps('audio_response_type')}
                  >
                    {audioResponseTypes.map((audioResponseType) => (
                      <MenuItem
                        key={audioResponseType}
                        value={audioResponseType}
                      >
                        {audioResponseType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Divider />

                <section className="flex flex-col gap-6">
                  <header className="text-xl font-medium dark:text-white">
                    Image Generations
                  </header>

                  <FormControl size="small">
                    <InputLabel id="iamge-generation-model-select-label">
                      Size
                    </InputLabel>
                    <Select
                      className="w-80"
                      labelId="iamge-generation-model-select-label"
                      id="iamge-generation-model-select"
                      label="Size"
                      {...formik.getFieldProps('image_generation_size')}
                    >
                      {imageSizes.map((imageSize) => (
                        <MenuItem key={imageSize} value={imageSize}>
                          {imageSize}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </section>
              </section>
              <AutoSubmitToken />
            </Box>
          )}
        </Formik>
      </div>
    </section>
  )
}

export default Settings
