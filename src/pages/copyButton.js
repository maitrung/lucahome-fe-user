import React from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ClipboardJS from 'clipboard-js';

const CopyButton = ({ textToCopy }) => {
    const handleCopy = () => {
        ClipboardJS.copy(textToCopy);
        // alert(`Text copied: ${textToCopy}`);
    };

    return (
        <Button variant="success" onClick={handleCopy} style={{ fontSize: '10px', padding: '2px' }}>
            Sao chép
        </Button>
    );
};

export default CopyButton;
