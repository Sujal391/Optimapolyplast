// import { useState, useEffect } from "react";
// function useWindowSize() {
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
//   const [isOpen,setIsOpen] = useState(false);

//   useEffect(() =>{
//     const handleResize = () =>{
//         const mobile = window.innerWidth < 1024;
//         setIsMobile(mobile);
//         if(!isMobile) setIsOpen(false);
//     };
//     handleResize()
//     isMobile.addEventListner('resize',handleResize)
//     return () =>isMobile.removeEventListner('resize',handleResize)
//   },[]);
// }
// export default useWindowSize;

import { useState, useEffect } from "react";

function useWindowSize() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };
    
    // Call handleResize initially to set the correct state
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  return { isMobile, isOpen, setIsOpen };
}

export default useWindowSize;
