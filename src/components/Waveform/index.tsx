import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import { FC, useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useAppData } from 'src/hooks'
import { currPlayingAudioIdState } from 'src/stores/conversation'
import WaveSurfer from 'wavesurfer.js'

interface Props {
  filename: string
}

const Waveform: FC<Props> = ({ filename }) => {
  const [currPlayingAudioId, setCurrPlayingAudioId] = useRecoilState(
    currPlayingAudioIdState
  )
  const { transformFilenameToSrc } = useAppData()
  const [src, setSrc] = useState('')
  const [isPlaying, toggleIsPlaying] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const waveSurferRef = useRef<WaveSurfer | null>(null)

  const handlePlaying = () => {
    toggleIsPlaying(!waveSurferRef.current?.isPlaying())

    if (!waveSurferRef.current?.isPlaying()) {
      setCurrPlayingAudioId(filename)
    }

    waveSurferRef.current?.playPause()
  }

  const createFileSrc = async () => {
    const currSrc = await transformFilenameToSrc(filename)
    setSrc(currSrc || '')
  }

  useEffect(() => {
    createFileSrc()
  }, [])

  useEffect(() => {
    if (currPlayingAudioId !== filename) {
      waveSurferRef.current?.stop()
      toggleIsPlaying(false)
    }
  }, [currPlayingAudioId])

  useEffect(() => {
    if (!src) return

    const waveSurfer = WaveSurfer.create({
      container: containerRef.current as HTMLDivElement,
      responsive: true,
      cursorWidth: 0,
      barWidth: 2,
      height: 40,
      waveColor: 'rgba(255, 255, 255, 0.6)',
      progressColor: '#fff'
    })
    waveSurfer.load(src)
    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer
    })
    waveSurfer.on('finish', () => {
      toggleIsPlaying(false)
    })

    return () => {
      waveSurfer.destroy()
    }
  }, [src])

  return (
    <section className="flex w-full items-center">
      {isPlaying ? (
        <PauseCircleIcon
          className="flex-shrink-0 cursor-pointer"
          width={36}
          height={36}
          onClick={handlePlaying}
        />
      ) : (
        <PlayCircleIcon
          className="flex-shrink-0 cursor-pointer"
          width={36}
          height={36}
          onClick={handlePlaying}
        />
      )}

      <div ref={containerRef} className="w-full min-w-50" />
    </section>
  )
}

export default Waveform
