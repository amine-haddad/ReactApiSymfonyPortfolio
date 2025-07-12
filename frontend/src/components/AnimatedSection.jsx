// src/components/AnimatedSection.jsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const AnimatedSection = ({ children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" }); // déclenche avant l'arrivée complète

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 250 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.5, ease: "easeOut" }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
