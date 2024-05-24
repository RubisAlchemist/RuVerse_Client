import { createContext } from "react";

export const RecordContext = createContext(null);

const initState = {
  videoRecordBlob: null,
  screenRecordBlob: null,
  isUploading: false,
  startUploading: () => {},
  endUploading: () => {},
};

export const RecordProvider = ({ children, ...initState }) => (
  <RecordContext.Provider value={{ ...initState }}>
    {children}
  </RecordContext.Provider>
);
