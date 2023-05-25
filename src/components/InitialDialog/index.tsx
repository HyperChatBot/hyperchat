import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { Formik } from 'formik'
import { FC, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useSettings } from 'src/hooks'
import { initialDialogVisibleState } from 'src/stores/global'
import { Companies } from 'src/types/global'
import { Settings } from 'src/types/settings'

const InitialDialog: FC = () => {
  const [company, setCompany] = useState<Companies | ''>('')
  const [visible, setVisible] = useRecoilState(initialDialogVisibleState)
  const { settings, updateSettings } = useSettings()

  const saveApiKey = (newSetting: Settings) => {
    setVisible(false)
    updateSettings(newSetting)
  }

  return (
    <Dialog open={visible}>
      <DialogTitle>Welcome to Hyper Chat!</DialogTitle>
      <Formik<Settings>
        initialValues={settings as Settings}
        onSubmit={updateSettings}
      >
        {(formik) => (
          <>
            <DialogContent className="flex flex-col gap-2">
              <DialogContentText
                sx={{
                  marginBottom: 2
                }}
              >
                We currently support{' '}
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://platform.openai.com/account/api-keys"
                  underline="none"
                >
                  OpenAI
                </Link>
                ,{' '}
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://azure.microsoft.com/en-us/products/cognitive-services/openai-service/"
                  underline="none"
                >
                  Azure OpenAI service
                </Link>
                , and{' '}
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.anthropic.com/product"
                  underline="none"
                >
                  Anthropic Claude
                </Link>
                . Choose one company and fill in your API key to start your
                journey!
              </DialogContentText>

              <FormControl size="small">
                <InputLabel id="company-select-label">Company</InputLabel>
                <Select
                  labelId="company-select-label"
                  id="company-select"
                  value={company}
                  label="Company"
                  onChange={(e) => setCompany(e.target.value as Companies)}
                >
                  {Object.keys(Companies).map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {company !== '' && (
                <Divider
                  sx={{
                    marginBottom: 2,
                    marginTop: 2,
                    marginLeft: -4,
                    marginRight: -4
                  }}
                />
              )}

              <>
                {company === Companies.OpenAI && (
                  <TextField
                    autoFocus
                    fullWidth
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
                    {...formik.getFieldProps('openai_secret_key')}
                  />
                )}

                {company === Companies.Azure && (
                  <>
                    <TextField
                      autoFocus
                      fullWidth
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
                      sx={{ marginTop: 2, marginBottom: 2 }}
                      required
                      fullWidth
                      id="azure-endpoint-input"
                      label="Endpoint"
                      size="small"
                      type="text"
                      helperText="Use this endpoint to make calls to the service. The format likes: https://YOUR_DOMAIM.openai.azure.com"
                      {...formik.getFieldProps('azure_endpoint')}
                    />

                    <TextField
                      required
                      fullWidth
                      id="azure-deployment-name-input"
                      label="Deployment Name"
                      size="small"
                      type="text"
                      helperText="Deployments enable you to make completions and search calls against a provided base model or your fine-tuned model. You can also scale up and down your deployments easily by modifying the scale unit."
                      {...formik.getFieldProps('azure_deployment_name')}
                    />
                  </>
                )}

                {company === Companies.Anthropic && (
                  <TextField
                    autoFocus
                    fullWidth
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
                    {...formik.getFieldProps('anthropic_secret_key')}
                  />
                )}
              </>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => saveApiKey(formik.values)}>Submit</Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  )
}

export default InitialDialog
