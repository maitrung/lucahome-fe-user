import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';


const AvailableAllRoom = (props) => {
    const [loading, setLoading] = useState(false);
    const [homestay, setHomeStay] = useState([]);
    const [timeSlotHeader, setTimeSlotHeader] = useState([]);
    const [data, setData] = useState([]);
    const [bookingTimeData, setBookingTimeData] = useState([]);
    // let prevScrollLeft = 0;

    const [branchList, setBranchList] = useState([]);

    const [startDate, setStartDate] = useState(new Date());

    const fetchDay = 20;

    const covertDayOfWeek = (dayOfWeek) => {
        const convertedValue = (parseInt(dayOfWeek, 10)) % 7;
        return convertedValue === 0 ? 'CN' : (convertedValue + 1).toString();
    }

    const handleChooseFullDay = (item) => {

    }

    const handleOnClickItem = (date, bookingSlot) => {
        let newBooking = _.cloneDeep(bookingTimeData) || [];
        let isSetBookingData = false;

        let existIndex = _.findIndex(newBooking, { date });
        if (existIndex === -1) {
            if (!_.isEmpty(newBooking)) {
                const roomId = newBooking?.[0]?.roomId;
                if (bookingSlot.roomId !== roomId) return;
                const nextDay = moment(date, 'DD-MM-YYYY').add(1, 'days').format('DD-MM-YYYY');
                const prevDay = moment(date, 'DD-MM-YYYY').subtract(1, 'days').format('DD-MM-YYYY');
                switch (bookingSlot.order) {
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
                roomId: bookingSlot.roomId,
                date,
                bookingSlots: [bookingSlot]
            });
            isSetBookingData = true;
        } else {
            let booking = _.cloneDeep(newBooking[existIndex]);
            const findSlot = _.find(booking.bookingSlots, { order: bookingSlot.order });
            if (findSlot) {
                switch (bookingSlot.order) {
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

                if (booking.roomId !== bookingSlot.roomId) return;
                _.remove(booking.bookingSlots, { order: bookingSlot.order });
            } else {
                switch (bookingSlot.order) {
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
            setBookingTimeData(newBooking);
            props?.onChooseTime(newBooking);
        }

    }

    const checkClick = (date, bookingItem) => {
        const exist = _.find(bookingTimeData, { date: date });

        if (exist && exist.roomId === bookingItem.roomId) {
            const findSlot = _.find(exist.bookingSlots, { order: bookingItem.order });
            if (findSlot) return true
        }
        return false
    }

    const tableRef = useRef();


    const fetchData = async (start, homestayProps) => {
        try {
            // Simulate fetching data from an API
            setLoading(true);

            const from = moment(start || startDate).toISOString();
            const to = moment(start || startDate).add(fetchDay, 'days').toISOString();

            const data = {
                from,
                to
            }

            const homestayList = homestayProps || homestay;

            let response = await axios.post(`${process.env.REACT_APP_URL_BACKEND || 'https://luca-home.vercel.app'}/room/checkAvailable`, data);
            response = response?.data
            let newData = [];
            if (response?.code === 1000) {
                newData = response?.data || [];

                const newFormat = [];

                _.forEach(newData, (data) => {
                    const homeStayInfo = _.find(homestayList, { id: data?.roomId });

                    _.forEach(data.dateAvailable, (dateAvailable) => {
                        const existDate = _.find(newFormat, { date2: moment(dateAvailable?.date).format('DD-MM-YYYY') })
                        if (existDate) {
                            const obj = {
                                time1: { ...dateAvailable?.bookingTimeSlots?.[0], roomId: data.roomId, order: 1 },
                                time2: { ...dateAvailable?.bookingTimeSlots?.[1], roomId: data.roomId, order: 2 },
                                time3: { ...dateAvailable?.bookingTimeSlots?.[2], roomId: data.roomId, order: 3 },
                                time4: { ...dateAvailable?.bookingTimeSlots?.[3], roomId: data.roomId, order: 4 },
                                color: homeStayInfo?.branchColor
                            }

                            existDate.data.push(obj);
                        } else {
                            const obj = {
                                date1: covertDayOfWeek(moment(dateAvailable?.date).format('e')),
                                date2: moment(dateAvailable?.date).format('DD-MM-YYYY'),
                                data: [
                                    {
                                        time1: { ...dateAvailable?.bookingTimeSlots?.[0], roomId: data.roomId, order: 1 },
                                        time2: { ...dateAvailable?.bookingTimeSlots?.[1], roomId: data.roomId, order: 2 },
                                        time3: { ...dateAvailable?.bookingTimeSlots?.[2], roomId: data.roomId, order: 3 },
                                        time4: { ...dateAvailable?.bookingTimeSlots?.[3], roomId: data.roomId, order: 4 },
                                        color: homeStayInfo?.branchColor
                                    }
                                ]
                            }
                            newFormat.push(obj)
                        }
                    })
                });

                newData = newFormat;
                setStartDate(moment(to).add(1, 'days'));
                setData((prevData) => [...prevData, ...newData]);
                if (_.isEmpty(timeSlotHeader)) {
                    let header = _.map(newFormat?.[0]?.data, (item) => {
                        return [
                            { value: `${item.time1.startTime} - ${item.time1.endTime}`, color: item.color },
                            { value: `${item.time2.startTime} - ${item.time2.endTime}`, color: item.color },
                            { value: `${item.time3.startTime} - ${item.time3.endTime}`, color: item.color },
                            { value: `Qua đêm ${item.time4.startTime} - ${item.time4.endTime}`, color: item.color }
                        ]
                    })

                    header = _.flattenDeep(header);
                    setTimeSlotHeader(header)
                }
            }
        } catch (error) {
            console.log(`[ERROR] => call api /room/checkAvailable error ${error.message} -- ${JSON.stringify(error)}`);
        }
        setLoading(false);
    };

    const getBranchList = (homeStayList) => {
        try {
            const branchListResult = [];
            const notBranch = {
                id: -1,
                name: '',
                numOfHome: 0
            }
            _.forEach(homeStayList, (homestayInfo) => {
                if (_.isNil(homestayInfo?.branchId)) {
                    notBranch.numOfHome += 1;
                    return;
                };

                const existHomeStay = _.find(branchListResult, { id: homestayInfo?.branchId });
                if (!existHomeStay) {
                    branchListResult.push({
                        id: homestayInfo?.branchId,
                        name: homestayInfo?.branchName,
                        color: homestayInfo?.branchColor,
                        numOfHome: 1
                    });
                } else {
                    existHomeStay.numOfHome += 1;
                }
            })

            if (notBranch.numOfHome > 0) branchListResult.push(notBranch);

            setBranchList(branchListResult);
        } catch (error) {
            console.log(`[ERROR] => [AVAILABLE_ALL_ROOM] get branch list error: ${error.message}`);
        }
    }


    // const handleScrollHorizontal = (event) => {
    //     console.log('here');
    //     event.preventDefault();

    //     // console.log('here');
    //     const scrollDistance = 50; // Khoảng cách cuộn ngang mong muốn
    //     const currentScroll = tableRef.current.scrollLeft;

    //     const scrollDirection = currentScroll > prevScrollLeft ? 1 : -1; // Xác định hướng cuộn
    //     prevScrollLeft = currentScroll;

    //     tableRef.current.scrollLeft += scrollDirection * scrollDistance;

    //     return false;
    // };

    useEffect(() => {
        setHomeStay(props.data.homestay)

        getBranchList(props.data.homestay);

        let start = moment(new Date());
        if (start.isBefore(moment({ hour: 6, minute: 0, second: 0 }))) {
            start = moment().subtract(1, 'days')
        }

        fetchData(start, props.data.homestay);

        // const handleScrollA = () => {
        //     clearTimeout(scrollTimeout);

        //     const scrollDistance = 200; // Khoảng cách cuộn ngang mong muốn
        //     const currentScroll = tableRef.current.scrollLeft;

        //     scrollTimeout = setTimeout(() => {
        //         // Khi sự kiện scroll kết thúc, cập nhật giá trị của scrollLeft
        //         tableRef.current.scrollLeft = Math.round(currentScroll / scrollDistance) * scrollDistance;
        //     }, 300); // Thời gian chờ để xác định sự kiện scroll kết thúc (miliseconds)
        // };



        // const tableContainer = tableRef.current;

        // tableContainer.addEventListener('scroll', handleScrollA);

        return () => {
            // tableContainer.removeEventListener('scroll', handleScrollA);
            // clearTimeout(scrollTimeout);
        };
    }, []);


    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        // Check if the user has scrolled to the bottom
        if (scrollHeight - scrollTop <= clientHeight + 20 && !loading) {
            fetchData();
        }
    };

    return (
        <div className="infinite-scroll-table" onScroll={handleScroll} style={{ fontFamily: 'Cabin' }} ref={tableRef}>
            <Table bordered hover style={{ fontSize: '10px' }}>
                <thead className="available-time-booking">
                    <tr className='freeze-header0'>
                        <th className='sticky-column' colSpan={2}>Chi nhánh</th>
                        {_.map(branchList, (item, index) => (
                            <th key={index} colSpan={item.numOfHome * 4} style={{ fontWeight: 'bolder', backgroundColor: !_.isEmpty(item?.color) ? item?.color : '', color: 'black', position: 'sticky', border: '1px solid #ebafb0' }}>{item.name}</th>
                        ))}
                    </tr>
                    <tr className='freeze-header'>
                        <th className='sticky-column' colSpan={2}>Tên phòng</th>
                        {homestay.map((item, index) => (
                            <th key={index} colSpan={4} style={{ fontWeight: 'bolder', backgroundColor: item.branchColor, position: 'sticky', border: '1px solid #ebafb0' }}>{item.name}</th>
                        ))}
                    </tr>
                    <tr className='freeze-header2'>
                        <th className='sticky-column'>Thứ</th>
                        <th className='sticky-column2' style={{ minWidth: '80px', left: '31px' }}>Ngày</th>
                        {timeSlotHeader.map((item, index) => (
                            <th key={index} style={{ backgroundColor: item.color, position: 'sticky', border: '1px solid #ebafb0' }} >{item.value}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((parentItem, index) => (
                        <tr key={index}>

                            <td className='sticky-column' onClick={() => handleChooseFullDay(parentItem)}>{parentItem.date1}</td>

                            <td className='sticky-column2' style={{ left: '31px' }} onClick={() => handleChooseFullDay(parentItem)}>{parentItem.date2}</td>

                            {parentItem.data.map((item, index) => (
                                <>
                                    <td style={{ minWidth: '70px', backgroundColor: item.color, border: '1px solid #ebafb0' }}>
                                        {((item.time1.isAvailable === false ? (<div className='available-item'>''</div>) : (<div onClick={() => handleOnClickItem(parentItem.date2, item.time1)} className={`inAvailable-item ${checkClick(parentItem.date2, item?.time1) ? 'click-available-item' : ''}`}>''</div>)))}</td>
                                    <td style={{ minWidth: '70px', backgroundColor: item.color, border: '1px solid #ebafb0' }}>{((item.time2.isAvailable === false ? (<div className='available-item'>''</div>) : (<div onClick={() => handleOnClickItem(parentItem.date2, item.time2)} className={`inAvailable-item ${checkClick(parentItem.date2, item?.time2) ? 'click-available-item' : ''}`} >''</div>)))}</td>
                                    <td style={{ minWidth: '70px', backgroundColor: item.color, border: '1px solid #ebafb0' }}>{((item.time3.isAvailable === false ? (<div className='available-item'>''</div>) : (<div onClick={() => handleOnClickItem(parentItem.date2, item.time3)} className={`inAvailable-item ${checkClick(parentItem.date2, item?.time3) ? 'click-available-item' : ''}`} >''</div>)))}</td>
                                    <td style={{ minWidth: '75px', border: '1px solid #ebafb0', backgroundColor: item.color }}>{((item.time4.isAvailable === false ? (<div className='available-item'>''</div>) : (<div onClick={() => handleOnClickItem(parentItem.date2, item.time4)} className={`inAvailable-item ${checkClick(parentItem.date2, item?.time4) ? 'click-available-item' : ''}`}>''</div>)))}</td>
                                </>
                            ))}

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

export default AvailableAllRoom;