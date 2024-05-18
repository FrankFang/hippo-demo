/* eslint-disable @typescript-eslint/no-unsafe-call */

import { createClient, type LiveClient, LiveTranscriptionEvents } from '@deepgram/sdk';

export const openDeepgramConnection = (apiKey: string) => {
  let resolve: (value: LiveClient) => void
  const promise = new Promise<LiveClient>((res, _rej) => {
    resolve = res;
  });
  // STEP 1: Create a Deepgram client using the API key
  const deepgram = createClient(apiKey)

  // STEP 2: Create a live transcription connection
  const connection = deepgram.listen.live({
    model: 'nova-2',
    language: 'en-US',
    smart_format: true,
  })

  // STEP 3: Listen for events from the live transcription connection
  connection.on(LiveTranscriptionEvents.Open, () => {
    console.log('Connection opened.')
    resolve(connection)
    connection.on(LiveTranscriptionEvents.Close, () => {
      console.log('Connection closed.')
    })

    connection.on(LiveTranscriptionEvents.Transcript, (data) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(data.channel.alternatives[0].transcript)
    })

    connection.on(LiveTranscriptionEvents.Metadata, (data) => {
      console.log(data)
    })

    connection.on(LiveTranscriptionEvents.Error, (err) => {
      console.error(err)
    })
    connection.on(LiveTranscriptionEvents.SpeechStarted, () => {
      console.log('Speech started')
    })
    connection.on(LiveTranscriptionEvents.UtteranceEnd, () => {
      console.log('Utterance end')
    })
    connection.on(LiveTranscriptionEvents.Warning, (warning) => {
      console.warn(warning)
    })
  })

  return promise
}

