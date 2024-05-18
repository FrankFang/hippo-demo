import { SpeechToText } from '~/app/_components/speech-to-text';

export default async function Home() {

  return (
    <main className="flex flex-col min-h-screen">
      <SpeechToText className="h-full grow shrink" />
    </main>
  );
}

