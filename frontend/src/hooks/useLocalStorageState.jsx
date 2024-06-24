import React, { useState, useEffect } from "react";

const useLocalStorageState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    const value = window.localStorage.getItem(key) || defaultValue;
    if (value === "undefined") {
      return undefined;
    }
    return value;
  });

  useEffect(() => {
    window.localStorage.setItem(key, state);
  }, [key, state]);

  return [state, setState];
};

export default useLocalStorageState;
