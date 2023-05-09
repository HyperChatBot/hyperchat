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
