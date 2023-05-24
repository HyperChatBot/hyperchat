import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { initialDialogVisibleState } from 'src/stores/global'

interface Props {
  visible: boolean
}

const InitialDialog: FC<Props> = ({ visible }) => {
  const history = useNavigate()
  const setInitialDialogVisible = useSetRecoilState(initialDialogVisibleState)

  const goToSettings = async () => {
    history('/settings')
    setInitialDialogVisible(false)
  }

  return (
    <Dialog open={visible}>
      <DialogTitle>Welcome to Hyper Chat!</DialogTitle>
      <DialogContent className="flex flex-col gap-2">
        <DialogContentText>
          We currently support OpenAI, Azure OpenAI service, and Claude. Store
          your API key in the settings to start your journey with Hyper Chat.
        </DialogContentText>
        <DialogContentText className="mt-4">
          Hyper Chat will not store and use your secret key, it will only be
          stored in IndexedDB! Do not share it with others or expose it in any
          client-side code.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={goToSettings}>Go</Button>
      </DialogActions>
    </Dialog>
  )
}

export default InitialDialog
