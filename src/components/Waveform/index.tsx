import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import { FC, useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

interface Props {
  audio: string
}

const Waveform: FC<Props> = ({ audio }) => {
  const [isPlaying, toggleIsPlaying] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const waveSurferRef = useRef<WaveSurfer | null>(null)

  const handlePlaying = () => {
    waveSurferRef.current?.playPause()
    toggleIsPlaying(!waveSurferRef.current?.isPlaying())
  }

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current as HTMLDivElement,
      responsive: true,
      cursorWidth: 0,
      barWidth: 2,
      height: 40,
      waveColor: 'rgba(255, 255, 255, 0.6)',
      progressColor: '#fff'
    })
    waveSurfer.load(audio)
    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer
    })

    return () => {
      waveSurfer.destroy()
    }
  }, [audio])

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
