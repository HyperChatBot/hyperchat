import { Player } from '@lottiefiles/react-lottie-player'
import classNames from 'classnames'
import { enqueueSnackbar } from 'notistack'
import { FC, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import RecorderJSON from 'src/assets/lotties/recorder.json'
import { useClients } from 'src/hooks'
import { userInputState } from 'src/stores/conversation'
import { settingsState } from 'src/stores/settings'

interface Props {
  className?: string
}

const AudioRecorder: FC<Props> = ({ className }) => {
  const settings = useRecoilValue(settingsState)
  const { azureClient } = useClients()
  const [userInput, setUserInput] = useRecoilState(userInputState)
  const [isRecording, setIsRecording] = useState(false)
  // const [audioUrl, setAudioUrl] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const lottieRef = useRef<Player | null>(null)

  const startRecording = async () => {
    if (!settings) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.start()
      setIsRecording(true)

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/mp3'
        })
        const uint8Array = new Uint8Array(await audioBlob.arrayBuffer())
        const transcription = await azureClient.getAudioTranscription(
          settings.azureDeploymentNameAudioGeneration,
          uint8Array
        )
        setUserInput(`${userInput}${transcription.text}`)

        // const audioUrl = URL.createObjectURL(audioBlob)
        // setAudioUrl(audioUrl)
        audioChunksRef.current = []
      }
    } catch (error) {
      enqueueSnackbar('Error accessing media devices.', { variant: 'error' })
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    lottieRef.current?.stop()
    lottieRef.current?.setSeeker(0)
  }

  return (
    <section
      onClick={isRecording ? stopRecording : startRecording}
      className={classNames('cursor-pointer', className)}
    >
      <Player
        ref={lottieRef}
        autoplay={isRecording}
        loop
        src={{ ...RecorderJSON }}
        style={{ height: 40, width: 40 }}
      />

      {/* {
      // the audio preview is just for test.
      audioUrl && (
        <audio controls>
          <source src={audioUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )} */}
    </section>
  )
}

export default AudioRecorder
