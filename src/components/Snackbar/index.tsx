import { ProviderContext, useSnackbar, VariantType } from 'notistack'
import { FC } from 'react'

interface Props {
  setUseSnackbarRef: (showSnackbar: ProviderContext) => void
}

const InnerSnackbarUtilsConfig: FC<Props> = (props: Props) => {
  props.setUseSnackbarRef(useSnackbar())
  return null
}

let useSnackbarRef: ProviderContext
const setUseSnackbarRef = (useSnackbarRefProp: ProviderContext) => {
  useSnackbarRef = useSnackbarRefProp
}

export const SnackbarUtilsConfig = () => {
  return <InnerSnackbarUtilsConfig setUseSnackbarRef={setUseSnackbarRef} />
}

const Toast = {
  success(msg: string) {
    this.Toast(msg, 'success')
  },
  warning(msg: string) {
    this.Toast(msg, 'warning')
  },
  info(msg: string) {
    this.Toast(msg, 'info')
  },
  error(msg: string) {
    this.Toast(msg, 'error')
  },
  Toast(msg: string, variant: VariantType = 'default') {
    useSnackbarRef.enqueueSnackbar(msg, { variant })
  }
}

export default Toast
