// import Link from 'next/link';

import { Button } from '~/components/ui/button';
import { live } from '~/lib/deepgram';
// import { getServerAuthSession } from '~/server/auth';
// import { api } from '~/trpc/server';

export default async function Home() {
  // const hello = await api.post.hello({ text: 'from tRPC' });
  // const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Button>hi</Button>
      <div className="fixed bottom-0 left-0 min-h-8 w-full bg-blue-300">Record</div>
    </main>
  );
}

live()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

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
