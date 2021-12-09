import styles from "../styles/components/Loading.module.scss"; // Component styles
import Spinner from "../components/Spinner";

export default function Loading() {
  return (
    <div className={styles.container}>
      <Spinner />
    </div>
  );
}
