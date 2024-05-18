// import Link from 'next/link';

import { SpeechToText } from '~/app/_components/speech-to-text';
// import { getServerAuthSession } from '~/server/auth';
// import { api } from '~/trpc/server';

export default async function Home() {
  // const hello = await api.post.hello({ text: 'from tRPC' });
  // const session = await getServerAuthSession();

  return (
    <main className="flex flex-col min-h-screen">
      <SpeechToText className="h-full grow shrink" />
    </main>
  );
}


// async function CrudShowcase() {
//   const session = await getServerAuthSession();
//   if (!session?.user) return null;

//   const latestPost = await api.post.getLatest();

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       <CreatePost />
//     </div>
//   );
// }
