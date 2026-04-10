import { createContext, useContext, useState } from "react";

const CursorContext = createContext();

export const CursorProvider = ({ children }) => {
  const [cursor, setCursor] = useState({
    label: "",
    variant: "default", // default | pill | emoji
  });

  const updateCursor = (config) => {
    setCursor((prev) => ({ ...prev, ...config }));
  };

  const resetCursor = () => {
    setCursor({ label: "", variant: "default" });
  };

  return (
    <CursorContext.Provider value={{ cursor, updateCursor, resetCursor }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);
