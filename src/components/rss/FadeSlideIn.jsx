import React, { Suspense } from "react";

const MotionDiv = React.lazy(() =>
  import("framer-motion").then((mod) => ({
    default: mod.motion.div,
  })),
);

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
    <Suspense fallback={<div style={{ height: "100%" }} />}>
      <MotionDiv
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
      </MotionDiv>
    </Suspense>
  );
};

export default FadeSlideIn;
