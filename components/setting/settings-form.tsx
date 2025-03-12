import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSetting } from '@/hooks/use-setting'
import { textFetcher } from '@/lib/utils'
import { activeAtom } from '@/stores/settings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtomValue } from 'jotai'
import debounce from 'lodash.debounce'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import useSWR from 'swr'
import { z } from 'zod'

export function SettingsForm() {
  const activeTitle = useAtomValue(activeAtom)
  const { error } = useSWR(
    activeTitle === 'Ollama' ? 'http://localhost:11434' : null,
    textFetcher
  )
  const { data, mutate, updateSetting } = useSetting()

  const formSchema = z.object({
    openaiApiKey: z.string().min(1),
    openaiBaseUrl: z.string().url(),
    azureOpenaiApiKey: z.string().min(1),
    azureOpenAiEndpoint: z.string().url(),
    azureOpenAiApiVersion: z.string().url(),
    anthropicApiKey: z.string().min(1),
    anthropicBaseUrl: z.string().url(),
    googleApiKey: z.string().min(1),
    googleBaseUrl: z.string().url(),
    xAiApiKey: z.string().min(1),
    xAiBaseUrl: z.string().url(),
    ollamaBaseUrl: z.string().min(1)
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
    values: data
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  useEffect(() => {
    const subscription = form.watch(
      debounce((formValue) => {
        if (data?.id) {
          updateSetting(formValue)
          mutate()
        }

        toast.success('Auto saved.')
      }, 1000)
    )

    return () => subscription.unsubscribe()
  }, [data, form, form.watch])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {activeTitle === 'OpenAI GPT' && (
          <>
            <FormField
              control={form.control}
              name="openaiApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      id="openai-api-key-input"
                      autoComplete="current-password"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="openaiBaseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL</FormLabel>
                  <FormControl>
                    <Input type="text" id="openai-base-url-input" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {activeTitle === 'Azure OpenAI' && (
          <>
            <FormField
              control={form.control}
              name="azureOpenaiApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      id="azure-openai-api-key-input"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="azureOpenAiEndpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="azure-openai-endpoint"
                      placeholder="https://<RESOURCE_NAME>.openai.azure.com"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="azureOpenAiApiVersion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Version</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="azure-openai-api-version"
                      placeholder="2024-12-01-preview"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {activeTitle === 'Anthropic Claude' && (
          <>
            <FormField
              control={form.control}
              name="anthropicApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      id="anthropic-api-key-input"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="anthropicBaseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="anthropic-base-url-input"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {activeTitle === 'Google Gemini' && (
          <>
            <FormField
              control={form.control}
              name="googleApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      id="google-api-key-input"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="googleBaseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL</FormLabel>
                  <FormControl>
                    <Input type="text" id="google-base-url-input" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {activeTitle === 'xAI Grok' && (
          <>
            <FormField
              control={form.control}
              name="xAiApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      id="xai-api-key-input"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="xAiBaseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL</FormLabel>
                  <FormControl>
                    <Input type="text" id="xai-base-url-input" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {activeTitle === 'Ollama' && (
          <>
            <FormField
              control={form.control}
              name="ollamaBaseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="ollama-base-url-input"
                      placeholder="http://localhost:11434"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormLabel>Status</FormLabel>

            {error === undefined ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <p className="text-sm">Ollama service is accessible.</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <p className="text-sm">Ollama service is not accessible.</p>
              </div>
            )}
          </>
        )}
      </form>
    </Form>
  )
}
