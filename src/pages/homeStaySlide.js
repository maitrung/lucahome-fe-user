import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import '../slide.css'

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { EffectCoverflow, Pagination, Navigation } from 'swiper';
import { useNavigate } from 'react-router-dom';

const HomeStaySlide = (props) => {
    const navigate = useNavigate();

    const findHomeStay = async (homeStay) => {
        try {
            navigate('/detail', { state: { data: { homeStay } } });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container-slide zoom-slide">
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                }}
                pagination={{ el: '.swiper-pagination', clickable: true }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                    clickable: true,
                }}
                modules={[EffectCoverflow, Pagination, Navigation]}
                className="swiper_container"
            >
                {props.data.map((item, index) => {
                    return <SwiperSlide>
                        <div style={{ padding: '6px', backgroundColor: '#dfa974', borderRadius: '2em' }} onClick={() => findHomeStay(item)}>
                            <img src={item?.images?.[0]} alt="slide_image" />
                        </div>
                    </SwiperSlide>
                })}
                {/* <SwiperSlide>
                    <img src={slide_image_1} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={slide_image_1} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={slide_image_1} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={slide_image_1} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={slide_image_1} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={slide_image_1} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={slide_image_1} alt="slide_image" />
                </SwiperSlide> */}

                {/* <div className="slider-controler"> */}
                {/* <div className="swiper-button-prev slider-arrow">
                        <ion-icon name="arrow-back-outline"></ion-icon>
                    </div>
                    <div className="swiper-button-next slider-arrow">
                        <ion-icon name="arrow-forward-outline"></ion-icon>
                    </div> */}
                {/* <div className="swiper-pagination"></div> */}
                {/* </div> */}
            </Swiper>
        </div>
    );
};

export default HomeStaySlide;