import { PauseCircle, PlayCircle } from 'lucide-react'
import { FC, useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

interface Props {
  filename: string
}

// Global variable to track the currently playing audio
let currentPlayingAudioId: string | undefined = undefined

const Waveform: FC<Props> = ({ filename }) => {
  const [src, setSrc] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const waveSurferRef = useRef<WaveSurfer | null>(null)

  const handlePlaying = () => {
    const isCurrentlyPlaying = waveSurferRef.current?.isPlaying() || false
    setIsPlaying(!isCurrentlyPlaying)

    if (!isCurrentlyPlaying) {
      currentPlayingAudioId = filename
    }

    waveSurferRef.current?.playPause()
  }

  const createFileSrc = async () => {
    try {
      if (
        window.electronAPI &&
        typeof window.electronAPI.transformFilenameToSrc === 'function'
      ) {
        const response = await window.electronAPI.transformFilenameToSrc({
          filename
        })

        if (response.success && response.arrayBuffer) {
          const blob = new Blob([response.arrayBuffer], {
            type: 'application/octet-stream'
          })
          const assetUrl = URL.createObjectURL(blob)
          setSrc(assetUrl)
        }
      }
    } catch (error) {
      console.error('Error transforming filename to src:', error)
    }
  }

  useEffect(() => {
    createFileSrc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filename])

  useEffect(() => {
    if (currentPlayingAudioId !== filename) {
      waveSurferRef.current?.stop()
      setIsPlaying(false)
    }
  }, [filename])

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
