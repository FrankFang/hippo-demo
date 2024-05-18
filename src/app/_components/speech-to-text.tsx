'use client'
import { useRef, useState } from "react"
import { Button } from "~/components/ui/button"
import { openDeepgramConnection } from "~/lib/deepgram"
import { createCatcher } from "~/lib/errors"
import { api } from "~/trpc/react"

export const SpeechToText = () => {
  const refRecorder = useRef<MediaRecorder | null>(null)
  const refStream = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<'idle' | 'recording'>('idle')
  const apiKeyQuery = api.deepgram.api_key.useQuery()
  const startRecording = async () => {
    setStatus('recording')
    const stream = refStream.current = await navigator.mediaDevices.getUserMedia({ video: false, audio: true }).catch(createCatcher(() => {
      window.alert('If you want to use this feature, you need to allow access to your microphone.')
    }))
    const mediaRecorder = refRecorder.current = new MediaRecorder(stream);
    const apiKey = apiKeyQuery.data?.api_key
    if (!apiKey) return
    const connection = await openDeepgramConnection(apiKey)
    mediaRecorder.ondataavailable = (e) => connection.send(e.data)
    mediaRecorder.start(250)
  }
  const stopRecording = () => {
    setStatus('idle')
    refStream.current?.getTracks().forEach((track) => track.stop())
    refRecorder.current?.stop()
  }
  const onClick = async () => {
    if (status === 'recording') {
      stopRecording()
    } else if (status === 'idle') {
      startRecording().catch(createCatcher(console.error))
    }
  }
  return <div className="flex items-center justify-center">
    <Button onClick={onClick}>
      {status === 'idle' ? 'Start Recording' : 'Stop Recording'}
    </Button>
    <div className="fixed bottom-0 left-0 min-h-8 w-full bg-blue-300">Record</div>
  </div>
}
