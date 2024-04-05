import numeral from 'numeral';
import momentTimezone from 'moment-timezone';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Table, Spinner } from 'react-bootstrap';

const BookingByRoomTable = (props) => {
  const [loading, setLoading] = useState(false);

  const { bookingData, homeStay = {} } = props;
  let { bookingTimeSlots } = homeStay;

  const header = ['Thứ', 'Ngày'];

  _.forEach(bookingTimeSlots, (slot) => {
    if (slot?.name === 'threeHours')
      header.push(`${slot?.startTime} - ${slot?.endTime}`);
    if (slot?.name === 'overNight')
      header.push(`Qua đêm ${slot?.startTime} - ${slot?.endTime}`);
  });

  return (
    <div
      style={{ fontFamily: `"Cabin", sans-serif`, fontSize: '12px', margin: '10px auto'}}
    >
      <div></div>
      <div style={{ textAlign: 'center' }}>
        <Table striped bordered hover className='booking-by-room'>
          <thead>
            <tr>
              <td colSpan={header.length}
                style={{
                  textAlign: 'center',
                  verticalAlign: 'center',
                  padding: '15px',
                  fontSize: '18px'
                }}
              >
                <b>{homeStay.name}</b>
              </td>
            </tr>
            <tr>
              {header.map((item, index) => (
                <th
                  key={index}
                  style={
                    item === 'Thứ' || item === 'Ngày'
                      ? { maxWidth: '100px' }
                      : {}
                  }
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {_.map(bookingData?.dateAvailable, (item, index) => {
              const dayOfWeek = momentTimezone(item?.date).day();
              const dayOfWeekStr = [
                'Chủ nhật',
                'Thứ 2',
                'Thứ 3',
                'Thứ 4',
                'Thứ 5',
                'Thứ 6',
                'Thứ bảy'
              ][dayOfWeek];
              return (
                <tr key={index}>
                  <td>{dayOfWeekStr}</td>
                  <td>
                    {momentTimezone(item?.date)
                      .tz('Asia/Ho_Chi_Minh')
                      .format('DD/MM/YYYY')}
                  </td>
                  {_.map(item?.bookingTimeSlots, (slot, index) => {
                    return (
                      <td
                        className={
                          slot.isAvailable ? 'empty-room' : 'filled-room'
                        }
                      >
                        {slot.isAvailable ? (
                          <p style={{ color: 'green' }}>Còn trống</p>
                        ) : (
                          <div>
                            <p>
                              Booking ID:{' '}
                              <span
                                style={{
                                  color: 'rgb(223, 169, 116)',
                                  fontWeight: 'bold'
                                }}
                              >
                                {slot.booking.bookingId}
                              </span>
                            </p>
                            <p>Tên: {slot.booking.contactName}</p>
                            <p>
                              SĐT: {slot.booking.contactPhone} -{' '}
                              {slot.booking.contactChannel}
                            </p>
                            {slot.booking.status === 'PENDING' && (
                              <p style={{ color: 'red' }}>
                                Đang thanh toán . . .
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr>
              <td colSpan={header.length}>
                <b>Tổng doanh thu: {numeral(bookingData?.statistic?.revenue).format('0,0')} đ</b>
              </td>
            </tr>
          </tbody>
        </Table>
        {loading && (
          <div className='loading-spinner'>
            <Spinner animation='border' variant='primary' />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingByRoomTable;
