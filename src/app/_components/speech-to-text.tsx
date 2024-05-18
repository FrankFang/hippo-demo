'use client'
import { type LiveClient } from "@deepgram/sdk"
import clsx from "clsx"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "~/components/ui/button"
import { openDeepgramConnection } from "~/lib/deepgram"
import { createCatcher } from "~/lib/errors"
import { api } from "~/trpc/react"

export const SpeechToText = () => {
  const refRecorder = useRef<MediaRecorder | null>(null)
  const refStream = useRef<MediaStream | null>(null)
  const refConnectionToDeepgram = useRef<LiveClient | null>(null)
  const [status, setStatus] = useState<'idle' | 'recording' | 'initial'>('initial')
  const apiKey = api.deepgram.api_key.useQuery().data?.api_key
  const startRecording = useCallback(async () => {
    if (!apiKey) return
    const stream = refStream.current = await navigator.mediaDevices.getUserMedia({ video: false, audio: true }).catch(createCatcher(() => {
      window.alert('If you want to use this feature, you need to allow access to your microphone.')
    }))
    refRecorder.current = new MediaRecorder(stream);
    refConnectionToDeepgram.current = await openDeepgramConnection(apiKey)
    refRecorder.current.ondataavailable = (e) => refConnectionToDeepgram.current?.send(e.data)
    refRecorder.current.start(250)
  }, [apiKey])
  const stopRecording = useCallback(() => {
    setStatus('idle')
    refStream.current?.getTracks().forEach((track) => track.stop())
    refRecorder.current?.stop()
    refConnectionToDeepgram.current?.finish()
  }, [])
  useEffect(() => {
    if (status === 'recording') {
      startRecording().catch(createCatcher(console.error))
    } else if (status === 'idle') {
      stopRecording()
    }
  }, [status, startRecording, stopRecording])
  const onClick = async () => {
    if (['initial', 'idle'].includes(status)) {
      setStatus('recording')
    } else {
      setStatus('idle')
    }
  }
  return <div className="flex items-center justify-center">
    <Button onClick={onClick} variant={status === 'recording' ? 'red' : 'green'} >
      {status === 'recording' ? 'Stop Recording' : 'Start Recording'}
    </Button>
    <div className="fixed bottom-0 left-0 min-h-8 w-full bg-blue-300">Record</div>
  </div>
}
