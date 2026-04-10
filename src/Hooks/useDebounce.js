import { useEffect, useState } from "react";


const useDebounce = (value, delay = 400) => {//// custom hook jo value ko delay ke baad update karta hai


  const [debouncedValue, setDebouncedValue] = useState(value);// debounced value store karega

  useEffect(() => {

    // timer start → delay ke baad value update hogi
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup function → jab value change ho ya component unmount ho
    // previous timer cancel ho jata hai
    return () => clearTimeout(timer);

  }, [value, delay]); // jab value ya delay change hoga tab effect chalega

  // final debounced value return ho jayegi
  return debouncedValue;
};

export default useDebounce;