import { useSnackbar, VariantType, WithSnackbarProps } from 'notistack'
import { FC } from 'react'

interface Props {
  setUseSnackbarRef: (showSnackbar: WithSnackbarProps) => void
}

const InnerSnackbarUtilsConfig: FC<Props> = (props: Props) => {
  props.setUseSnackbarRef(useSnackbar())
  return null
}

let useSnackbarRef: WithSnackbarProps
const setUseSnackbarRef = (useSnackbarRefProp: WithSnackbarProps) => {
  useSnackbarRef = useSnackbarRefProp
}

export const SnackbarUtilsConfig = () => {
  return <InnerSnackbarUtilsConfig setUseSnackbarRef={setUseSnackbarRef} />
}

const toast = {
  success(msg: string) {
    this.toast(msg, 'success')
  },
  warning(msg: string) {
    this.toast(msg, 'warning')
  },
  info(msg: string) {
    this.toast(msg, 'info')
  },
  error(msg: string) {
    this.toast(msg, 'error')
  },
  toast(msg: string, variant: VariantType = 'default') {
    useSnackbarRef.enqueueSnackbar(msg, { variant })
  }
}

export default toast
