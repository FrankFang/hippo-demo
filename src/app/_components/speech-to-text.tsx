'use client'
import { type LiveClient } from "@deepgram/sdk"
import { useCallback, useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { S } from "~/app/_components/speech-to-text.i18n"
import { useMainStore } from "~/client/use-main-store"
import { Button } from "~/components/ui/button"
import { openDeepgramConnection } from "~/lib/deepgram"
import { createCatcher } from "~/lib/errors"
import { api } from "~/trpc/react"

type Props = {
  className?: string
}
export const SpeechToText = (props: Props) => {
  const { className } = props
  const { transcriptList, setByteFrequency, setDb, db } = useMainStore()
  const refRecorder = useRef<MediaRecorder | null>(null)
  const refStream = useRef<MediaStream | null>(null)
  const refConnectionToDeepgram = useRef<LiveClient | null>(null)
  const [status, setStatus] = useState<'idle' | 'recording' | 'initial'>('initial')
  const apiKey = api.deepgram.api_key.useQuery().data?.api_key
  const timer = useRef<number | null>(null)
  const wrapper = useRef<HTMLDivElement | null>(null)
  const startRecording = useCallback(async () => {
    if (!apiKey) return
    refConnectionToDeepgram.current = await openDeepgramConnection(apiKey)
    const stream = refStream.current = await navigator.mediaDevices.getUserMedia({ video: false, audio: true }).catch(createCatcher(() => {
      window.alert('If you want to use this feature, you need to allow access to your microphone.')
    }))
    refRecorder.current = new MediaRecorder(stream);
    refRecorder.current.ondataavailable = (e) => refConnectionToDeepgram.current?.send(e.data)
    refRecorder.current.start(300)
    const audioContent = new AudioContext();
    const audioStream = audioContent.createMediaStreamSource(stream);
    const analyser = audioContent.createAnalyser();
    analyser.fftSize = 1024;
    audioStream.connect(analyser);
    if (timer.current) {
      clearInterval(timer.current)
    }
    timer.current = window.setInterval(() => {
      const byteFrequency = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(byteFrequency);
      setByteFrequency(byteFrequency)
      let total = 0
      for (let i = 0; i < 255; i++) {
        const x = byteFrequency[i] ?? 0
        total += x * x;
      }
      const rms = Math.sqrt(total / analyser.frequencyBinCount);
      const db = Math.round(Math.max(20 * (Math.log(rms) / Math.log(10)), 0))
      setDb(db)
    }, 300)
  }, [apiKey, setByteFrequency, setDb])
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
  const refDiv = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    refDiv.current?.scrollTo(0, refDiv.current.scrollHeight)
  }, [transcriptList])
  return (
    <div className={twMerge("flex flex-col", className)} ref={wrapper}>
      <div className="grow shrink h-full flex flex-col items-center pt-16">
        <Button onClick={onClick} variant={status === 'recording' ? 'red' : 'green'} >
          {status === 'recording' ? S.StopRecording : S.StartRecording}
        </Button>
        {status === 'recording' ?
          <div className="p-4">
            {db} dB
          </div>
          : null
        }
      </div>
      <div className="p-2 shrink-0 grow-0 bottom-0 left-0 min-h-8 max-h-32 w-full bg-blue-300 overflow-auto text-center" ref={refDiv}>
        {transcriptList.map((transcript, index) => {
          return <div key={index}>{transcript}</div>
        })}
      </div>
    </div>
  )
}
