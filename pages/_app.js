import "../styles/globals.scss"; // Global styles
import GlobalProvider from "../containers/index";
import { ToastProvider } from "react-toast-notifications";
import { ParallaxProvider } from "react-scroll-parallax";

export default function MyApp({ Component, pageProps }) {
  return (
    // Wrap page in global state provider
    <GlobalProvider>
        <ToastProvider placement="top-center">
            <Component {...pageProps} />
        </ToastProvider>
    </GlobalProvider>
  );
}
