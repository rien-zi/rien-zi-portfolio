import { useEffect } from "react";

const ScrollToSection = ({ id }) => {
  useEffect(() => {
    const el = document.getElementById(id);

    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [id]);

  return null;
};

export default ScrollToSection;
