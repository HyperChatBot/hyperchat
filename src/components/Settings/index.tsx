import { useAtom, useAtomValue } from 'jotai'
import { Moon, Sun } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import { ChangeEvent, FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import HyperChatLogo from 'src/assets/images/logo.png'
import { SolidSettingsBrightnessIcon } from 'src/components/Icons'
import ImportAndExportDexie from 'src/components/ImportAndExportDexie'
import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar'
import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from 'src/components/ui/dialog'
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
import { ToggleGroup, ToggleGroupItem } from 'src/components/ui/toggle-group'
import { useSettings, useTheme } from 'src/hooks'
import {
  customBotAvatarUrlAtom,
  settingsDialogVisibleAtom
} from 'src/stores/global'
import { Companies, ThemeMode } from 'src/types/global'
import { Settings as SettingsParams } from 'src/types/settings'

const SettingsNew: FC = () => {
  const [visible, setVisible] = useAtom(settingsDialogVisibleAtom)
  const customBotAvatarUrl = useAtomValue(customBotAvatarUrlAtom)
  const { settings, updateSettings } = useSettings()
  const { toggleTheme } = useTheme()

  const form = useForm<SettingsParams>({
    defaultValues: settings
  })

  // Update form values when settings change
  useEffect(() => {
    if (settings) {
      form.reset(settings)
    }
  }, [settings, form])

  const onSubmit = async (values: SettingsParams) => {
    await updateSettings(values)
  }

  const handleUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]

    if (file && file.type.startsWith('image/') && settings) {
      const arrayBuffer = await file.arrayBuffer()
      const response = await window.electronAPI.saveFileToAppDataDir({
        arrayBuffer,
        filename: file.name
      })
      if (response.filename) {
        const updatedSettings = {
          ...form.getValues(),
          assistantAvatarFilename: response.filename
        }
        updateSettings(updatedSettings)
        form.setValue('assistantAvatarFilename', response.filename)
        enqueueSnackbar('Assistant avatar updated successfully.', {
          variant: 'success'
        })
      }
    }
  }

  if (!settings) return null

  const company = form.watch('company')

  return (
    <Dialog open={visible} onOpenChange={() => setVisible(!visible)}>
      <DialogContent className="h-2/3 max-w-3xl overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold dark:text-white">
            Settings
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <section className="flex flex-col gap-4">
              <header className="text-xl font-medium dark:text-white">
                Account
              </header>

              <div>
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Companies).map((companyOption) => (
                          <SelectItem key={companyOption} value={companyOption}>
                            {companyOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {company === Companies.OpenAI && (
                <>
                  <div>
                    <FormField
                      control={form.control}
                      name="openaiSecretKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Key</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              required
                              id="openai-secret-key-input"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            <span>
                              <strong>
                                Your secret key will only be stored in
                                IndexedDB!
                              </strong>{' '}
                              Do not share it with others or expose it in any
                              client-side code.
                            </span>
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="openaiOrganizationId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization ID</FormLabel>
                          <FormControl>
                            <Input
                              id="openai-organization-id-input"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            For users who belong to multiple organizations, you
                            can pass a header to specify which organization is
                            used for an API request. Usage from these API
                            requests will count against the specified
                            organization&apos;s subscription quota.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="openaiAuthorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              id="openai-author-name-input"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The name of the author of this message. May contain
                            a-z, A-Z, 0-9, and underscores, with a maximum
                            length of 64 characters.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button className="w-30" type="submit">
                    Save
                  </Button>
                </>
              )}

              {company === Companies.Anthropic && (
                <>
                  <div>
                    <FormField
                      control={form.control}
                      name="anthropicSecretKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Key</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              required
                              id="anthropic-secret-key-input"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            <span>
                              <strong>
                                Your secret key will only be stored in
                                IndexedDB!
                              </strong>{' '}
                              Do not share it with others or expose it in any
                              client-side code.
                            </span>
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button className="w-30" type="submit">
                    Save
                  </Button>
                </>
              )}

              {company === Companies.Google && (
                <>
                  <div>
                    <FormField
                      control={form.control}
                      name="googleSecretKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Key</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              required
                              id="google-secret-key-input"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            <span>
                              <strong>
                                Your secret key will only be stored in
                                IndexedDB!
                              </strong>{' '}
                              Do not share it with others or expose it in any
                              client-side code.
                            </span>
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button className="w-30" type="submit">
                    Save
                  </Button>
                </>
              )}

              {company === Companies.Llama && (
                <>
                  <div>
                    <FormField
                      control={form.control}
                      name="ollamaUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ollama Url</FormLabel>
                          <FormControl>
                            <Input
                              id="ollama-url"
                              type="text"
                              placeholder="http://127.0.0.1:11434"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            <p>
                              Make sure you&apos;ve been running Llama by{' '}
                              <a
                                href="https://github.com/ollama/ollama"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                Ollama
                              </a>
                              .
                            </p>
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button className="w-30" type="submit">
                    Save
                  </Button>
                </>
              )}
            </section>

            <section className="mt-8 flex flex-col gap-6">
              <header className="text-xl font-medium dark:text-white">
                Appearance
              </header>

              <div>
                <p className="mb-2 text-sm font-medium">Theme</p>
                <FormField
                  control={form.control}
                  name="themeMode"
                  render={({ field }) => (
                    <ToggleGroup
                      className="flex justify-start"
                      type="single"
                      value={field.value}
                      onValueChange={(value: string) => {
                        if (value) {
                          field.onChange(value)
                          toggleTheme(value as ThemeMode)
                        }
                      }}
                    >
                      <ToggleGroupItem value={ThemeMode.light}>
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </ToggleGroupItem>
                      <ToggleGroupItem value={ThemeMode.dark}>
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </ToggleGroupItem>
                      <ToggleGroupItem value={ThemeMode.system}>
                        <SolidSettingsBrightnessIcon className="mr-2 h-4 w-4" />
                        System
                      </ToggleGroupItem>
                    </ToggleGroup>
                  )}
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">Assistant Avatar</p>
                <div className="flex items-center gap-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={customBotAvatarUrl || HyperChatLogo}
                      alt="Assistant Avatar"
                    />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      document.getElementById('avatar-upload')?.click()
                    }
                  >
                    Upload
                  </Button>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadChange}
                  />
                </div>
              </div>
            </section>

            <section className="mt-8 flex flex-col gap-6">
              <header className="text-xl font-medium dark:text-white">
                Data
              </header>

              <ImportAndExportDexie />
            </section>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsNew
