export type QuizCounterProps = {
    questionCount: number,
    currentQuestion: number
    correctAnswers: (boolean | null) []
}
export default function QuizCounter(props: QuizCounterProps){
    return (
        <div className="w-4/12 flex flex-col justify-center items-center">
            <p>Question {props.currentQuestion + 1}/{props.questionCount}</p>
            {(props.questionCount < 15) &&
                <div className="h-3 w-5/12 flex justify-center gap-1">
                    { Array.from(Array(props.questionCount).keys()).map((n: number)=>(
                        <div key={`question-${n}`} className={"h-3 max-w-3 aspect-square flex-grow rounded-3xl gap-2 " + (props.correctAnswers[n] === true ? "bg-azure" : (props.correctAnswers[n] === undefined ? 'bg-night-lighter' : 'bg-red-cmyk'))}></div>
                    )) }
                </div>
            }
        </div>
    );
}