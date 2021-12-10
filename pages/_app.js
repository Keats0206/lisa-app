import "../styles/globals.scss"; // Global styles
import GlobalProvider from "../containers/index";
import { ToastProvider } from "react-toast-notifications";

export default function MyApp({ Component, pageProps }) {
  return (
      <GlobalProvider>
        <ToastProvider placement="bottom-center">
          <Component {...pageProps} />
        </ToastProvider>
      </GlobalProvider>
  );
}
