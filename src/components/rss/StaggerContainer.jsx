import { motion } from "framer-motion";

const StaggerContainer = ({ children, once = true }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.05,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default StaggerContainer;
