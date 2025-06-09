import styles from "../styles/Spinner.module.css";

const Spinner = () => (
  <div className={styles.spinnerContainer}>
    <div className={styles.spinner}></div>
    <p>Chargement...</p>
  </div>
);

export default Spinner;