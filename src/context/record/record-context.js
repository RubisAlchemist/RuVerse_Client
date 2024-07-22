import { createContext } from "react";

export const RecordContext = createContext(null);

export const RecordProvider = ({ children, value }) => (
  <RecordContext.Provider value={{ ...value }}>
    {children}
  </RecordContext.Provider>
);
