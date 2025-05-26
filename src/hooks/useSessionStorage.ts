import { useState, useEffect } from "react";

const useSessionStorage = (key: string) => {
  const [storedData, setStoredData] = useState(null);

  // Helper function to get data from sessionStorage
  const getSessionStorageData = (key: string) => {
    if (typeof window !== "undefined") {
      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  };

  // Helper function to update sessionStorage data
  const updateSessionStorageData = (key: string, newData: object) => {
    if (typeof window !== "undefined") {
      const existingData = sessionStorage.getItem(key);
      let parsedData = existingData ? JSON.parse(existingData) : {};
      parsedData = { ...parsedData, ...newData };
      sessionStorage.setItem(key, JSON.stringify(parsedData));

      // Dispatch a custom event after updating session storage
      const event = new Event("sessionStorageUpdated");
      window.dispatchEvent(event);
    }
  };

  // Function to handle retrieving updated sessionStorage data
  const handleGetSessionStorage = () => {
    const data = getSessionStorageData(key);
    if (data) {
      setStoredData(data);
    }
  };

  // Function to update sessionStorage data
  const handleUpdateSessionStorage = (newData: object) => {
    updateSessionStorageData(key, newData);
  };

  useEffect(() => {
    handleGetSessionStorage(); // Retrieve data on component mount

    const onSessionStorageUpdated = () => {
      handleGetSessionStorage();
    };

    window.addEventListener("sessionStorageUpdated", onSessionStorageUpdated);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener(
        "sessionStorageUpdated",
        onSessionStorageUpdated
      );
    };
  }, [key]);

  return [storedData, handleUpdateSessionStorage];
};

export default useSessionStorage;
