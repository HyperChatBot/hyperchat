import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { initialDialogVisibleState } from 'src/stores/global'
import { Companies } from 'src/types/global'

enum Step {
  Welcome,
  SelectCompany,
  Saved
}

const InitialDialog: FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(Step.Welcome)
  const [visible, setVisible] = useRecoilState(initialDialogVisibleState)

  const goToSettings = () => {
    navigate('/settings')
    setVisible(false)
  }

  return (
    <Dialog open={visible}>
      <DialogTitle>Welcome to Hyper Chat!</DialogTitle>
      <DialogContent className="flex flex-col gap-2">
        <DialogContentText>
          We currently support OpenAI, Azure OpenAI service, and Claude. Store
          your API key in the settings to start your journey.
        </DialogContentText>
        <DialogContentText className="mt-4">
          Hyper Chat will not store and use your secret key, it will only be
          stored in IndexedDB! Do not share it with others or expose it in any
          client-side code.
        </DialogContentText>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={goToSettings}>Next Step</Button>
      </DialogActions>
    </Dialog>
  )
}

export default InitialDialog
