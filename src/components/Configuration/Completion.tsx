import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { Formik, useFormikContext } from 'formik'
import { FC, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { CompletionConfiguration, models } from 'src/configurations/completion'
import { useDB } from 'src/hooks'
import { currConversationState } from 'src/stores/conversation'
import { configurationDrawerVisibleState } from 'src/stores/global'
import Divider from '../Divider'
import InputSlider from '../InputSlider'

const Configuration: FC = () => {
  const [visible, setVisible] = useRecoilState(configurationDrawerVisibleState)
  const [currConversation, setCurrConversation] = useRecoilState(
    currConversationState
  )
  const { updateOneById } = useDB('conversations')

  const updateConfiguration = async (values: CompletionConfiguration) => {
    if (!currConversation) {
      return
    }
    await updateOneById(currConversation.conversationId, {
      configuration: values,
      updatedAt: +new Date()
    })

    setCurrConversation({ ...currConversation, configuration: values })
  }

  const AutoSubmitToken = () => {
    const { submitForm } = useFormikContext()
    useEffect(() => {
      if (!visible) {
        submitForm()
      }
    }, [visible])

    return null
  }

  if (!currConversation) {
    return null
  }

  return (
    <Drawer anchor="right" open={visible} onClose={() => setVisible(false)}>
      <section className="w-87.75">
        <section className="flex h-22 items-center justify-between pl-6">
          <span className="text-xl font-semibold dark:text-dark-text">
            Configuration
          </span>
        </section>

        <Divider />

        <Formik<CompletionConfiguration>
          initialValues={
            currConversation.configuration as CompletionConfiguration
          }
          onSubmit={updateConfiguration}
        >
          {(formik) => (
            <section className="no-scrollbar h-[calc(100vh_-_7.5625rem)] overflow-y-scroll p-6">
              <FormControl size="small" fullWidth>
                <InputLabel id="model-select-label">Model</InputLabel>
                <Select
                  fullWidth
                  labelId="model-select-label"
                  id="model-select"
                  label="Model"
                  {...formik.getFieldProps('model')}
                >
                  {models.map((gpt) => (
                    <MenuItem key={gpt} value={gpt}>
                      {gpt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <InputSlider
                title="Max response"
                tooltipTitle="Set a limit on the number of tokens per model response. The API supports a maximum of 4000 tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly 4 characters for typical English text."
                min={1}
                max={4000}
                step={1}
                defaultValue={
                  (currConversation.configuration as CompletionConfiguration)
                    .maxTokens
                }
                setFieldValue={(value: number) =>
                  formik.setFieldValue('maxTokens', value)
                }
              />

              <Tooltip
                title="Make responses stop at a desired point, such as the end of a sentence or list. Specify up to four sequences where the model will stop generating further tokens in a response. The returned text will not contain the stop sequence."
                placement="top"
              >
                <FormControl size="small" fullWidth>
                  <Autocomplete
                    multiple
                    id="stop"
                    options={[]}
                    value={formik.values.stop}
                    freeSolo
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Stop sequences"
                        placeholder="Enter sequence and press Tab"
                      />
                    )}
                    onChange={(_, value) => formik.setFieldValue('stop', value)}
                  />
                </FormControl>
              </Tooltip>

              <InputSlider
                title="Temperature"
                tooltipTitle="Controls randomness. Lowering the temperature means that the model will produce more repetitive and deterministic responses. Increasing the temperature will result in more unexpected or creative responses. Try adjusting temperature or Top P but not both."
                min={0}
                max={1}
                step={0.01}
                defaultValue={
                  (currConversation.configuration as CompletionConfiguration)
                    .temperature
                }
                setFieldValue={(value: number) =>
                  formik.setFieldValue('temperature', value)
                }
              />
              <InputSlider
                title="Top P"
                tooltipTitle="Similar to temperature, this controls randomness but uses a different method. Lowering Top P will narrow the model's token selection to likelier tokens. Increasing Top P will let the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top P but not both."
                min={0}
                max={1}
                step={0.01}
                defaultValue={
                  (currConversation.configuration as CompletionConfiguration)
                    .topP
                }
                setFieldValue={(value: number) =>
                  formik.setFieldValue('topP', value)
                }
              />
              <InputSlider
                title="Frequency penalty"
                tooltipTitle="Reduce the chance of repeating a token proportionally based on how often it has appeared in the text so far. This decreases the likelihood of repeating the exact same text in a response."
                min={0}
                max={2}
                step={0.01}
                defaultValue={
                  (currConversation.configuration as CompletionConfiguration)
                    .frequencyPenalty
                }
                setFieldValue={(value: number) =>
                  formik.setFieldValue('frequencyPenalty', value)
                }
              />

              <InputSlider
                title="Presence penalty"
                tooltipTitle="Reduce the chance of repeating any token that has appeared in the text at all so far. This increases the likelihood of introducing new topics in a response."
                min={0}
                max={2}
                step={0.01}
                defaultValue={
                  (currConversation.configuration as CompletionConfiguration)
                    .presencePenalty
                }
                setFieldValue={(value: number) =>
                  formik.setFieldValue('frequencyPenalty', value)
                }
              />

              <Tooltip
                title="Insert text after the user's input and before the model's response. This can help prepare the model for a response."
                placement="top"
              >
                <FormControl size="small" fullWidth sx={{ marginBottom: 4 }}>
                  <TextField
                    label="Pre-response text"
                    id="pre-response-text"
                    value={formik.values.preResponse.content}
                    onChange={(event) => {
                      formik.setFieldValue('preResponse', {
                        ...formik.values.preResponse,
                        content: event?.target.value
                      })
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Checkbox
                            checked={formik.values.preResponse.checked}
                            onChange={(_, checked) =>
                              formik.setFieldValue('preResponse', {
                                ...formik.values.preResponse,
                                checked
                              })
                            }
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                </FormControl>
              </Tooltip>

              <Tooltip
                title="Insert text after the model's generated response to encourage further user input, as when modeling a conversation."
                placement="top"
              >
                <FormControl size="small" fullWidth>
                  <TextField
                    label="Post-response text"
                    id="post-response-text"
                    value={formik.values.postResponse.content}
                    onChange={(event) => {
                      formik.setFieldValue('postResponse', {
                        ...formik.values.postResponse,
                        content: event?.target.value
                      })
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Checkbox
                            checked={formik.values.postResponse.checked}
                            onChange={(_, checked) =>
                              formik.setFieldValue('postResponse', {
                                ...formik.values.postResponse,
                                checked
                              })
                            }
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                </FormControl>
              </Tooltip>

              <AutoSubmitToken />
            </section>
          )}
        </Formik>
      </section>
    </Drawer>
  )
}

export default Configuration
