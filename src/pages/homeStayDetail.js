import React, { Fragment, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Menu from './menu';
import numeral from 'numeral';
import Footer from './footer';
import moment from 'moment-timezone';
import momentAdd from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import _ from 'lodash';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Row, Col, ListGroup, Spinner, Form, Button, Carousel, InputGroup, FormControl, Image } from 'react-bootstrap'
import QRCode from 'qrcode.react';
import InfiniteScrollTable from './tableReact';
import NumberOfPeopleInput from './numberPeopleInput';
import PaymentSuccess from './paymentSuccess';
import CopyButton from './copyButton';
import CountdownTimer from './countDownTime';
import Compressor from 'compressorjs';

function HomeStayDetail() {
    const [homeStay, setHomeStay] = useState({});
    const [isLoadingBooking, setIsLoadingBooking] = useState(false);
    const [isErrorBooking, setErrorBooking] = useState(false);
    const [intervalQueryId, setIntervalQueryId] = useState(null);

    const [timeCountDownQrCode, setTimeCountDownQrCode] = useState(10 * 60);

    const [bookingResult, setBookingResult] = useState({});
    const [queryBookingSuccess, setQueryBookingSuccess] = useState(false);

    const [totalPayment, setTotalPayment] = useState(0);
    const [isLoadingTotalPayment, setIsLoadingTotalPayment] = useState(false);

    const [imagesCCCD, setImagesCCCD] = useState([]);

    const handleImageChange = async (index, file) => {
        const updatedImages = [...imagesCCCD];
        updatedImages[index] = file;
        if (updatedImages.length === 2) setErrorImageInfo('');
        setImagesCCCD(updatedImages);
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        handleImageChange(index, file);
    };


    const [numPeople, setNumPeople] = useState(2);
    const changeNumPeople = (data) => {
        setNumPeople(data)
    }

    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        email: '',
        cccd: '',
        note: ''
    });

    const [errorsCustomerInfo, setErrorCustomerInfo] = useState({
        name: '',
        phone: '',
        email: '',
        cccd: '',
        note: ''
    });

    const handleChangeCustomerInfo = (e) => {
        const { name, value } = e.target;
        setCustomerInfo((prevData) => ({ ...prevData, [name]: value }));
        setErrorCustomerInfo((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const [showInputCCCD, setShowInputCCCD] = useState(false);

    const checkShowInputCCCD = (data) => {
        let isShow = false;
        if (!_.isEmpty(data)) {
            const overNightSlot = _.find(data?.bookingSlots || [], { order: 4 })
            if (overNightSlot) isShow = true;
        }

        setShowInputCCCD(isShow);

        return isShow;
    }

    const [bookDateData, setBookDateData] = useState([]);
    const dataChooseDate = (data) => {
        setIsLoadingTotalPayment(false)
        setBookDateData(data);
        // checkShowInputCCCD(data);
    }
    useEffect(() => {
        calTotalPayment();
    }, [bookDateData]);

    const [errorBookDateData, setErrorBookDateData] = useState({
        isValid: true,
        message: ''
    });
    const checkBookDateDate = () => {
        let orderList = _.map(bookDateData?.bookingSlots || [], 'order')
        orderList = _.sortBy(orderList)

        // if (orderList.length > 1 && orderList.length < 4 && _.includes(orderList, 4)) {
        //     setErrorBookDateData({
        //         isValid: false,
        //         message: 'Không được đặt qua đêm với khung giờ khác (Trừ trường hợp đặt cả ngày)'
        //     });
        //     return false;
        // };

        if (_.isEqual(orderList, [1, 3])) {
            setErrorBookDateData({
                isValid: false,
                message: 'Các khung giờ đặt phải liên tiếp nhau'
            });
            return false;
        }

        return true;
    }
    const [showModalErrorBookData, setShowModalErrorBookData] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    };

    const timeoutQrCode = () => {
        setShow(false);
    }

    const handleCloseModalError = () => {
        setShowModalErrorBookData(false)
    };

    // const getTimeAvailable = async (roomId, date) => {
    //     try {
    //         setCheckInTime(date);
    //         setIsLoadingCheckIn(true);
    //         const data = {
    //             roomId,
    //             from: moment(date).startOf('day').toISOString(),
    //             to: moment(date).endOf('day').toISOString()
    //         }
    //         let response = await axios.post('https://booking-beta-blush.vercel.app/room/checkAvailable', data);
    //         response = response?.data
    //         let result = [];
    //         if (response?.code === 1000) {
    //             result = response?.data?.[0]?.dateAvailable?.[0]?.bookingTimeSlots || [];
    //         }

    //         let startTimeOfSLotFullDay;
    //         let endTimeOfSLotFullDay;


    //         const threeHoursSlot = [];
    //         const overNightSlot = [];
    //         _.map(result, (slot, index) => {
    //             if (slot?.name === 'threeHours' && slot?.isAvailable === true) {
    //                 threeHoursSlot.push({
    //                     value: 'slot3Hours1',
    //                     label: `${slot?.startTime} - ${slot?.endTime}`,
    //                     data: {
    //                         from: slot?.from,
    //                         to: slot?.to
    //                     }
    //                 });
    //                 if (index === 0) startTimeOfSLotFullDay = slot?.from;
    //             } else if (slot?.name === 'overNight' && slot?.isAvailable === true) {
    //                 overNightSlot.push({
    //                     value: 'overNight',
    //                     label: `${moment(slot?.from).tz('Asia/Ho_Chi_Minh').format('DD/MM HH:mm')} - ${moment(slot?.to).tz('Asia/Ho_Chi_Minh').format('DD/MM HH:mm')}`,
    //                     data: {
    //                         from: slot?.from,
    //                         to: slot?.to
    //                     }
    //                 });
    //                 endTimeOfSLotFullDay = slot?.to;
    //             }
    //         });
    //         if (!_.isEmpty(threeHoursSlot) || !_.isEmpty(overNightSlot)) {
    //             set3SlotHoursList(threeHoursSlot);

    //             setSlotOverNightList(overNightSlot);
    //             setSlotOverNight(overNightSlot[0]);

    //             const fullDayList = [{
    //                 value: 'fullDay',
    //                 label: `${moment(startTimeOfSLotFullDay).tz('Asia/Ho_Chi_Minh').format('DD/MM HH:mm')} - ${moment(endTimeOfSLotFullDay).tz('Asia/Ho_Chi_Minh').format('DD/MM HH:mm')}`,
    //                 data: {
    //                     from: startTimeOfSLotFullDay,
    //                     to: endTimeOfSLotFullDay
    //                 }
    //             }];
    //             setSlotFullDayList(fullDayList);
    //             setSlotFullDay(fullDayList[0]);

    //         }
    //         setIsLoadingCheckIn(false)
    //         return result;
    //     } catch (error) {
    //         console.log(`ERROR when call get available list ${error.message} -- ${JSON.stringify(error)}`);
    //     }
    // }

    const compressImages = async (file) => {
        return new Promise((resolve, reject) => {
            new Compressor(file, {
                quality: 0.1, // Chất lượng hình ảnh sau khi nén (từ 0.1 đến 1.0)
                success(result) {
                    // Đã nén xong, result là một Blob mới
                    resolve(result);
                },
                error(err) {
                    reject(err);
                },
            });
        });
    }

    const bookHomeStay = async () => {
        setIsLoadingBooking(true);
        try {
            if (intervalQueryId) {
                clearInterval(intervalQueryId);
                setIntervalQueryId(null);
            }

            setErrorBooking(false);
            setQueryBookingSuccess(false);

            // upload image cccd
            const uploadImageUrls = []
            for (let index = 0; index < imagesCCCD.length; index++) {
                try {
                    const compressImageResult = await compressImages(imagesCCCD[index])

                    if (compressImageResult) {
                        const formData = new FormData();
                        formData.append('image', compressImageResult);
                        let response = await axios.post(`${process.env.REACT_APP_URL_BACKEND || 'https://luca-home.vercel.app'}/upload`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        response = response?.data
                        if (response?.code === 1000) {
                            uploadImageUrls.push(response?.data?.url)
                        }
                    }

                } catch (error) {
                    console.log(`ERROR when upload images ${error.message} -- ${JSON.stringify(error)}`);
                }
            }
            // if (uploadImageUrls.length === 2) setImagesCCCD(uploadImageUrls);

            let from;
            let to;
            let bookingList = _.sortBy(bookDateData, returnDateBookData)
            bookingList = _.map(bookingList, (item, index) => {
                const result = {
                    date: item.date,
                }
                let bookingSlots = _.sortBy(item.bookingSlots, ['order']);
                if (index === 0) {
                    from = bookingSlots?.[0]?.from
                }
                if (index === bookingList.length - 1) {
                    to = _.last(bookingSlots)?.to
                }
                const slots = _.map(bookingSlots, (slot) => {
                    return slot.order - 1;
                })
                result.slots = slots;
                return result;
            })

            const data = {
                roomId: homeStay.id,
                contactName: customerInfo.name,
                contactPhone: customerInfo.phone,
                contactEmail: customerInfo.email,
                contactChannel: 'Zalo',
                totalCustomer: numPeople,
                identifyCardNumber: uploadImageUrls,
                bookingList,
                note: customerInfo.note
            }

            let response = await axios.post(`${process.env.REACT_APP_URL_BACKEND || 'https://luca-home.vercel.app'}/booking/v2`, data);
            response = response?.data
            let bookingResponse = {};
            if (response?.code === 1000) {
                response = response?.data
                bookingResponse = {
                    bookingId: response?.bookingId,
                    qrContent: "https://img.vietqr.io/image/vietinbank-101870399674-compact2.jpg?amount=" + response?.amount + "&addInfo=luca" + customerInfo.phone+"bId"+response?.bookingId+"&accountName=BUI%20THI%20HIEN",
                    bankInfo: response?.bankInfo,
                    amount: response?.amount,
                    from: `${moment(from).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}`,
                    to: `${moment(to).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}`,
                    expired: momentAdd(moment(new Date()).tz('Asia/Ho_Chi_Minh')).add(360, 'minutes')
                };
                setBookingResult(bookingResponse);
                intervalQueryBooking(response?.bookingId);
            } else {
                setErrorBooking(true);
            }
        } catch (error) {
            setErrorBooking(true);
            console.log(`ERROR when call /booking   ${error.message} -- ${JSON.stringify(error)}`);
        }
        setIsLoadingBooking(false);
    }
    const returnDateBookData = (item) => {
        return moment(item.date, 'DD-MM-YYYY').toDate();
    }
    const calTotalPayment = async () => {
        try {
            setIsLoadingTotalPayment(true);

            if (_.isEmpty(bookDateData)) {
                setTotalPayment(0)
                setIsLoadingTotalPayment(false);
                return;
            }
            let bookingList = _.sortBy(bookDateData, returnDateBookData)
            bookingList = _.map(bookingList, (item) => {
                const result = {
                    date: item.date,
                }
                let bookingSlots = _.sortBy(item.bookingSlots, ['order']);
                const slots = _.map(bookingSlots, (slot) => {
                    return slot.order - 1;
                })
                result.slots = slots;
                return result;
            })

            const data = {
                roomId: homeStay.id,
                totalCustomer: numPeople,
                bookingList,
                isCalAmountOnly: true
            }

            let response = await axios.post(`${process.env.REACT_APP_URL_BACKEND || 'https://luca-home.vercel.app'}/booking/v2`, data);
            response = response?.data
            if (response?.code === 1000) {
                setTotalPayment(response?.data?.total)
            }
        } catch (error) {
            setTotalPayment(0)
        }
        setIsLoadingTotalPayment(false);
    }

    const queryBooking = async (bookingId) => {
        try {
            let response = await axios.post(`${process.env.REACT_APP_URL_BACKEND || 'https://luca-home.vercel.app'}/booking/query`, { bookingId });
            response = response?.data
            if (response?.code === 1000) {
                response = response?.data
                if (response?.status === 'PAID') {
                    setQueryBookingSuccess(true);
                    // getTimeAvailable(homeStay?.id, checkInTime);
                    return true;
                }
            }
        } catch (error) {
            console.log(`ERROR when call /query/booking  ${error.message} -- ${JSON.stringify(error)}`);
        }
        return false;
    }

    const intervalQueryBooking = async (bookingId) => {
        try {
            const id = setInterval(async () => {
                const result = await queryBooking(bookingId);
                if (result === true) {
                    clearInterval(id);
                    setIntervalQueryId(null);
                }
            }, 10000);
            setIntervalQueryId(id);
        } catch (error) {
            console.log(`ERROR when  call interval  ${error.message} -- ${JSON.stringify(error)}`);
        }
    }

    const checkValidCustomerInfo = (customerInfo) => {
        const { name, phone, email, cccd } = customerInfo;
        let isValid = true;
        if (_.isEmpty(_.trim(name))) {
            setErrorCustomerInfo((prevErrors) => ({ ...prevErrors, name: 'Vui lòng nhập tên' }));
            isValid = false;
        }

        const phoneRegex = /^(0[2-9]|84[2-9]|\+84[2-9])\d{8,9}$/;
        if (_.isEmpty(_.trim(phone))) {
            setErrorCustomerInfo((prevErrors) => ({ ...prevErrors, phone: 'Vui lòng nhập thông tin số điện thoại' }))
            isValid = false;
        };
        if (!phoneRegex.test(phone)) {
            setErrorCustomerInfo((prevErrors) => ({ ...prevErrors, phone: 'Số điện thoại không đúng định dạng' }))
            isValid = false;
        };

        const emailRegex = /^[a-zA-Z0-9._-]+@(gmail\.com|icloud\.com)$/;
        if (_.isEmpty(_.trim(email))) {
            setErrorCustomerInfo((prevErrors) => ({ ...prevErrors, email: 'Vui lòng nhập thông tin email' }))
            isValid = false;
        };
        if (!emailRegex.test(email)) {
            setErrorCustomerInfo((prevErrors) => ({ ...prevErrors, email: 'Email không đúng định dạng. (Định dạng đúng: ...@gmail.com hoặc ...@icloud.com)' }))
            isValid = false;
        };

        // if (checkShowInputCCCD(bookDateData) && _.isEmpty(_.trim(cccd))) {
        //     setErrorCustomerInfo((prevErrors) => ({ ...prevErrors, cccd: 'Vui lòng nhập thông tin cccd' }))
        //     isValid = false;
        // }

        return isValid;
    }

    const [errorImageInfo, setErrorImageInfo] = useState('');
    const checkValidImagesCCCD = () => {
        let isValid = true;
        if (imagesCCCD.length !== 2) {
            isValid = false;
            setErrorImageInfo('Thiếu thông tin hình CCCD');
        }

        return isValid;
    }

    const actionSubmitForm = (e) => {
        e.preventDefault();

        if (_.isEmpty(bookDateData)) {
            const section = document.getElementById('table-list-available');

            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }

            return;
        }

        const isValidCustomerInfo = checkValidCustomerInfo(customerInfo);

        if (!isValidCustomerInfo) return;

        if (!checkValidImagesCCCD()) return;

        // const isValidCheckBookData = checkBookDateDate();
        // if (!isValidCheckBookData) {
        //     setShowModalErrorBookData(true);
        //     setShow(false);
        //     return;
        // };

        setShowModalErrorBookData(false);
        setShow(true);
        bookHomeStay()
    }


    const location = useLocation();
    const receivedData = location.state ? location.state.data : null;
    // setHomeStay(receivedData?.data || {});

    useEffect(() => {
        window.scrollTo(0, 0);
        setHomeStay(receivedData?.homeStay || {});

        setBookDateData(receivedData?.bookingTIme || [])

        checkShowInputCCCD(receivedData?.bookingTIme || {});


        return () => {
            if (intervalQueryId) {
                clearInterval(intervalQueryId);
            }
        };
    }, []);

    return (
        <Fragment>
            <Menu />
            <div className="breadcrumb-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb-text">
                                <h2 style={{ fontFamily: 'Gilroy-Regular', fontWeight: 'bold', color: '#feebd6' }}>Chi tiết HomeStay</h2>
                                {/* <!-- <div className="bt-option">
                                    <a href="./home.html">Home</a>
                                    <span>Rooms</span>
                                </div> --> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="room-details-section spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="room-details-item">
                                <Carousel className="centered-carousel" interval={1000} fade>
                                    {_.map(homeStay?.images || [], (item, index) => {
                                        return <Carousel.Item key={index}>
                                            <img className='d-block w-100' src={item} key={index} alt="" />
                                        </Carousel.Item>
                                    })}
                                </Carousel>

                                <div className="rd-text" style={{ marginTop: '20px' }}>
                                    <div className="rd-title">
                                        <h3 style={{ fontFamily: 'Gilroy-Regular', color: '#fcead6' }}>{homeStay?.name}</h3>
                                        {/* <div className="rdt-right">
                                            <div className="rating">
                                                <i className="icon_star"></i>
                                                <i className="icon_star"></i>
                                                <i className="icon_star"></i>
                                                <i className="icon_star"></i>
                                                <i className="icon_star-half_alt"></i>
                                            </div>
                                        </div> */}
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#feebd6',
                                        fontWeight: '400',
                                        marginBottom: '10px'
                                    }}>Bảng giá:</div>
                                    <h2>{numeral(homeStay?.priceList?.threeHours || 0).format('0,0')} vnđ<span style={{ color: '#feebd6' }}> / 3h</span></h2>
                                    <h2>{numeral(homeStay?.priceList?.overNight || 0).format('0,0')} vnđ<span style={{ color: '#feebd6' }}> / Qua đêm</span></h2>
                                    <table>
                                        <tbody>
                                            {/* <tr>
                                                <td className="r-o">Diện tích:</td>
                                                <td>42 m2</td>
                                            </tr> */}
                                            {/* <tr>
                                                <td className="r-o">Số người:</td>
                                                <td>Không giới hạn</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Phòng:</td>
                                                <td>2 phòng</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Dịch vụ:</td>
                                                <td>{homeStay?.services}</td>
                                            </tr> */}
                                        </tbody>
                                    </table>
                                    <p style={{ color: '#feebd6' }}>
                                        Vì là hệ thống homestay self-checkin, nên bạn lưu ý phải điền đúng SĐT và Email khi thực hiện đặt phòng. Để hệ thống ghi nhận và gửi những thông tin nhận phòng cho bạn nhé!
                                    </p>
                                    <p style={{ color: '#feebd6' }}>Nếu có vấn đề gì thắc mắc trong quá trình đặt phòng. Bạn có thể liên hệ qua SĐT/ZALO: 0342742205</p>

                                    {/* <p className="f-para">{homeStay?.description}</p> */}
                                </div>
                            </div>
                            <div className="rd-date-available" id="table-list-available">
                                {homeStay?.id && <InfiniteScrollTable data={{ roomId: homeStay?.id, bookingTimeSlots: homeStay?.bookingTimeSlots, bookDateData: bookDateData }} chooseDate={dataChooseDate} />}
                            </div>
                            <div style={{ backgroundColor: 'white', minHeight: '50px', padding: '5px' }}>
                                <div style={{ display: 'flex', marginTop: '15px', fontSize: '12px' }}>
                                    <div style={{ margin: '0 10px 0 0', display: 'flex', alignItems: 'center' }}>
                                        <div style={{ backgroundColor: '#e08594', width: '60px', height: '20px', margin: '0 4px 0 0', display: 'flex' }}></div> <span>Đã đặt</span>
                                    </div>
                                    <div style={{ margin: '0 10px 0 0', display: 'flex', alignItems: 'center' }}>
                                        <div style={{ backgroundColor: '#white', width: '60px', height: '20px', margin: '0 4px 0 0', border: '2px solid #e08594' }}></div> <span>Còn trống</span>
                                    </div>
                                    <div style={{ margin: '0 10px 0 0', display: 'flex', alignItems: 'center' }}>
                                        <div style={{ backgroundColor: '#ebafb0', width: '60px', height: '20px', margin: '0 4px 0 0' }}></div> <span>Đang chọn</span>
                                    </div>
                                </div>
                            </div>
                            <div className='calculate-payment' style={{ marginTop: '30px', fontSize: '19px', display: 'flex', alignItems: 'center' }}>
                                <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', fontFamily: 'Cabin' }}>
                                    <span style={{ margin: '0 8px 0 0', color: '#fcead6', fontWeight: '400' }}>Tổng tiền tạm tính:</span>
                                    {isLoadingTotalPayment ? (<Spinner animation="grow" role="status" variant="secondary" size='sm'></Spinner>) : (<b style={{ margin: '0 8px 0 0', color: '#fcead6', fontWeight: 'bold' }}>{numeral(totalPayment).format('0,0')} đ</b>)}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="room-booking">
                                <h3 style={{ fontFamily: 'Gilroy-Regular', fontWeight: 'bold', color: '#feebd6' }}>Thông tin đặt phòng</h3>
                                <Form onSubmit={actionSubmitForm} >
                                    <Row className="mb-3">
                                        {/* <div className='select-option' style={{ marginBottom: '0px', width: '100%' }}>
                                            <p>Thời gian: Từ 12:00 12/12/2023 đến 12:00 12/12/2023 </p> 
                                        </div> */}
                                        {!_.isEmpty(homeStay?.branchName) ? (<div className='select-option' style={{ width: '100%' }}>
                                            <Form.Group as={Col} >
                                                <Form.Label style={{ fontWeight: 'bold', color: '#feebd6' }}>Chi nhánh: </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="branchName"
                                                    value={homeStay?.branchName}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </div>) : (<Fragment></Fragment>)}


                                        <div className='select-option' style={{ marginBottom: '0px', width: '100%' }}>
                                            <Form.Group as={Col} >
                                                <NumberOfPeopleInput change={changeNumPeople} />
                                                <p style={{ fontSize: '12px', color: '#fffaf5', marginTop: '-5px', marginBottom: '10px', fontStyle: 'italic' }}> * Nếu {'>'} 2 khách, Home xin phép phụ thu 50k/khách ạ!.</p>
                                            </Form.Group>
                                        </div>

                                        <div className='select-option' style={{ width: '100%' }}>
                                            <Form.Group as={Col} >
                                                <Form.Label style={{ fontWeight: 'bold', color: '#feebd6' }}>Tên: </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên..."
                                                    name="name"
                                                    value={customerInfo.name}
                                                    onChange={handleChangeCustomerInfo}
                                                    isInvalid={!!errorsCustomerInfo.name}
                                                />
                                                <Form.Control.Feedback type="invalid">{errorsCustomerInfo.name}</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className='select-option' style={{ width: '100%' }}>
                                            <Form.Group as={Col} >
                                                <Form.Label style={{ fontWeight: 'bold', color: '#feebd6' }}>Số điện thoại</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    placeholder="Nhập số điện thoại..."
                                                    name="phone"
                                                    value={customerInfo.phone}
                                                    onChange={handleChangeCustomerInfo}
                                                    isInvalid={!!errorsCustomerInfo.phone}
                                                />
                                                <Form.Control.Feedback type="invalid">{errorsCustomerInfo.phone}</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className='select-option' style={{ width: '100%' }}>
                                            <Form.Group as={Col} >
                                                <Form.Label style={{ fontWeight: 'bold', color: '#feebd6' }}>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Nhập email..."
                                                    name="email"
                                                    value={customerInfo.email}
                                                    onChange={handleChangeCustomerInfo}
                                                    isInvalid={!!errorsCustomerInfo.email}
                                                />
                                                <Form.Control.Feedback type="invalid">{errorsCustomerInfo.email}</Form.Control.Feedback>
                                                <p style={{ fontSize: '12px', color: '#fffaf5', marginTop: '15px', marginBottom: '0px', fontStyle: 'italic' }}> * Home khuyến khích sử dụng gmail và nhập đúng địa chỉ email để thông tin gửi đến bạn chính xác hơn ạ!.</p>
                                            </Form.Group>
                                        </div>

                                        <div className='select-option' style={{ width: '100%', marginTop: '5px' }}>
                                            <Form.Group as={Col} >
                                                <Form.Label style={{ fontWeight: 'bold', color: '#feebd6' }}> <span style={{ color: '#fffaf5' }}>*</span> Hình CCCD/CMND (mặt trước/sau)</Form.Label>
                                                <Row>
                                                    {_.map(imagesCCCD, (image, index) => (

                                                        <Col xs={6} sm={6} md={6}>
                                                            <InputGroup key={index} className="mb-3" style={{ height: '100px' }}>
                                                                <FormControl
                                                                    type="file"
                                                                    accept="image/*"
                                                                    style={{ display: 'none' }}
                                                                    onChange={(e) => handleFileChange(index, e)}
                                                                />
                                                                <label
                                                                    htmlFor={`file-input-${index}`}
                                                                    style={{
                                                                        position: 'relative',
                                                                        cursor: 'pointer',
                                                                        height: '100px',
                                                                        border: '1px solid #ced4da',
                                                                    }}
                                                                >
                                                                    <Image
                                                                        src={image ? URL.createObjectURL(image) : ''}
                                                                        alt={`Ảnh ${index + 1}`}
                                                                        fluid
                                                                        style={{ cursor: 'pointer', width: '100%', height: '100%' }}
                                                                    />
                                                                    <span
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: '50%',
                                                                            left: '50%',
                                                                            transform: 'translate(-50%, -50%)',
                                                                            cursor: 'pointer',
                                                                            zIndex: 2,
                                                                        }}
                                                                    >

                                                                    </span>
                                                                    <span style={{ zIndex: 1 }}>
                                                                        <FormControl
                                                                            type="file"
                                                                            accept="image/*"
                                                                            id={`file-input-${index}`}
                                                                            onChange={(e) => handleFileChange(index, e)}
                                                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0 }}
                                                                        />
                                                                    </span>
                                                                </label>
                                                                {/* <InputGroup.Text onClick={() => handleRemoveImage(index)} style={{ cursor: 'pointer' }}>
                                                                    &#10006;
                                                                </InputGroup.Text> */}
                                                            </InputGroup>
                                                        </Col>

                                                    ))}

                                                    {/* {_.map(imagesCCCD, (image, index) => ())} */}
                                                    {imagesCCCD.length === 0 ? (
                                                        <>
                                                            <Col xs={6} sm={6} md={6}>
                                                                <InputGroup className="mb-3" style={{ width: '100%', height: '100px' }}>
                                                                    <FormControl
                                                                        type="file"
                                                                        accept="image/*"
                                                                        style={{ display: 'none' }}
                                                                        onChange={(e) => handleFileChange(imagesCCCD.length, e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={`file-input-${imagesCCCD.length}`}
                                                                        style={{
                                                                            position: 'relative',
                                                                            cursor: 'pointer',
                                                                            width: '100%',
                                                                            height: '100px',
                                                                            border: '1px solid #ced4da',
                                                                        }}
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                position: 'absolute',
                                                                                top: '50%',
                                                                                left: '50%',
                                                                                transform: 'translate(-50%, -50%)',
                                                                                cursor: 'pointer',
                                                                                color: '#feebd6'
                                                                            }}
                                                                        >
                                                                            Mặt trước
                                                                        </span>
                                                                        <span style={{ zIndex: 1 }}>
                                                                            <FormControl
                                                                                type="file"
                                                                                accept="image/*"
                                                                                id={`file-input-${imagesCCCD.length}`}
                                                                                onChange={(e) => handleFileChange(imagesCCCD.length, e)}
                                                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0 }}
                                                                            />
                                                                        </span>
                                                                    </label>
                                                                </InputGroup>
                                                            </Col>
                                                            <Col xs={6} sm={6} md={6}>
                                                                <InputGroup className="mb-3" style={{ width: '100%', height: '100px' }}>
                                                                    <FormControl
                                                                        type="file"
                                                                        accept="image/*"
                                                                        style={{ display: 'none' }}
                                                                        onChange={(e) => handleFileChange(imagesCCCD.length, e)}
                                                                    />
                                                                    <label
                                                                        htmlFor={`file-input-${imagesCCCD.length}`}
                                                                        style={{
                                                                            position: 'relative',
                                                                            cursor: 'pointer',
                                                                            width: '100%',
                                                                            height: '100px',
                                                                            border: '1px solid #ced4da',
                                                                        }}
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                position: 'absolute',
                                                                                top: '50%',
                                                                                left: '50%',
                                                                                transform: 'translate(-50%, -50%)',
                                                                                cursor: 'pointer',
                                                                                color: '#feebd6'
                                                                            }}
                                                                        >
                                                                            Mặt sau
                                                                        </span>
                                                                        <span style={{ zIndex: 1 }}>
                                                                            <FormControl
                                                                                type="file"
                                                                                accept="image/*"
                                                                                id={`file-input-${imagesCCCD.length}`}
                                                                                onChange={(e) => handleFileChange(imagesCCCD.length, e)}
                                                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0 }}
                                                                            />
                                                                        </span>
                                                                    </label>
                                                                </InputGroup>
                                                            </Col>
                                                        </>
                                                    ) : imagesCCCD.length === 1 ? (<Col xs={6} sm={6} md={6}>
                                                        <InputGroup className="mb-3" style={{ width: '100%', height: '100px' }}>
                                                            <FormControl
                                                                type="file"
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                                onChange={(e) => handleFileChange(imagesCCCD.length, e)}
                                                            />
                                                            <label
                                                                htmlFor={`file-input-${imagesCCCD.length}`}
                                                                style={{
                                                                    position: 'relative',
                                                                    cursor: 'pointer',
                                                                    width: '100%',
                                                                    height: '100px',
                                                                    border: '1px solid #ced4da',
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '50%',
                                                                        left: '50%',
                                                                        transform: 'translate(-50%, -50%)',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    Mặt sau
                                                                </span>
                                                                <span style={{ zIndex: 1 }}>
                                                                    <FormControl
                                                                        type="file"
                                                                        accept="image/*"
                                                                        id={`file-input-${imagesCCCD.length}`}
                                                                        onChange={(e) => handleFileChange(imagesCCCD.length, e)}
                                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0 }}
                                                                    />
                                                                </span>
                                                            </label>
                                                        </InputGroup>
                                                    </Col>) : (<></>)}
                                                </Row>
                                                {!_.isEmpty(errorImageInfo) && (<p style={{ fontSize: '14px', color: 'red', margin: '0px', marginTop: '-10px' }}> {errorImageInfo}</p>)}
                                                <p style={{ fontSize: '12px', color: '#fffaf5', marginTop: '15px', marginBottom: '5px', fontStyle: 'italic' }}> * Thông tin cá nhân của bạn được lưu trữ bởi AI và bảo mật riêng tư ngay cả với Home. Bạn vui lòng chọn đúng ảnh CCCD của người đặt phòng và chịu trách nhiệm với thông tin trên.</p>
                                            </Form.Group>
                                        </div>

                                        <div className='select-option' style={{ width: '100%' }}>
                                            <Form.Group as={Col} >
                                                <Form.Label style={{ fontWeight: 'bold', color: '#feebd6' }}>Ghi chú</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    row={5}
                                                    placeholder="Ghi chú cho Home ..."
                                                    name="note"
                                                    value={customerInfo.note}
                                                    onChange={handleChangeCustomerInfo}
                                                    isInvalid={!!errorsCustomerInfo.note}
                                                />
                                                <Form.Control.Feedback type="invalid">{errorsCustomerInfo.note}</Form.Control.Feedback>
                                                <p style={{ fontSize: '12px', color: '#fffaf5', marginTop: '15px', marginBottom: '5px', fontStyle: 'italic' }}> Khi bấm đặt Homestay đồng nghĩa với việc bạn đã đọc và đồng ý với các <a href={homeStay?.rule} target="_blank" style={{ fontSize: '12px', color: '#fffaf5' }} rel="noreferrer"><span style={{ textDecoration: 'underline' }}>Nội quy</span></a> & <a href="https://drive.google.com/file/d/1KMJmCaVGIze8xGwHrYS-WLLjGqwiHNOr/view?usp=sharing" target="_blank" style={{ fontSize: '12px', color: '#fffaf5' }} rel="noreferrer"><span style={{ textDecoration: 'underline' }}>Chính sách</span></a> của Luca</p>
                                            </Form.Group>
                                        </div>
                                    </Row>

                                    {_.isEmpty(bookDateData) ? (<Button id="form-submit" type="submit">Đặt Phòng</Button>) : (<Button id="form-submit" type="submit">
                                        Đặt HomeStay
                                    </Button>)}

                                </Form>

                                {/* <ImageUploadForm /> */}

                                <Modal
                                    show={show}
                                    onHide={handleClose}
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                    size="lg"
                                // backdrop="static"
                                // keyboard={false}
                                >
                                    <Modal.Header>
                                        <Modal.Title>Thông tin đặt HomeStay</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {isLoadingBooking ? (<div className="text-center">
                                            <Spinner animation="border" role="status" variant="primary">
                                                <span className="sr-only">Loading...</span>
                                            </Spinner>
                                            <p className="mt-3" style={{ padding: '10px', fontSize: '16px' }}>Đang tải dữ liệu...</p>
                                        </div>
                                        ) : isErrorBooking ? (<div className="failure-message" style={{ color: '#ff0000', fontSize: '16px', textAlign: 'center' }}>
                                            Đặt HomeStay thất bại, vui lòng thử lại sau.
                                        </div>) : queryBookingSuccess === true ? (<PaymentSuccess customnerInfo={customerInfo} />) : (< Row >
                                            <Col lg={6}>
                                                <ListGroup style={{ fontFamily: 'Cabin' }}>
                                                    <ListGroup.Item>
                                                        <strong>Tên khách hàng:</strong> {customerInfo.name}
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <strong>Số điện thoại:</strong> {customerInfo.phone}
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <strong>Email:</strong> {customerInfo.email}
                                                    </ListGroup.Item>
                                                    {_.isEmpty(homeStay?.branchName) ? (<Fragment></Fragment>) : (<ListGroup.Item>
                                                        <strong>Chi nhánh:</strong> {homeStay.branchName}
                                                    </ListGroup.Item>)}

                                                    <ListGroup.Item>
                                                        <strong>Tên phòng:</strong> {homeStay.name}
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <strong>Thời gian nhận:</strong> {bookingResult?.from}
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <strong>Thời gian trả:</strong> {bookingResult?.to}
                                                    </ListGroup.Item>
                                                    <ListGroup.Item>
                                                        <strong>Số tiền:</strong> {numeral(bookingResult?.amount).format('0,0')} vnđ
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            </Col>
                                            <Col className="border-left">
                                                <div className="text-center" style={{ fontFamily: 'Cabin' }}>
                                                    {/* <QRCode value={bookingResult?.qrContent} size={200} style={{ paddingTop: '10px' }} /> */}
                                                    <img src={bookingResult?.qrContent}  style={{ paddingTop: '10px' }} />
                                                    <CountdownTimer initialTime={timeCountDownQrCode} onClosePopup={timeoutQrCode} />
                                                    <p style={{ fontSize: '12px', color: 'red', marginBottom: '10px', marginTop: '-10px' }}> * LƯU Ý: Mã thanh toán chỉ có hiệu lực trong 10 PHÚT.</p>

                                                    {/* <ListGroup className="mt-2 text-center" style={{ fontSize: '13px' }}>
                                                        <ListGroup.Item className='none-border'>
                                                            Nội dung chuyển khoản:
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className='none-border' style={{ textAlign: 'right' }}>
                                                            <strong style={{ marginRight: '50px' }}>{bookingResult?.bankInfo?.number}</strong> <CopyButton textToCopy={bookingResult?.bankInfo?.number} />
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className='none-border'>
                                                            <strong>{bookingResult?.bankInfo?.fullName}</strong>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className='none-border'>
                                                            <strong>{bookingResult?.bankInfo?.bankName}</strong>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className='none-border' style={{ textAlign: 'right' }}>
                                                            <span style={{ fontSize: '13px', paddingRight: '10px' }}>Nội dung bắt buộc:</span> {bookingResult?.bankInfo?.content} <CopyButton textToCopy={bookingResult?.bankInfo?.content} />
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className='none-border'>
                                                            <span style={{ fontSize: '13px', paddingRight: '10px' }}>Số tiền:</span> {numeral(bookingResult?.amount).format('0,0')} vnđ
                                                        </ListGroup.Item>
                                                    </ListGroup> */}
                                                    <span style={{ fontSize: '12px', color: 'red' }}> * Mã QR chỉ cung cấp cho thanh toán lần này, vui lòng không sao lưu sử dụng cho những lần thanh toán sau.</span>
                                                </div>
                                            </Col>
                                        </Row>)}
                                    </Modal.Body>
                                </Modal>

                                {/* <Modal
                                    show={showResultBooking}
                                    onHide={handleCloseModalError}
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                    size="lg"
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Lỗi chọn khung giờ</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="failure-message" style={{ color: '#ff0000', fontSize: '16px', textAlign: 'center' }}>
                                            {errorBookDateData.message}
                                        </div>
                                    </Modal.Body>
                                </Modal> */}

                                <Modal
                                    show={showModalErrorBookData}
                                    onHide={handleCloseModalError}
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                    size="lg"
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Lỗi chọn khung giờ</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="failure-message" style={{ color: '#ff0000', fontSize: '16px', textAlign: 'center' }}>
                                            {errorBookDateData.message}
                                        </div>
                                    </Modal.Body>
                                </Modal>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* <!-- Footer Section Begin --> */}
            <Footer />
            {/* <!-- Footer Section End --> */}
        </Fragment >
    )
}

export default HomeStayDetail;