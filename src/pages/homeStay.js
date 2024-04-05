import React, { Fragment, useEffect, useState } from 'react';
import Menu from './menu';
import axios from 'axios';
import numeral from 'numeral';
import { Link } from 'react-router-dom';
import Footer from './footer';

function HomeStay() {
    const [homestay, setHomeStay] = useState([]);

    useEffect(() => {
        const fetchHomeStay = async () => {
            try {
                let homestayResult = await axios.post(`${process.env.REACT_APP_URL_BACKEND || 'https://luca-home.vercel.app'}/room/search`);
                homestayResult = homestayResult?.data;
                if (homestayResult?.code === 1000) {
                    setHomeStay(homestayResult?.data?.rooms);
                }
            } catch (error) {
                console.log(`ERROR when call get list homestay ${error.message} -- ${JSON.stringify(error)}`);
            }
        }
        fetchHomeStay();
    }, []);

    return (
        <Fragment>
            <Menu />

            <div className="breadcrumb-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb-text">
                                <h2>Danh sách Home Stay</h2>
                                <div className="bt-option">
                                    <a href="./home.html">Trang chủ</a>
                                    <span>Home staty</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="rooms-section spad">
                <div className="container">
                    <div className="row">
                        {homestay.map((item, index) => {
                            return <div key={index} className="col-lg-4 col-md-6">
                                <div className="room-item">
                                    <img src={item?.images?.[0]} alt="" />
                                    <div className="ri-text">
                                        <h4>{item?.name}</h4>
                                        <h3>{numeral(item?.priceList?.overNight || 0).format('0,0')} vnđ<span>/Qua đêm</span></h3>
                                        <table>
                                            <tbody>
                                                {/* <tr>
                                                    <td className="r-o">Diện tích::</td>
                                                    <td>42 m2</td>
                                                </tr> */}
                                                {/* <tr>
                                                    <td className="r-o">Giới hạn người::</td>
                                                    <td>Không giới hạn</td>
                                                </tr>
                                                <tr>
                                                    <td className="r-o">Phòng:</td>
                                                    <td>2 phòng</td>
                                                </tr>
                                                <tr>
                                                    <td className="r-o">Dịch vụ:</td>
                                                    <td>{item?.services}</td>
                                                </tr> */}
                                            </tbody>
                                        </table>
                                        <Link to={'/detail'} state={{ data: { homeStay: item, from: new Date() } }} className="primary-btn">
                                            Chi tiết
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        })}

                        {/* <div className="col-lg-4 col-md-6">
                            <div className="room-item">
                                <img src="assets/img/room/room-2.jpg" alt="" />
                                <div className="ri-text">
                                    <h4>Secret Garden</h4>
                                    <h3>350.000 vnđ<span>/Qua đêm</span></h3>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="r-o">Diện tích::</td>
                                                <td>42 m2</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Giới hạn người::</td>
                                                <td>Không giới hạn</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Phòng:</td>
                                                <td>2 phòng</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Dịch vụ:</td>
                                                <td>Wifi, Màn hình rộng, Bồn tắm, Hồ bơi...</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <a href="./room-details.html" className="primary-btn">Chi tiết</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="room-item">
                                <img src="assets/img/room/room-3.jpg" alt="" />
                                <div className="ri-text">
                                    <h4>Secret Garden</h4>
                                    <h3>350.000 vnđ<span>/Qua đêm</span></h3>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="r-o">Diện tích::</td>
                                                <td>42 m2</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Giới hạn người::</td>
                                                <td>Không giới hạn</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Phòng:</td>
                                                <td>2 phòng</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Dịch vụ:</td>
                                                <td>Wifi, Màn hình rộng, Bồn tắm, Hồ bơi...</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <a href="./room-details.html" className="primary-btn">Chi tiết</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="room-item">
                                <img src="assets/img/room/room-4.jpg" alt="" />
                                <div className="ri-text">
                                    <h4>Secret Garden</h4>
                                    <h3>350.000 vnđ<span>/Qua đêm</span></h3>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="r-o">Diện tích::</td>
                                                <td>42 m2</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Giới hạn người::</td>
                                                <td>Không giới hạn</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Phòng:</td>
                                                <td>2 phòng</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Dịch vụ:</td>
                                                <td>Wifi, Màn hình rộng, Bồn tắm, Hồ bơi...</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <a href="./room-details.html" className="primary-btn">Chi tiết</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="room-item">
                                <img src="assets/img/room/room-5.jpg" alt="" />
                                <div className="ri-text">
                                    <h4>Secret Garden</h4>
                                    <h3>350.000 vnđ<span>/Qua đêm</span></h3>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="r-o">Diện tích::</td>
                                                <td>42 m2</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Giới hạn người::</td>
                                                <td>Không giới hạn</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Phòng:</td>
                                                <td>2 phòng</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Dịch vụ:</td>
                                                <td>Wifi, Màn hình rộng, Bồn tắm, Hồ bơi...</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <a href="./room-details.html" className="primary-btn">Chi tiết</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="room-item">
                                <img src="assets/img/room/room-6.jpg" alt="" />
                                <div className="ri-text">
                                    <h4>Secret Garden</h4>
                                    <h3>350.000 vnđ<span>/Qua đêm</span></h3>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="r-o">Diện tích::</td>
                                                <td>42 m2</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Giới hạn người::</td>
                                                <td>Không giới hạn</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Phòng:</td>
                                                <td>2 phòng</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Dịch vụ:</td>
                                                <td>Wifi, Màn hình rộng, Bồn tắm, Hồ bơi...</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <a href="./room-details.html" className="primary-btn">Chi tiết</a>
                                </div>
                            </div>
                        </div> */}
                        <div className="col-lg-12">
                            <div className="room-pagination">
                                <a href="#">1</a>
                                <a href="#">2</a>
                                <a href="#">Next <i className="fa fa-long-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </Fragment >
    )
}

export default HomeStay;