
import { useState, useEffect, useRef } from 'react';

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export const useCounter = (end: number, duration: number = 1500, decimals: number = 0) => {
    const [count, setCount] = useState(0);
    const frameRef = useRef<number>();
    const startTimeRef = useRef<number>();

    useEffect(() => {
        const animate = (timestamp: number) => {
            if (startTimeRef.current === undefined) {
                startTimeRef.current = timestamp;
            }

            const elapsedTime = timestamp - startTimeRef.current;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeOutExpo(progress);
            
            const currentCount = easedProgress * end;
            setCount(currentCount);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setCount(end); // Ensure it ends on the exact number
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
            startTimeRef.current = undefined;
        };
    }, [end, duration]);

    return parseFloat(count.toFixed(decimals));
};
