import "../styles/globals.scss"; // Global styles
import GlobalProvider from "../containers/index";
import { ParallaxProvider } from "react-scroll-parallax";
import { ToastProvider } from "react-toast-notifications";

export default function MyApp({ Component, pageProps }) {
  return (
    // Wrap page in global state provider
    <GlobalProvider>
      <ToastProvider>
        <ParallaxProvider>
          <Component {...pageProps} />
        </ParallaxProvider>
      </ToastProvider>
    </GlobalProvider>
  );
}
