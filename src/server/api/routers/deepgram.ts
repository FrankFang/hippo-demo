import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const deepgramRouter = createTRPCRouter({
  api_key: publicProcedure
    .query(() => {
      return {
        api_key: process.env.DEEPGRAM_API_KEY,
      };
    }),
});
