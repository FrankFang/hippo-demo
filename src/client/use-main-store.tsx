import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'


type MainStore = {
  transcriptList: string[]
}
export const useMainStore = create<MainStore>()(
  immer(
    (set) => ({
      transcriptList: [],
      pushTranscript: (transcript: string) => {
        set((state) => {
          state.transcriptList.push(transcript)
        })
      }
    })
  )
)
