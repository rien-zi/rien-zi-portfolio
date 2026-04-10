import { motion } from "framer-motion";

const FadeSlideIn = ({ children, direction = "up", distance = 60 }) => {
  const getHidden = () => {
    switch (direction) {
      case "left":
        return { x: -distance, opacity: 0 };
      case "right":
        return { x: distance, opacity: 0 };
      case "up":
        return { y: distance, opacity: 0 };
      case "down":
        return { y: -distance, opacity: 0 };
      case "scale":
        return { scale: 0.95, opacity: 0 };
      case "fade":
        return { opacity: 0 };
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      style={{ willChange: "transform, opacity", height: "100%" }}
      className="h-full"
      variants={{
        hidden: getHidden(),
        visible: {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 110,
            damping: 14,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeSlideIn;
