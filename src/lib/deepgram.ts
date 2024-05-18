/* eslint-disable @typescript-eslint/no-unsafe-call */

import { createClient, type LiveClient, LiveTranscriptionEvents, type DeepgramClient } from '@deepgram/sdk';
import { useCallback, useEffect, useState } from 'react';

export const useDeepgram = (apiKey?: string) => {
  const [client, setClient] = useState<DeepgramClient | null>(null)
  // STEP 1: Create a Deepgram client using the API key
  useEffect(() => {
    if (apiKey) {
      setClient(createClient(apiKey))
    }
  }, [apiKey])

  const [connection, setConnection] = useState<LiveClient | null>(null)

  const createConnection = useCallback(() => {
    if (!client) return
    if (connection) return
    console.log('Creating connection...')
    const c = client.listen.live({
      model: 'nova-2',
      language: 'en-US',
      smart_format: true,
    })
    c.on(LiveTranscriptionEvents.Open, () => {
      console.log('Connection opened.')
      setConnection(c)
      console.log('set connection', c)
    })
    c.on(LiveTranscriptionEvents.Close, () => {
      console.log('closed')
      console.log(c)
    })
    c.on(LiveTranscriptionEvents.Transcript, (data) => {
      console.log(data.channel.alternatives[0].transcript)
    })
    c.on(LiveTranscriptionEvents.Metadata, (data) => {
      console.log(data)
    })
    c.on(LiveTranscriptionEvents.Error, (err) => {
      console.error(err)
    })
    c.on(LiveTranscriptionEvents.SpeechStarted, () => {
      console.log('Speech started')
    })
    c.on(LiveTranscriptionEvents.UtteranceEnd, () => {
      console.log('Utterance end')
    })
    c.on(LiveTranscriptionEvents.Warning, (warning) => {
      console.warn(warning)
    })
  }, [client, connection])
  const destroyConnection = useCallback(() => {
    console.log('Destroying connection...')
    if (!connection) return
    connection.finish()
    setConnection(null)
  }, [connection])

  return { connection, createConnection, destroyConnection, client }
}

