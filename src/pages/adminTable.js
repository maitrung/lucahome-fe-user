import axios from 'axios';
import momentTimezone from 'moment-timezone';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Table, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import BookingByRoomTable from './bookingByRoomTable';

const InfiniteScrollTable = (props) => {
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookingData, setBookingData] = useState({});
  const [homeStayIdList, setHomeStayIdList] = useState([]);
  const [homestay, setHomeStay] = useState([]);
  const [roomFilterSelect, setRoomFilterSelect] = useState(null);

  const fetchRoomAvailable = async ({ roomId, from, to }) => {
    try {
      setLoading(true);
      const queryParams = {};
      if (roomId) queryParams.roomId = roomId;
      if (from) queryParams.from = from;
      if (to) queryParams.to = to;
      console.log(
        '\n - file: adminTable.js:33 - fetchRoomAvailable - queryParams:',
        queryParams
      );

      let response = await axios.post(
        `${process.env.REACT_APP_URL_BACKEND || 'https://luca-home.vercel.app'}/room/checkAvailable`,
        queryParams
      );
      response = response?.data || {};

      setBookingData(response?.data);
    } catch (error) {
      console.log(
        `[ERROR] => call api /room/checkAvailable error ${error.message
        } -- ${JSON.stringify(error)}`
      );
    }
    setLoading(false);
  };

  const fetchHomeStay = async () => {
    setLoading(true);
    try {
      let homestayResult = await axios.post(
        `${process.env.REACT_APP_URL_BACKEND || 'https://luca-home.vercel.app'}/room/search`
      );
      homestayResult = homestayResult?.data;

      if (homestayResult?.code === 1000) {
        setHomeStay(homestayResult?.data?.rooms);

        const homeStayNewFormat = [];
        _.forEach(homestayResult?.data?.rooms, (item) => {
          homeStayNewFormat.push({
            value: item.id,
            label: item.name
          });
        });
        if (homeStayNewFormat.length > 0) {
          setHomeStayIdList(homeStayNewFormat);
        }
      }
    } catch (error) {
      console.log(
        `ERROR when call get list homestay ${error.message} -- ${JSON.stringify(
          error
        )}`
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    // set room id
    // setRoomId(roomFilterSelect?.value);

    const start = momentTimezone()
      .tz('Asia/Ho_Chi_Minh')
      // .subtract(1, 'days')
      .startOf('day')
      .toDate();
    setStartDate(start);

    const end = momentTimezone()
      .tz('Asia/Ho_Chi_Minh')
      .add(7, 'days')
      .startOf('day')
      .toDate();
    setEndDate(end);

    fetchHomeStay();

    // fetchRoomAvailable({
    //   from: start,
    //   to: end
    // });
  }, []);

  return (
    <div className='admin-table'>
      <div className='select-option'>
        <label for='guest'>Phòng:</label>
        <Select
          className='basic-single'
          classNamePrefix='select'
          value={roomFilterSelect}
          isClearable={true}
          isSearchable={true}
          options={homeStayIdList}
          onChange={(optionSelected) => {
            setRoomFilterSelect(optionSelected);
          }}
          placeholder='Tất cả phòng'
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'end', marginTop: '20px' }}>
        <div className='check-date' style={{ marginRight: '20px' }}>
          <label for='date-in'>Từ ngày:</label>
          <DatePicker
            id='date-in'
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat='dd/MM/yyyy'
          />
        </div>
        <div className='check-date' style={{ marginRight: '20px' }}>
          <label for='date-in'>Đến ngày:</label>
          <DatePicker
            id='date-in'
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat='dd/MM/yyyy'
          // showTimeInput
          />
        </div>
        <button
          className='admin-search-button'
          type='submit'
          style={{
            height: '33px',
            backgroundColor: '#fcead6',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            letterSpacing: '2px',
            fontFamily: `"Cabin", sans-serif`,
            fontSize: '11px'
          }}
          onClick={() => {
            setBookingData({});
            fetchRoomAvailable({
              roomId: roomFilterSelect?.value,
              from: startDate,
              to: endDate
            });
          }}
        >
          Tìm
        </button>
      </div>
      <div></div>
      {_.map(bookingData, (bookingByRoom, index) => {
        return (
          <BookingByRoomTable
            bookingData={bookingByRoom}
            homeStay={homestay.find(
              (item) => item.id === bookingByRoom?.roomId
            )}
            key={index}
          />
        );
      })}
      {loading && (
        <div className='loading-spinner' style={{
          marginTop: '20px',
        }}>
          <Spinner animation='border' variant='primary' />
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollTable;
