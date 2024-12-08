import { PaperClipIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { enqueueSnackbar } from 'notistack'
import { ChangeEvent, FC, useRef } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { multiMedialConfig } from 'src/shared/constants'
import { convertBase64 } from 'src/shared/utils'
import { audioFileState, base64ImagesState } from 'src/stores/conversation'
import { MediaType } from 'src/types/global'

interface Props {
  mediaType: MediaType
  className?: string
}

const MediaUploader: FC<Props> = ({ mediaType, className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [audioFile, setAudioFile] = useRecoilState(audioFileState)
  const setBase64Images = useSetRecoilState(base64ImagesState)

  const validate = () => true

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    if (mediaType === MediaType.Audio) {
      const file = files[0]
      setAudioFile({
        ...audioFile,
        binary: file
      })

      const response = await window.electronAPI.saveFileToAppDataDir({ file })
      setAudioFile({
        ...audioFile,
        filename: response.filename
      })
    }

    if (mediaType === MediaType.Image) {
      const promises = []
      for (const file of files) {
        promises.push(convertBase64(file))
      }

      try {
        const base64Files = await Promise.all(promises)
        setBase64Images(base64Files)
      } catch {
        enqueueSnackbar('Can not upload images.', { variant: 'error' })
      }
    }
  }

  return (
    <section className={className}>
      <label
        htmlFor="$$file-input"
        className="relative flex cursor-pointer items-center"
      >
        <input
          type="file"
          id="$$file-input"
          accept={multiMedialConfig[mediaType].accept}
          className="absolute h-6 w-6 opacity-0 file:h-6 file:w-6"
          multiple={multiMedialConfig[mediaType].multiple}
          ref={fileInputRef}
          onChange={onFileChange}
        />

        <PaperClipIcon
          className={classNames(
            'relative h-5 w-5',
            {
              'text-black text-opacity-30 dark:text-white': !validate()
            },
            {
              'text-main-purple text-opacity-100 dark:text-main-purple':
                validate()
            }
          )}
        />
      </label>
    </section>
  )
}

export default MediaUploader
