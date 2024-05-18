'use client'
import { type LiveClient } from "@deepgram/sdk"
import { useCallback, useEffect, useRef, useState } from "react"
import { S } from "~/app/_components/speech-to-text.i18n"
import { Button } from "~/components/ui/button"
import { useDeepgram } from "~/lib/deepgram"
import { createCatcher } from "~/lib/errors"
import { api } from "~/trpc/react"

export const SpeechToText = () => {
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [status, setStatus] = useState<'idle' | 'recording' | 'initial'>('initial')
  const apiKey = api.deepgram.api_key.useQuery().data?.api_key
  const { connection, createConnection, destroyConnection } = useDeepgram(apiKey)
  const startRecording = useCallback(async () => {
    const s = await navigator.mediaDevices.getUserMedia({ video: false, audio: true }).catch(createCatcher(() => {
      window.alert('If you want to use this feature, you need to allow access to your microphone.')
    }))
    setStream(s)
  }, [])
  const stopRecording = useCallback(() => {
    setStream(null)
  }, [])
  useEffect(() => {
    if (status === 'recording') {
      startRecording().catch(createCatcher(console.error))
    } else if (status === 'idle') {
      stopRecording()
    }
  }, [status, startRecording, stopRecording])
  useEffect(() => {
    if (stream) {
      setRecorder(new MediaRecorder(stream))
      createConnection()
    } else {
      setRecorder(null)
      destroyConnection()
    }
  }, [createConnection, destroyConnection, stream])
  useEffect(() => {
    if (recorder && connection) {
      recorder.ondataavailable = (e) => {
        console.log('send')
        connection.send(e.data)
      }
      recorder.start(250)
    } else if (!connection) {
      recorder?.stop()
    } else if (!recorder) {
      connection.finish()
    }
  }, [connection, recorder])
  const onClick = async () => {
    if (['initial', 'idle'].includes(status)) {
      setStatus('recording')
    } else {
      setStatus('idle')
    }
  }
  return <div className="flex items-center justify-center">
    <Button onClick={onClick} variant={status === 'recording' ? 'red' : 'green'} >
      {status === 'recording' ? S.StopRecording : S.StartRecording}
    </Button>
    <div className="fixed bottom-0 left-0 min-h-8 w-full bg-blue-300">Record</div>
  </div>
}
