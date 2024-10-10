import { useEffect } from "react";
import { QuestionResult } from "../lib/enums";
import { stringCapitalize } from "../lib/utils";

type QuizAnswerInformationProps = {
    questionResult: QuestionResult,
    correctAnswer: string | string[],
    callback: ()=>void,
    pokemonNameWhenAskingTypes: string | undefined
}

export default function QuizAnswerInformation(props: QuizAnswerInformationProps){
    useEffect(() => {
        setTimeout(()=>props.callback(), 5 * 1000)
    }, [props, props.callback])
    return(
        <div className="w-full h-1/4 col-span-2 flex flex-col items-center justify-center">
            {props.questionResult === QuestionResult.ANSWER_CORRECT && ((props.pokemonNameWhenAskingTypes == undefined) ? (
            <>
                <span className="text-4xl font-bold text-azure">{stringCapitalize(props.correctAnswer as string)}</span>
                <span className="text-azure">Correct answer</span>
            </>): 
                <>
                    <span className="text-4xl font-bold text-azure">{stringCapitalize(props.pokemonNameWhenAskingTypes)}</span>
                    <span className="text-2xl my-3">
                        {(props.correctAnswer as string[]).map((a) => (
                            <span key={a} className={`mx-2 py-1 px-2 bg-type-${a} rounded-2xl shadow-20px shadow-type-${a} text-night`}>{stringCapitalize(a)}</span>
                        ))}
                    </span>
                    <span className="text-azure">Correct answer</span>
                </>
            )}
            {props.questionResult === QuestionResult.ANSWER_UNCORRECT && <span className="text-red-cmyk">Wrong answer</span>}
            {props.questionResult === QuestionResult.TIME_OUT && <span className="text-red-cmyk">Time out</span>}
        </div>
    )
}