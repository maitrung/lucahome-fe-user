import React, { Fragment, useState, useEffect } from 'react';
import Menu from './menu';
import Footer from './footer';
import axios from 'axios';

function Contact() {
    const [siteInfo, setSiteInfo] = useState({});

    useEffect(() => {

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
        fetchInfo();


    }, [])

    return (
        <Fragment>
            <Menu />

            <section className="contact-section spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-3">
                            <div className="contact-text">
                                <h2>Thông tin liên hệ</h2>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="c-o">Địa chỉ:</td>
                                            <td>Biên Hoà</td>
                                        </tr>
                                        <tr>
                                            <td className="c-o">Điện thoại :</td>
                                            <td>{siteInfo.phoneNumber}</td>
                                        </tr>
                                        <tr>
                                            <td className="c-o">Facebook:</td>
                                            <td><a href={siteInfo.facebook} target="_blank">Luca Home</a></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="map">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.0606825994123!2d-72.8735845851828!3d40.760690042573295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e85b24c9274c91%3A0xf310d41b791bcb71!2sWilliam%20Floyd%20Pkwy%2C%20Mastic%20Beach%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1578582744646!5m2!1sen!2sbd"
                            height="470"
                            // style={border:0;
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            </section>


            <Footer />
        </Fragment>
    )
}

export default Contact;