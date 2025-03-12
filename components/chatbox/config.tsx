'use client'

import { Badge } from '@/components/ui/badge'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { configurationAtom } from '@/stores/conversation'
import { Configuration as IConfiguration } from '@/types/conversation'
import { useAtomValue } from 'jotai'
import { X } from 'lucide-react'
import * as React from 'react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import InputSlider from '../common/input-slider'
import { Sidebar, SidebarContent } from '../ui/sidebar'

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const configuration = useAtomValue(configurationAtom)
  const availableModels = []

  const form = useForm<IConfiguration>({
    defaultValues: configuration
  })

  // Update form values when configuration changes
  useEffect(() => {
    if (configuration) {
      form.reset(configuration)
    }
  }, [configuration, form])

  const onSubmit = async (values: IConfiguration) => {}

  const maxOutput = availableModels?.find(
    (availableModel) => availableModel.modelName === form.watch('model')
  )?.maxOutput

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l lg:flex"
      {...props}
    >
      <SidebarContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="no-scrollbar space-y-6 overflow-y-scroll p-4"
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
                      {availableModels?.map((model) => (
                        <SelectItem
                          key={model.modelName}
                          value={model.modelName}
                        >
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
                            {field.value?.map((stopSequence, index) => (
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
                                if (
                                  e.key === 'Enter' &&
                                  e.currentTarget.value
                                ) {
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
                      </FormItem>
                    </TooltipTrigger>
                    {/* <TooltipContent>
                      <p className="max-w-xs">
                        Make responses stop at a desired point, such as the end
                        of a sentence or list. Specify up to four sequences
                        where the model will stop generating further tokens in a
                        response. The returned text will not contain the stop
                        sequence.
                      </p>
                    </TooltipContent> */}
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
          </form>
        </Form>
      </SidebarContent>
    </Sidebar>
  )
}
