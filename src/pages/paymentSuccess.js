import React, { Fragment, useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Row, Col, ListGroup, Spinner, Form, Button } from 'react-bootstrap';

function PaymentSuccess(props) {
  const { email } = props.customnerInfo;

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '4px',
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          borderRadius: 200,
          height: 200,
          width: 200,
          background: '#F8FAF5',
          margin: '0 auto'
        }}
      >
        <i className='checkmark' style={{
          color: 'darkorange',
          fontSize: '110px',

        }}>✓</i>
      </div>
      <p style={{ fontSize: '30px', fontWeight: 'bold' }}>Thanh toán thành công</p>
      <br />
      <p>
        Thông tin đặt phòng, cách check-in, check-out, hướng dẫn sử dụng dịch vụ
        đã được gửi tới email <b>{email}</b><br /> <span style={{ color: 'red', fontSize: '13px' }}>*Vui lòng check hộp thư nhận hoặc hộp thư spam để nhận mail hướng dẫn</span><br /> <br /> Cảm ơn bạn đã sử dụng dịch
        vụ của chúng tôi!
      </p>
    </div>
  );
}

export default PaymentSuccess;
