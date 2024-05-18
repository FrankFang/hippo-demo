/* eslint-disable @typescript-eslint/no-unsafe-call */

import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk'
import fetch from 'cross-fetch'
import dotenv from 'dotenv'
dotenv.config()

// URL for the realtime streaming audio you would like to transcribe
const url = 'http://stream.live.vc.bbcmedia.co.uk/bbc_world_service'

export const live = async () => {
  // STEP 1: Create a Deepgram client using the API key
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY ?? '')

  // STEP 2: Create a live transcription connection
  const connection = deepgram.listen.live({
    model: 'nova-2',
    language: 'en-US',
    smart_format: true,
  })

  // STEP 3: Listen for events from the live transcription connection
  connection.on(LiveTranscriptionEvents.Open, () => {
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

    // STEP 4: Fetch the audio stream and send it to the live transcription connection
    void fetch(url)
      .then((r) => r.body)
      .then(async (res) => {
        if (!res) throw new Error('No response body')
        // read the stream and send it to the connection
        const reader = res.getReader()
        const x = await reader.read()
        x.value && connection.send(x.value.buffer)
      })
  })
}

