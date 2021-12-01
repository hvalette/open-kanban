import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../components/layout";
import Loader from "../components/loader";
import { initTheme } from "../utils/theme";
import { SWRConfig } from "swr";
import Head from "next/head";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    initTheme();
  }, []);
  return (
    <>
      <Head>
        <title>Open Kanban</title>
        <meta
          name="description"
          content="An OpenProject kanban style view"
        ></meta>
      </Head>
      <SessionProvider session={session}>
        <Auth>
          <SWRConfig
            value={{
              refreshInterval: 30000,
            }}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SWRConfig>
          <ToastContainer />
        </Auth>
      </SessionProvider>
    </>
  );
}

function Auth({ children }: any) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if ((session?.token as any)?.error === "RefreshAccessTokenError") {
      console.error("RefreshAccessTokenError");
      signIn("op");
    }
    if (status === "unauthenticated") {
      signIn("op");
    }
  }, [session, status]);
  if (status === "authenticated") {
    return children;
  }
  return (
    <div className="h-screen w-full grid place-items-center row-span-2">
      <Loader></Loader>
    </div>
  );
}

export default MyApp;
