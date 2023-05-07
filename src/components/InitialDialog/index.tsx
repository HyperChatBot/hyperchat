import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import { FC, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { useSettings } from 'src/hooks'
import { initialDialogVisibleState } from 'src/stores/global'

interface Props {
  visible: boolean
}

const InitialDialog: FC<Props> = ({ visible }) => {
  const [secretKey, setSecretKey] = useState('')
  const { initialSettings } = useSettings()
  const setInitialDialogVisible = useSetRecoilState(initialDialogVisibleState)

  const submitSecretKey = async () => {
    await initialSettings(secretKey)
    setInitialDialogVisible(false)
  }

  return (
    <Dialog open={visible}>
      <DialogTitle>Welcome to Hyper Chat!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The OpenAI API uses API keys for authentication. Visit your{' '}
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://platform.openai.com/account/api-keys"
            underline="none"
          >
            API Keys
          </Link>{' '}
          page to retrieve the API key you'll use in your requests.
        </DialogContentText>
        <TextField
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          required
          autoFocus
          margin="dense"
          label="Secret Key"
          type="password"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={submitSecretKey}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default InitialDialog
