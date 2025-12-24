
import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 10) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        setDisplayText(''); // Reset on new text
        if (text) {
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    setDisplayText(prev => prev + text.charAt(i));
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, speed);

            return () => {
                clearInterval(typingInterval);
            };
        }
    }, [text, speed]);

    return displayText;
};
