
import React, { createContext, useContext, ReactNode } from 'react';

// Define the context interface with minimal functionality
interface LanguageContextType {
  t: (key: string) => string;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType>({
  t: () => '',
});

// Create a hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Create a simple provider that just returns the key as fallback
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Simple translation function that just returns the key
  const t = (key: string): string => {
    return key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};
