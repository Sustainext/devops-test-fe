
// Save data to LocalStorage
export const saveToLocalStorage = (key, value) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  };
  
  // Load data from LocalStorage
  export const loadFromLocalStorage = (key) => {
    if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        if (item) {
            try {
                return JSON.parse(item);
            } catch (e) {
                return item;
            }
        }
        return null;
    }
    return null;
};
  
  // Remove data from LocalStorage
  export const removeFromLocalStorage = (key) => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  };
  