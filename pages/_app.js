import "../styles/globals.scss"; // Global styles
import GlobalProvider from "../containers/index";
import { ParallaxProvider } from "react-scroll-parallax";

export default function MyApp({ Component, pageProps }) {
  return (
    // Wrap page in global state provider
    <GlobalProvider>
      <ParallaxProvider>
        <Component {...pageProps} />
      </ParallaxProvider>
    </GlobalProvider>
  );
}
