const useLocalStorage = () => {
  const getStoredValue = (key, initialValue) => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error('Error retrieving localStorage value:', error);
      return initialValue;
    }
  };

  const setStoredValue = (key, newValue) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(getStoredValue(key)) : newValue;

      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage value:', error);
    }
  };

  return { getStoredValue, setStoredValue };
}

export default useLocalStorage;
