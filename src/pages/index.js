import React, { Fragment, useEffect, useState } from 'react';
import Menu from './menu';
import axios from 'axios';
import _ from 'lodash';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './footer';
import CarouselExample from './slide'
import { Col, Row, Spinner, Carousel, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AvailableAllRoom from './availableAllRoom';
import HomeStaySlide from './homeStaySlide';


function Index() {
    const navigate = useNavigate();

    const [homestay, setHomeStay] = useState([]);
    const [bookingTimeData, setBookingTimeData] = useState({});
    const [bookingHomeStay, setBookingHomeStay] = useState({});
    const [siteInfo, setSiteInfo] = useState({});
    const [errorAPI, setErrorAPI] = useState([]);

    const [showConfirmButton, setShowConfirmButton] = useState(false);

    const chooseBookingTime = (data) => {
        setBookingTimeData(data);
        if (_.isEmpty(data)) {
            setShowConfirmButton(false)
            setBookingHomeStay({})
        } else {
            setShowConfirmButton(true)

            if (bookingHomeStay.id !== data?.[0]?.roomId) {
                const chooseHomeStay = _.find(homestay, { id: data?.[0]?.roomId });
                setBookingHomeStay(chooseHomeStay)
            }
        }
    }

    const navigateToDetail = () => {
        try {
            navigate('/detail', { state: { data: { homeStay: bookingHomeStay, bookingTIme: bookingTimeData } } });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        const fetchHomeStay = async () => {
            try {
                let homestayResult = await axios.post(`${process.env.REACT_APP_URL_BACKEND || 'https://luca-home.vercel.app'}/room/search`, {}, { timeout: 60000 });
                homestayResult = homestayResult?.data;
                if (homestayResult?.code === 1000) {
                    setHomeStay(homestayResult?.data?.rooms);
                }
            } catch (error) {
                console.log(`ERROR when call get list homestay ${error.message} -- ${JSON.stringify(error)}`);
                const errorSearch = [{ api: '/room/search (2)', error: error.message, data: JSON.stringify(error) }];
                setErrorAPI(errorSearch);
            }
        }

        const fetchInfo = async () => {
            try {
                let info = await axios.post(`${process.env.REACT_APP_URL_BACKEND || 'https://luca-home.vercel.app'}/siteInfo`);
                info = info?.data;
                if (info?.code === 1000) {
                    setSiteInfo({
                        facebook: info?.data?.facebook,
                        tiktok: info?.data?.tiktok,
                        phoneNumber: info?.data?.phoneNumber,
                        zalo: info?.data?.zalo,
                        images: info?.data?.images
                    });
                }
            } catch (error) {
                console.log(`ERROR when call get list homestay ${error.message} -- ${JSON.stringify(error)}`);
                setSiteInfo({
                    facebook: 'Link facebook',
                    tiktok: 'Link tiktok',
                    phoneNumber: 'Số điện thoại',
                    zalo: 'Số zalo',
                    images: []
                });
            }
        }

        if (_.isEmpty(homestay)) {
            fetchHomeStay();
        }
        if (_.isEmpty(siteInfo)) {
            fetchInfo();
        }
    }, []);

    return (
        <Fragment>
            <Menu siteInfo={siteInfo} />
            {/* Hero Section Begin */}
            <section className="hero-section">
                <Carousel className="centered-carousel banner-mobile" interval={3000} fade>
                    {_.map(siteInfo.images, (item, index) => {
                        return <Carousel.Item key={index} >
                            <Card className="center-card" style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                <img className='d-block w-100' src={item} alt="" />

                            </Card>
                        </Carousel.Item>
                    })}
                </Carousel>
                {/* <div className="hero-slider owl-carousel">
                    <div className="hs-item set_bg" style={{ backgroundImage: "url('assets/img/hero/hero-1.jpg')" }}></div>
                    <div className="hs-item set_bg" style={{ backgroundImage: "url('assets/img/hero/hero-2.jpg')" }}></div>
                    <div className="hs-item set_bg" style={{ backgroundImage: "url('assets/img/hero/hero-3.jpg')" }}></div>
                </div> */}
            </section>
            {/* <!-- Hero Section End --> */}

            {/* <!-- Home Room Section Begin --> */}
            <section className="hp-room-section" style={{ paddingTop: '0px' }} >
                <div className="container-fluid">
                    <div className="hp-room-items">
                        <div className="row">
                            <h1 style={{ fontFamily: 'Gilroy-Regular', textAlign: 'center', fontWeight: 'bold', color: '#feebd6' }}>Danh sách phòng</h1>
                            {/* <HomeStaySlide /> */}
                            {!_.isEmpty(homestay) ? <HomeStaySlide data={homestay} /> : (<Spinner animation="border" variant="primary" />)}
                            {!_.isEmpty(errorAPI) ? <p>{JSON.stringify(errorAPI)}</p> : (<p></p>)}


                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- Home Room Section End --> */}

            <section className="hp-room-section" style={{ paddingTop: '0px', marginBottom: '50px' }}>
                <div className="">
                    <Row style={{ marginBottom: '20px' }}>
                        <Col xs={{ span: 7, offset: 3 }} md={{ span: 7, offset: 3 }} sm={{ span: 7, offset: 3 }}>
                            <h1 style={{ fontFamily: 'Gilroy-Regular', textAlign: 'center', fontWeight: 'bold', color: '#feebd6' }}>Lịch đặt phòng</h1>
                        </Col>
                        <Col xs={3} md={3} sm={3} className='d-flex justify-content-end' >
                            {/* <button disabled={!showConfirmButton} className={`confirm-time-booking ${showConfirmButton ? '' : 'disabled-btn'}`} onClick={() => navigateToDetail()} style={{ minWidth: '100px', marginTop: '5px' }} > Xác nhận</button> */}
                        </Col>
                    </Row>
                    {!_.isEmpty(homestay) ? <AvailableAllRoom data={{ homestay }} onChooseTime={chooseBookingTime} /> : (<Spinner animation="border" variant="primary" />)}
                    <Row style={{ backgroundColor: 'white', padding: '5px' }}>
                        <Col xs={6} md={4} className='d-flex' style={{ marginTop: '10px' }}>
                            <div style={{ display: 'flex', fontSize: '12px' }}>
                                <div style={{ margin: '0 10px 0 0', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ backgroundColor: '#e08594', width: '48px', height: '20px', margin: '0 4px 0 0', display: 'flex' }}></div> <span>Đã đặt</span>
                                </div>
                                <div style={{ margin: '0 10px 0 0', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ backgroundColor: '#white', width: '48px', height: '20px', margin: '0 4px 0 0', border: '2px solid #e08594' }}></div> <span>Còn trống</span>
                                </div>
                                <div style={{ margin: '0 10px 0 0', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ backgroundColor: '#ebafb0 ', width: '48px', height: '20px', margin: '0 4px 0 0' }}></div> <span>Đang chọn</span>
                                </div>
                            </div>
                        </Col>
                        <Col xs={6} md={{ span: 4, offset: 4 }} className='d-flex justify-content-end' >
                            <button disabled={!showConfirmButton} className={`confirm-time-booking ${showConfirmButton ? 'invalid-btn' : 'disabled-btn'}`} onClick={() => navigateToDetail()} style={{ minWidth: '100px', marginTop: '15px' }} > Xác nhận</button>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* <!-- Testimonial Section Begin --> */}
            {/* <section className="testimonial-section spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title">
                                <span>Đánh giá</span>
                                <h2>Nhận xét của khách hàng</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <div className="testimonial-slider owl-carousel">

                                {_.map(RandomReview, (item, index) => {
                                    return (
                                        <div className="ts-item" key={index}>
                                            <p>{item.review}</p>
                                            <div className="ti-author">
                                                <div className="rating">
                                                    <i className="icon_star"></i>
                                                    <i className="icon_star"></i>
                                                    <i className="icon_star"></i>
                                                    <i className="icon_star"></i>
                                                    <i className="icon_star"></i>
                                                </div>
                                                <h5> - {item.customerName}</h5>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
            {/* <!-- Testimonial Section End --> */}

            <Footer siteInfo={siteInfo} />
        </Fragment >
    )
}

export default Index;