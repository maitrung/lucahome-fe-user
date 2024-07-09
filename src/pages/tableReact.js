import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import { Table, Spinner } from 'react-bootstrap';


const InfiniteScrollTable = (props) => {
    const tableRef = useRef();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [roomId, setRoomId] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [headerValue, setHeaderValue] = useState([]);
    const [bookingData, setBookingData] = useState([]);
    const [firstScrollIndex, setFirstScrollIndex] = useState(0);

    const fetchDay = 20;

    const covertDayOfWeek = (dayOfWeek) => {
        const convertedValue = (parseInt(dayOfWeek, 10)) % 7;
        return convertedValue === 0 ? 'CN' : (convertedValue + 1).toString();
    }

    const handleChooseFullDay = (item) => {
        let newBooking = _.cloneDeep(bookingData) || [];
        let isSetNewBooking = false;

        const exist = _.find(newBooking, { date: item.date2 })

        if (_.isNil(exist)) {
            let available = item.time1.isAvailable && item.time2.isAvailable && item.time3.isAvailable && item.time4.isAvailable

            if (!_.isEmpty(newBooking)) {
                const nextDay = moment(item.date2, 'DD-MM-YYYY').add(1, 'days').format('DD-MM-YYYY');
                const prevDay = moment(item.date2, 'DD-MM-YYYY').subtract(1, 'days').format('DD-MM-YYYY');
                if (!_.find(_.find(newBooking, { date: nextDay })?.bookingSlots, { order: 1 }) && !_.find(_.find(newBooking, { date: prevDay })?.bookingSlots, { order: 4 })) available = false;
            }

            if (available) {
                newBooking.push({
                    date: item.date2,
                    bookingSlots: [
                        { ...item.time1, order: 1 },
                        { ...item.time2, order: 2 },
                        { ...item.time3, order: 3 },
                        { ...item.time4, order: 4 }
                    ]
                });
                isSetNewBooking = true;
            }
        } else {
            const nextDay = moment(item.date2, 'DD-MM-YYYY').add(1, 'days').format('DD-MM-YYYY');
            const prevDay = moment(item.date2, 'DD-MM-YYYY').subtract(1, 'days').format('DD-MM-YYYY');
            if (!_.find(newBooking, { date: nextDay }) || !_.find(newBooking, { date: prevDay })) {
                _.remove(newBooking, { date: item.date2 });
                isSetNewBooking = true;
            }
        }


        if (isSetNewBooking) {
            setBookingData(newBooking);
            props?.chooseDate(newBooking);
        }
    }

    const handleOnClickItem = (date, bookingSlot, order) => {
        _.set(bookingSlot, 'order', order)
        let newBooking = _.cloneDeep(bookingData) || [];
        let isSetBookingData = false;

        let existIndex = _.findIndex(newBooking, { date });
        if (existIndex === -1) {
            if (!_.isEmpty(newBooking)) {
                const nextDay = moment(date, 'DD-MM-YYYY').add(1, 'days').format('DD-MM-YYYY');
                const prevDay = moment(date, 'DD-MM-YYYY').subtract(1, 'days').format('DD-MM-YYYY');
                switch (order) {
                    case 1: {
                        const existPrevDay = _.find(newBooking, { date: prevDay })
                        if (!existPrevDay) return;
                        const existOrder4 = _.find(existPrevDay.bookingSlots, { order: 4 })
                        if (!existOrder4) return;
                        break;
                    }

                    case 4: {
                        const existNextDay = _.find(newBooking, { date: nextDay })
                        if (!existNextDay) return;
                        const existOrder1 = _.find(existNextDay.bookingSlots, { order: 1 })
                        if (!existOrder1) return;
                        break;
                    }
                    default:
                        return;
                }
            }

            newBooking.push({
                date,
                bookingSlots: [bookingSlot]
            });
            isSetBookingData = true;
        } else {
            let booking = _.cloneDeep(newBooking[existIndex]);
            const findSlot = _.find(booking.bookingSlots, { order });
            if (findSlot) {
                switch (order) {
                    case 2: {
                        if (_.find(booking.bookingSlots, { order: 1 }) && _.find(booking.bookingSlots, { order: 3 })) return;
                        break;
                    }
                    case 3: {
                        if (_.find(booking.bookingSlots, { order: 2 }) && _.find(booking.bookingSlots, { order: 4 })) return;
                        break;
                    }
                    case 1: {
                        const prevDay = moment(date, 'DD-MM-YYYY').subtract(1, 'days').format('DD-MM-YYYY');
                        if (_.find(booking.bookingSlots, { order: 2 }) && _.find(newBooking, { date: prevDay })) return;
                        break;
                    }
                    case 4: {
                        const nextDay = moment(date, 'DD-MM-YYYY').add(1, 'days').format('DD-MM-YYYY');
                        if (_.find(booking.bookingSlots, { order: 3 }) && _.find(newBooking, { date: nextDay })) return;
                        break;
                    }
                    default:
                        return;
                }
                _.remove(booking.bookingSlots, { order });
            } else {
                switch (order) {
                    case 1: {
                        if (!_.find(booking.bookingSlots, { order: 2 })) return;
                        break;
                    }
                    case 4: {
                        if (!_.find(booking.bookingSlots, { order: 3 })) return;
                        break;
                    }
                    case 2: {
                        if (!_.find(booking.bookingSlots, { order: 3 }) && !_.find(booking.bookingSlots, { order: 1 })) return;
                        break;
                    }
                    case 3: {
                        if (!_.find(booking.bookingSlots, { order: 4 }) && !_.find(booking.bookingSlots, { order: 2 })) return;
                        break;
                    }
                    default:
                        return;
                }
                booking.bookingSlots.push(bookingSlot);
            }

            if (_.isEmpty(booking.bookingSlots)) {
                _.remove(newBooking, { date })
            } else {
                newBooking[existIndex] = booking;
            }
            isSetBookingData = true;
        }
        if (isSetBookingData) {
            setBookingData(newBooking);
            props?.chooseDate(newBooking);
        }
    }

    const checkClick = (date, order) => {
        const exist = _.find(bookingData, { date: date });

        if (exist) {
            const findSlot = _.find(exist.bookingSlots, { order: order });
            if (findSlot) {
                return true
            };
        }
        return false
    }

    const fetchData = async (room, start, toDate) => {
        const returnData = {}
        try {
            // Simulate fetching data from an API
            setLoading(true);

            const from = moment(start || startDate).toISOString();
            let to = moment(start || startDate).add(fetchDay, 'days').toISOString();
            if (!_.isNil(toDate)) {
                to = moment(toDate).add(fetchDay, 'days').toISOString();
            }

            const data = {
                roomId: room || roomId,
                from,
                to
            }

            let response = await axios.post(`${process.env.REACT_APP_URL_BACKEND || 'https://luca-home.vercel.app'}/room/checkAvailable`, data);
            response = response?.data
            let newData = [];
            if (response?.code === 1000) {
                newData = response?.data?.[0]?.dateAvailable || [];

                const newFormat = [];
                _.forEach(newData, (data) => {
                    const obj = {
                        date1: covertDayOfWeek(moment(data?.date).format('e')),
                        date2: moment(data?.date).format('DD-MM-YYYY'),
                        time1: data?.bookingTimeSlots?.[0],
                        time2: data?.bookingTimeSlots?.[1],
                        time3: data?.bookingTimeSlots?.[2],
                        time4: data?.bookingTimeSlots?.[3],
                    }
                    newFormat.push(obj);
                });

                if (!_.isNil(toDate)) {
                    const formatDate = moment(toDate).format('DD-MM-YYYY');
                    const index = _.findIndex(newFormat, { date2: formatDate });
                    if (index !== -1) setFirstScrollIndex(index - 5);
                    returnData.scrollIndex = index - 5;
                }

                newData = newFormat;
                setStartDate(moment(to).add(1, 'days'));
            }
            setData((prevData) => [...prevData, ...newData]);
        } catch (error) {
            console.log(`[ERROR] => call api /room/checkAvailable error ${error.message} -- ${JSON.stringify(error)}`);
        }
        setLoading(false);

        // handleScrollToPosition(returnData.scrollIndex)
        return returnData;
    };

    useEffect(() => {
        // window.scrollTo(0, 0);
        setRoomId(props?.data?.roomId);

        const bookingTimeSlots = props?.data?.bookingTimeSlots || [];
        const header = ['Thứ', 'Ngày'];
        _.forEach(bookingTimeSlots, (slot) => {
            if (slot?.name === 'threeHours') header.push(`${slot?.startTime} - ${slot?.endTime}`);
            if (slot?.name === 'overNight') header.push(`Qua đêm ${slot?.startTime} - ${slot?.endTime}`);
        });
        setHeaderValue(header);

        setBookingData(props?.data?.bookDateData || [])

        let start = moment(new Date());
        if (start.isBefore(moment({ hour: 6, minute: 0, second: 0 }))) {
            start = moment().subtract(1, 'days')
        }
        setStartDate(start);

        let to;
        if (!_.isEmpty(props?.data?.bookDateData)) {
            to = moment(props?.data?.bookDateData?.[0]?.date, 'DD-MM-YYYY');
        }

        fetchData(props?.data?.roomId, start, to).then((data) => {
            handleScrollToPosition(data.scrollIndex);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        // Check if the user has scrolled to the bottom
        if (scrollHeight - scrollTop <= clientHeight + 10 && !loading) {
            fetchData(roomId, startDate);
        }
    };

    const handleScrollToPosition = (index) => {
        if (index > 0) {
            setTimeout(() => {
                const project = document.getElementById(`go-to-${index}`);
                if (project) {
                    project.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        }
    }

    return (
        <div className="infinite-scroll-table" onScroll={handleScroll} style={{ fontFamily: 'Cabin' }}>
            <Table ref={tableRef} striped bordered hover style={{ fontSize: '10px' }}>
                <thead className="table-detail-time-booking">
                    <tr>
                        {headerValue.map((item, index) => (
                            <th style={{ border: '1px solid #ebafb0', top: '-1px', boxShadow: '0 2px 2px -1px #ebafb0' }} key={index}  >{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} id={`go-to-${index}`}>

                            <td className='sticky-column' onClick={() => handleChooseFullDay(item)}>{item.date1}</td>

                            <td className='sticky-column2' style={{ left: '10px' }} onClick={() => handleChooseFullDay(item)}>{item.date2}</td>
                            <td style={{ border: '1px solid #ebafb0' }}>
                                {((item.time1.isAvailable === false ? (<div className='available-item'>''</div>) : (<div onClick={() => handleOnClickItem(item.date2, item.time1, 1)} className={`inAvailable-item ${checkClick(item.date2, 1) ? 'click-available-item' : ''}`}>''</div>)))}</td>
                            <td style={{ border: '1px solid #ebafb0' }}>{((item.time2.isAvailable === false ? (<div className='available-item'>''</div>) : (<div onClick={() => handleOnClickItem(item.date2, item.time2, 2)} className={`inAvailable-item ${checkClick(item.date2, 2) ? 'click-available-item' : ''}`} >''</div>)))}</td>
                            <td style={{ border: '1px solid #ebafb0' }}>{((item.time3.isAvailable === false ? (<div className='available-item'>''</div>) : (<div onClick={() => handleOnClickItem(item.date2, item.time3, 3)} className={`inAvailable-item ${checkClick(item.date2, 3) ? 'click-available-item' : ''}`} >''</div>)))}</td>
                            <td style={{ border: '1px solid #ebafb0' }}>{((item.time4.isAvailable === false ? (<div className='available-item'>''</div>) : (<div onClick={() => handleOnClickItem(item.date2, item.time4, 4)} className={`inAvailable-item ${checkClick(item.date2, 4) ? 'click-available-item' : ''}`}>''</div>)))}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {loading && (
                <div className="loading-spinner">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}
        </div>
    );
};

export default InfiniteScrollTable;