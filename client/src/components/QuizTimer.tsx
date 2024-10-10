// @ts-nocheck
import { useEffect, useState, useReducer, useRef } from "react";

export type QuizTimerProps = {
    duration: number, 
    started: boolean,
    expired: () => void,
    activeQuestion: number,
    freezed: boolean
    passTime: (number) => void
}


const colorChoose = (percentage: number) => {
    const color_crit = "red-cmyk";
    const color_medium = "yellow";
    const color_high = "azure";
    if(percentage > 60)
        return color_high;
    else if(percentage > 30)
        return color_medium;
    return color_crit;
}

export default function QuizTimer(props: QuizTimerProps) {
    const [timeLeft, setTimeLeft] = useReducer((_, next ) => {
        return (next < 0) ? 0 : next
    }, props.duration * 1000)
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [percentage, setPercentage] = useState(100);
    const [lastValue, setLastValue] = useState();
    let timer: NodeJS.Timeout | null = useRef(null);
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        let startTime: number = Date.now();
        if (props.started && !props.freezed) {
            setTimeLeft(props.duration); // Reset time left to initial duration
            setPercentage(100);
            timer = setInterval(() => {
                // Decrement the time left by 1 second
                let time = (props.duration * 1000) - (Date.now() - startTime);
                setPercentage(Math.floor(time * 100 / (props.duration * 1000)));
                setTimeLeft(time/1000);
                setTimeElapsed((Date.now() - startTime) / 1000);
                setLastValue(time/1000)
                // console.log("TIME: " + time/1000);
                // if(time < 0){
                //     console.log("TIME RUN OUT");
                //     time = 0;
                //     setTimeLeft(0);
                //     clearInterval(timer!)
                // }   
            }, 200); // Update time left every second
        }

        // Clear the interval when the component unmounts or when 'started' prop changes to false
        return () => {
            props.passTime(timeElapsed)
            setLastValue(timeLeft);
            if (timer) {
                clearInterval(timer);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.started, props.activeQuestion, props.duration]); // Run whenever 'started' or 'activeQuestion' prop changes

    // Effect to invoke the expired callback function when the time runs out
    useEffect(() => {
        if (timeLeft === 0) {
            console.log("QUESTION EXPIRED");
            props.expired(); // Invoke the expired callback function
            if (timer != null) {
                clearInterval(timer);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft]); // Run whenever timeLeft changes

    useEffect(()=>{
        if(props.freezed){
            console.log("TIMER FREEZED");
            setLastValue(timeLeft);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.freezed])

    return (
        <div className={"timer w-12 h-12 rounded-[50%] flex justify-center items-center after:content after:absolute after:h-8 after:w-8 after:rounded-[50%] after:bg-night"}>
            {/* <span className="z-10 text-night-text">{(!props.freezed) ? (timeLeft + 1).toString().substring(0,timeLeft.toString().lastIndexOf('.')): ((lastValue != undefined) ? (lastValue + 1).toString().substring(0,lastValue.toString().lastIndexOf('.')): "0") }</span> */}
            <span className="z-10 text-night-text">{(!props.freezed) ? Math.floor((timeLeft + 0.99)): ((lastValue != undefined && lastValue != 0) ? Math.floor((lastValue + 1)): "0") }</span>
            <style>{`
                .timer{
                    background: conic-gradient(
                        var(--tw-color-${colorChoose(percentage)}) 0% ${percentage}%,
                        var(--tw-color-night) ${percentage}%);
                }
            `}</style>
        </div>
    );
}
