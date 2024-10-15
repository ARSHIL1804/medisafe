import React, {createContext, useState, useContext, useEffect} from 'react';
import { LineLoaderOverlay } from 'react-spinner-overlay';
import { number } from 'zod';



interface OverlayContextState {
    open():void,
    close():void,
}

const OverlayContext = createContext<OverlayContextState>({
    open:()=>{},
    close:()=>{},
});

export function OverlayProvider(
  { children } :Readonly<{children: React.ReactNode;}>) {

  const [count, setCount] = useState(0);

  const open = () => {
    setCount((prevCount) => prevCount + 1);
  } 

  const close = () => {
    setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
  };


  useEffect(() => {
    document.addEventListener("openOverlay", open);
    document.addEventListener("closeOverlay", close);

    return () => {
      document.removeEventListener("openOverlay", open);
      document.removeEventListener("closeOverlay", close);
    };
  }, []);

  const value = {
    open,
    close,
  };


  return (
    <OverlayContext.Provider value={value}>
        <LineLoaderOverlay
            loading={count > 0}
            message={
              <p style={{ marginTop: "12px" }}>
                 Loading...
              </p>
            }
            color="#32C7BB"
        />
      {children}
    </OverlayContext.Provider>
  );
}

export const useOverlay = () =>{ return useContext(OverlayContext) }