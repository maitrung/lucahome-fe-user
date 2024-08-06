import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BiStopwatch } from 'react-icons/bi';

const CountdownTimer = ({ initialTime, onClosePopup }) => {
    const [time, setTime] = useState(10 * 60);

    useEffect(() => {
        setTimeout(initialTime);

        const timer = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime === 0) {
                    clearInterval(timer);
                    onClosePopup();
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    return (
        <Container>
            <Row>
                <Col className="text-center" style={{ marginTop: '5px', padding: '0px', display: 'flex', justifyContent: 'center' }}>
                    <BiStopwatch style={{ fontSize: 24, marginBottom: 10, display: 'flex', marginRight: '5px' }} />
                    <p style={{ margin: '0px', padding: '0px', display: 'flex' }}>{formatTime(time)}</p>
                </Col>
            </Row>
        </Container>
    );
};

export default CountdownTimer;