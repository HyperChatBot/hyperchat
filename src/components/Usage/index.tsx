import Typography from '@mui/material/Typography'
import { FC, useEffect, useState } from 'react'
import { formatBytes } from 'src/shared/utils'

const Usage: FC = () => {
  const [usage, setUsage] = useState(0)

  const getUsage = async () => {
    try {
      const estimate = await navigator.storage.estimate()
      setUsage(estimate?.usageDetails?.indexedDB || 0)
    } catch {}
  }

  useEffect(() => {
    getUsage()
  }, [])

  return (
    <>
      {' '}
      {usage === 0 || (
        <Typography variant="body1" className="dark:text-white">
          Usage: {formatBytes(usage)}
        </Typography>
      )}
    </>
  )
}

export default Usage
