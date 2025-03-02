import { useAtomValue } from 'jotai'
import { X } from 'lucide-react'
import { FC, memo, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Badge } from 'src/components/ui/badge'
import { Button } from 'src/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'src/components/ui/select'
import { Separator } from 'src/components/ui/separator'
import { Textarea } from 'src/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from 'src/components/ui/tooltip'
import configurations from 'src/configurations'
import { useDB } from 'src/hooks'
import { configurationAtom } from 'src/stores/conversation'
import { companyAtom } from 'src/stores/global'
import { Configuration as IConfiguration } from 'src/types/conversation'
import InputSlider from '../InputSlider'

const Configuration: FC = () => {
  const company = useAtomValue(companyAtom)
  const configuration = useAtomValue(configurationAtom)
  const { updateOneById } = useDB('configurations')
  const availableModels = configurations[company]?.models

  const form = useForm<IConfiguration>({
    defaultValues: configuration
  })

  // Update form values when configuration changes
  useEffect(() => {
    if (configuration) {
      form.reset(configuration)
    }
  }, [configuration, form])

  const onSubmit = async (values: IConfiguration) => {
    await updateOneById(values.company, values)
  }

  const maxOutput = availableModels?.find(
    (availableModel) => availableModel.modelName === form.watch('model')
  )?.maxOutput

  return (
    <section className="w-87.75">
      <section className="flex h-22 items-center justify-between pl-6">
        <span className="text-xl font-bold">Configuration</span>
      </section>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="no-scrollbar h-[calc(100vh_-_7.5625rem)] space-y-6 overflow-y-scroll p-6"
        >
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.modelName} value={model.modelName}>
                        {model.modelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="systemMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>System Message</FormLabel>
                <FormControl>
                  <Textarea
                    id="system-message"
                    placeholder="Eg: You are an AI assistant that helps people find information."
                    rows={5}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="maxResponse"
            defaultValue={maxOutput}
            render={({ field }) => (
              <InputSlider
                title="Max response"
                tooltipTitle={`Set a limit on the number of tokens per model response. The API supports a maximum of ${maxOutput} tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly 4 characters for typical English text.`}
                min={1}
                max={maxOutput}
                step={1}
                defaultValue={field.value}
                setFieldValue={(value: number) => field.onChange(value)}
              />
            )}
          />

          <Controller
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <InputSlider
                title="Temperature"
                tooltipTitle="Controls randomness. Lowering the temperature means that the model will produce more repetitive and deterministic responses. Increasing the temperature will result in more unexpected or creative responses. Try adjusting temperature or Top P but not both."
                min={0}
                max={2}
                step={0.01}
                defaultValue={field.value}
                setFieldValue={(value: number) => field.onChange(value)}
              />
            )}
          />

          <FormField
            control={form.control}
            name="stop"
            render={({ field }) => (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <FormItem className="w-full">
                      <FormLabel>Stop sequences</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2 rounded-md border p-2">
                          {field.value.map((stopSequence, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              {stopSequence}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => {
                                  const newStopSequences = [...field.value]
                                  newStopSequences.splice(index, 1)
                                  field.onChange(newStopSequences)
                                }}
                              />
                            </Badge>
                          ))}
                          <Input
                            className="h-7 min-w-[100px] flex-1 border-none p-0 focus-visible:ring-0"
                            placeholder="Enter sequence and press Enter"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                e.preventDefault()
                                const newValue = [
                                  ...field.value,
                                  e.currentTarget.value
                                ]
                                field.onChange(newValue)
                                e.currentTarget.value = ''
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Make responses stop at a desired point, such as the end
                        of a sentence or list. Specify up to four sequences
                        where the model will stop generating further tokens in a
                        response.
                      </FormDescription>
                    </FormItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Make responses stop at a desired point, such as the end of
                      a sentence or list. Specify up to four sequences where the
                      model will stop generating further tokens in a response.
                      The returned text will not contain the stop sequence.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          />

          <Controller
            control={form.control}
            name="topP"
            render={({ field }) => (
              <InputSlider
                title="Top P"
                tooltipTitle="Similar to temperature, this controls randomness but uses a different method. Lowering Top P will narrow the model's token selection to likelier tokens. Increasing Top P will let the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top P but not both."
                min={0}
                max={1}
                step={0.01}
                defaultValue={field.value}
                setFieldValue={(value: number) => field.onChange(value)}
              />
            )}
          />

          <Controller
            control={form.control}
            name="frequencyPenalty"
            render={({ field }) => (
              <InputSlider
                title="Frequency penalty"
                tooltipTitle="Reduce the chance of repeating a token proportionally based on how often it has appeared in the text so far. This decreases the likelihood of repeating the exact same text in a response."
                min={-2}
                max={2}
                step={0.01}
                defaultValue={field.value}
                setFieldValue={(value: number) => field.onChange(value)}
              />
            )}
          />

          <Controller
            control={form.control}
            name="presencePenalty"
            render={({ field }) => (
              <InputSlider
                title="Presence penalty"
                tooltipTitle="Reduce the chance of repeating any token that has appeared in the text at all so far. This increases the likelihood of introducing new topics in a response."
                min={0}
                max={2}
                step={0.01}
                defaultValue={field.value}
                setFieldValue={(value: number) => field.onChange(value)}
              />
            )}
          />

          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </section>
  )
}

export default memo(Configuration)
