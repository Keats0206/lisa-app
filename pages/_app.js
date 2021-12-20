import "../styles/globals.scss"; // Global styles
import GlobalProvider from "../containers/index"; // Popup notification provider
import { ToastProvider } from "react-toast-notifications"; // Popup notification provider

export default function MyApp({ Component, pageProps }) {
  return (
    // Wrap app in global state with web3 container
      <GlobalProvider>
        {/* Wrap app with toast provider for push notifications */}
        <ToastProvider placement="bottom-center">
          <Component {...pageProps} />
        </ToastProvider>
      </GlobalProvider>
  );
}
