import React from 'react';
import numeral from 'numeral';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel, Card, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const CarouselExample = (props) => {
    const navigate = useNavigate();

    const findHomeStay = async (homeStay) => {
        try {
            navigate('/detail', { state: { data: { homeStay } } });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container>
            <Carousel className="centered-carousel" data-bs-theme="dark" interval={2000} fade>
                {props.data.map((item, index) => {
                    return <Carousel.Item key={index}>
                        <Card className="center-card hp-room-item set_bg" style={{ backgroundImage: `url(${item?.images?.[0]})`, backgroundSize: 'contain', backgroundPosition: 'center' }} onClick={() => findHomeStay(item)}>
                            <Card.Body>
                                {/* <div className="hp-room-item set_bg"> */}
                                {/* <div className="hr-text">
                                    <h2>{item?.name}</h2>
                                    <h2>{numeral(item?.priceList?.overNight || 0).format('0,0')} vnđ<span>/Qua đêm</span></h2>
                                    <span style={{ color: 'white' }}>Chỉ từ</span> <h2>{numeral(item?.priceList?.threeHours || 0).format('0,0')} vnđ<span> / 3h</span></h2>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="r-o">Diện tích:</td>
                                                <td>42 m2</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Giới hạn người:</td>
                                                <td>Không giới hạn</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Phòng:</td>
                                                <td>2 phòng</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Dịch vụ:</td>
                                                <td>{item?.services}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <Link to={'/detail'} state={{ data: { homeStay: item, from: new Date() } }} className="primary-btn">
                                        Đặt phòng ngay !
                                    </Link>
                                </div> */}
                            </Card.Body>
                        </Card>
                    </Carousel.Item>
                })}
            </Carousel>
        </Container>
    );
};

export default CarouselExample;