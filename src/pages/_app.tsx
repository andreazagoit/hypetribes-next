import "../styles/globals.css";
import type { AppProps } from "next/app";
import PageTemplate from "../templates/PageTemplate";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PageTemplate>
      <Component {...pageProps} />
    </PageTemplate>
  );
}

export default MyApp;
