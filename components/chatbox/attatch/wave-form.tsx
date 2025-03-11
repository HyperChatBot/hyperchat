import { currPlayingAudioIdAtom } from '@/stores/conversation'
import { useAtom } from 'jotai'
import { PauseCircle, PlayCircle } from 'lucide-react'
import { FC, useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

interface Props {
  filename: string
}

const Waveform: FC<Props> = ({ filename }) => {
  const [currPlayingAudioId, setCurrPlayingAudioId] = useAtom(
    currPlayingAudioIdAtom
  )
  const [src, setSrc] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const waveSurferRef = useRef<WaveSurfer | null>(null)

  const handlePlaying = () => {
    const isCurrentlyPlaying = waveSurferRef.current?.isPlaying() || false
    setIsPlaying(!isCurrentlyPlaying)

    if (!isCurrentlyPlaying) {
      if (typeof setCurrPlayingAudioId === 'function') {
        setCurrPlayingAudioId(filename)
      }
    }

    waveSurferRef.current?.playPause()
  }

  const createFileSrc = async () => {
    const src = await window.electronAPI.transformFilenameToSrc({
      filename
    })
    const blob = new Blob([src.arrayBuffer], {
      type: 'application/octet-stream'
    })
    const assetUrl = URL.createObjectURL(blob)
    setSrc(assetUrl || '')
  }

  useEffect(() => {
    createFileSrc()
  }, [])

  useEffect(() => {
    if (currPlayingAudioId !== filename) {
      waveSurferRef.current?.stop()
      setIsPlaying(false)
    }
  }, [currPlayingAudioId])

  useEffect(() => {
    if (!src) return

    const waveSurfer = WaveSurfer.create({
      container: containerRef.current as HTMLDivElement,
      cursorWidth: 0,
      barWidth: 2,
      height: 40,
      waveColor: 'rgba(255, 255, 255, 0.6)',
      progressColor: '#383351'
    })
    waveSurfer.load(src)
    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer
    })
    waveSurfer.on('finish', () => {
      setIsPlaying(false)
    })

    return () => {
      waveSurfer.destroy()
    }
  }, [src])

  return (
    <section className="flex w-full items-center">
      {isPlaying ? (
        <PauseCircle
          className="flex-shrink-0 cursor-pointer pl-1 text-white"
          width={36}
          height={36}
          onClick={handlePlaying}
        />
      ) : (
        <PlayCircle
          className="flex-shrink-0 cursor-pointer pl-1 text-white"
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
