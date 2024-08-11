import React, {useState, useEffect } from 'react';
import { usePayOS, PayOSConfig } from "payos-checkout";


const PayOS = ({bookingdata}) => {
  console.log(bookingdata);
  const config = {
    RETURN_URL: 'https://www.lucahome.info',
    ELEMENT_ID: 'payOS',
    CHECKOUT_URL: bookingdata?.url,
    embedded: true
  };
  console.log(config);
  const { open, exit } = usePayOS(config);
  const [isQRCodeGenerated, setQRCodeGenerated] = useState(false);
  const [isPayOSRendered, setPayOSRendered] = useState(false);

  // Automatically call open() when the component mounts
  useEffect(() => {
    if (!isQRCodeGenerated) {
      open();
      setQRCodeGenerated(true);
    }
  }, [open, isQRCodeGenerated]); // Dependency array includes open to ensure it's called only when open is available

  return (
    <div>
       <style jsx>{`
        #payOS {
          width: 100%;
          height: 400px;
        }
      `}</style>
     {!isPayOSRendered && <div id='payOS' onRender={() => setPayOSRendered(true)}></div> } 
    </div>
  );
};

export default PayOS;
