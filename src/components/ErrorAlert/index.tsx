import { InformationCircleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { Alert } from 'flowbite-react'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { errorAlertState } from 'src/stores/global'

const ErrorAlert = () => {
  const [errorAlert, setErrorAlertState] = useRecoilState(errorAlertState)

  useEffect(() => {
    if (errorAlert !== false) {
      setTimeout(() => {
        setErrorAlertState(false)
      }, 2000)
    }
  }, [errorAlert])

  return (
    <Alert
      className={classNames(
        'fixed bottom-6 max-w-xl -translate-x-full shadow-lg duration-250 ease-in-out',
        {
          'translate-x-6 duration-250 ease-in-out': errorAlert !== false
        }
      )}
      color="failure"
      // @ts-ignore
      icon={InformationCircleIcon}
    >
      <span>{errorAlert !== false && errorAlert.message}</span>
    </Alert>
  )
}

export default ErrorAlert
