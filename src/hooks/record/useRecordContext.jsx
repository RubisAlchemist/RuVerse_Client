import React, { useContext } from "react";
import { RecordContext } from "../../context/record/record-context";

const useRecordContext = () => {
  const context = useContext(RecordContext);

  return context;
};

export default useRecordContext;
