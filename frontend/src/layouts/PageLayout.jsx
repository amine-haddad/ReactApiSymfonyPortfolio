import React from "react";
import DynamicShapes from "../components/DynamicShapes";
import styles from "../styles/PageLayout.module.css";

const PageLayout = ({ children }) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.dynamicBackground}>
        <DynamicShapes />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.containerPageLayout}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
