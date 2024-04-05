import React, { useState } from 'react';
import { Button, InputGroup, FormControl, Form } from 'react-bootstrap';

const NumberOfPeopleInput = ({ change }) => {
    const [count, setCount] = useState(2);
    const [isIncreaseClicked, setIsIncreaseClicked] = useState(false);
    const [isDecreaseClicked, setIsDecreaseClicked] = useState(false);

    const handleIncrease = (e) => {
        e.preventDefault();
        const newCount = count + 1;
        setCount(newCount);
        setIsIncreaseClicked(true);
        setIsDecreaseClicked(false);
        setTimeout(() => setIsIncreaseClicked(false), 200);
        change(newCount);
    };

    const handleDecrease = (e) => {
        e.preventDefault();

        if (count > 1) {
            const newCount = count - 1;
            setCount(newCount);
            setIsDecreaseClicked(true);
            setIsIncreaseClicked(false);
            setTimeout(() => setIsDecreaseClicked(false), 200);
            change(newCount);

        }
    };

    return (
        <div className="counter-input-container" style={{ paddingBottom: '15px' }}>
            <Form.Group controlId="counterInput">
                <Form.Label style={{ color: '#707079', fontSize: '14px', fontWeight: 'bold' }}>Số người: </Form.Label>
                <div className="input-group" style={{ border: '1px solid hsl(0, 0%, 80%)', borderRadius: '4px' }}>
                    <button
                        onClick={handleDecrease}
                        className={`border-0 bold-text-button ${isDecreaseClicked ? 'bold-button' : ''}`}
                        style={{ backgroundColor: 'transparent', color: 'black', width: '50px' }}
                    >
                        -
                    </button>
                    <Form.Control
                        style={{ backgroundColor: 'transparent' }}
                        className='text-center border-0'
                        type="text"
                        value={count}
                        readOnly
                    />
                    <button
                        onClick={handleIncrease}
                        className={`border-0 bold-text-button ${isIncreaseClicked ? 'bold-button' : ''}`}
                        style={{ backgroundColor: 'transparent', color: 'black', width: '50px' }}
                    >
                        +
                    </button>
                    {/* <Button
                        variant="outline-primary"

                    >
                        +
                    </Button> */}
                </div>
            </Form.Group>
        </div>
    );
};

export default NumberOfPeopleInput;