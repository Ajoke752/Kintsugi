import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = "pk_test_d2VsY29tZS1mb3hob3VuZC0yNi5jbGVyay5hY2NvdW50cy5kZXYk";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "hsl(211 100% 50%)",
          colorBackground: "hsl(222 47% 11%)",
          colorText: "hsl(210 40% 98%)",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
