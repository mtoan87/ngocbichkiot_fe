'use client';
import React, { useState } from 'react';
import { Steps, Step } from 'intro.js-react';
import 'intro.js/introjs.css';
import { Box } from '@mui/material';

type IntroTourProps = {
    steps: Step[];
    children?: React.ReactNode;
    buttonContent?: React.ReactNode;
};

const IntroTour = ({ steps, children, buttonContent }: IntroTourProps) => {
    const [enabled, setEnabled] = useState(false);

    const handleStartTour = () => {
        setTimeout(() => setEnabled(true), 100);
    };

    return (
        <>
            {buttonContent && (
                <Box onClick={handleStartTour} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {buttonContent}
                </Box>
            )}
            {children}
            <Steps
                enabled={enabled}
                steps={steps}
                initialStep={0}
                onExit={() => setEnabled(false)}
                options={{
                    scrollToElement: false,
                    showBullets: false,
                    exitOnOverlayClick: true,
                    nextLabel: 'Tiếp',
                    prevLabel: 'Trước',
                    doneLabel: 'Hoàn tất',
                }}
            />
        </>
    );
};

export default IntroTour;
