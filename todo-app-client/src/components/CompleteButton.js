import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import './CompleteButton.css';

export default ({
    status,
    isComplete,
    className="",
}) =>
    <Button 
        className={`CompleteButton${className}`}
    >
        {isComplete 
        ? <Glyphicon glyph="check" className="complete" />
        : <Glyphicon glyph="tag" className="incomplete" />
        }    
    </Button>;
