import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FadeSlideIn = ({ children, direction = "left", delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, once: false });

  const variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default FadeSlideIn;
