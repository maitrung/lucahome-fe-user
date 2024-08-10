import React, { useEffect } from 'react';
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
  // Automatically call open() when the component mounts
  useEffect(() => {
    open();
  }, [open]); // Dependency array includes open to ensure it's called only when open is available

  return (
    <div>
      <div id='payOS'></div>
    </div>
  );
};

export default PayOS;
