import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'


type MainStore = {
  transcriptList: string[]
  pushTranscript: (transcript: string) => void
  byteFrequency: Uint8Array | null
  setByteFrequency: (byteFrequency: Uint8Array) => void
  db: number
  setDb: (db: number) => void
}
export const useMainStore = create<MainStore>()(
  immer(
    (set) => ({
      transcriptList: [],
      pushTranscript: (transcript: string) => {
        set((state) => {
          state.transcriptList.push(transcript)
        })
      },
      byteFrequency: null,
      setByteFrequency: (byteFrequency: Uint8Array) => {
        set((state) => {
          state.byteFrequency = byteFrequency
        })
      },
      db: 0,
      setDb: (db: number) => {
        set((state) => {
          state.db = db
        })
      }
    })
  )
)
