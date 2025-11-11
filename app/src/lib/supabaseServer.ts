import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Works whether `cookies()` is sync or async
type CookieStore = Awaited<ReturnType<typeof cookies>>;

/**
 * Server-side Supabase client.
 * - cookieStore is optional.
 * - You can pass either a CookieStore or a Promise<CookieStore> (e.g. cookies()).
 * - Must be awaited by callers.
 */
export async function supabaseServer(
  cookieStore?: CookieStore | Promise<CookieStore>
) {
  // If a cookie store (or promise of one) is provided, await it; otherwise await cookies()
  const store: CookieStore = cookieStore ? await cookieStore : await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return store.get(name)?.value;
        },
        set(
          name: string,
          value: string,
          options?: Parameters<typeof store.set>[0] extends object
            ? Omit<Parameters<typeof store.set>[0], "name" | "value">
            : any
        ) {
          // Next.js expects an object for set()
          store.set({ name, value, ...(options ?? {}) } as any);
        },
        remove(
          name: string,
          options?: Parameters<typeof store.set>[0] extends object
            ? Omit<Parameters<typeof store.set>[0], "name" | "value">
            : any
        ) {
          store.set({ name, value: "", ...(options ?? {}) } as any);
        },
      },
    }
  );
}
