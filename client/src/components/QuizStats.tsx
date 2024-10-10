import { Link } from "react-router-dom";

export type QuizStatsProps = {
    playAgainCallback: () => void
    correctAnswers: number,
    questionsCount: number,
    timerDuration: number,
    timeElapsed: number
}
export default function QuizStats(props: QuizStatsProps){
    const timeElapsedMaxed = Math.min(props.questionsCount * props.timerDuration * 1.0, props.timeElapsed)
    return (
      <div className="h-full w-auto grid grid-cols-2 auto-cols-fr gap-4 justify-center self-center content-center">
        <div className="flex flex-col h-max p-4 rounded-3xl border-2 border-night-lighter text-center">
          <span className="text-4xl mb-2">{props.correctAnswers}</span>
          <span>Correct answers</span>
        </div>
        <div className="flex flex-col h-max p-4 rounded-3xl border-2 border-night-lighter text-center">
          <span className="text-4xl mb-2">{props.questionsCount}</span>
          <span>Question count</span>
        </div>
          <div className="flex flex-col h-max p-4 rounded-3xl border-2 border-night-lighter text-center">
            <span className="text-4xl mb-2">{timeElapsedMaxed.toString().substring(0, 5)}s</span>
            <span>Time elapsed</span>
          </div>
          <div className="flex flex-col h-max p-4 rounded-3xl border-2 border-night-lighter text-center">
            <span className="text-4xl mb-2">{props.questionsCount * props.timerDuration}s</span>
            <span>Time total</span>
          </div>
        <div className="w-full flex justify-center gap-6 mt-8 col-span-2">
          <div className="btn" onClick={() => props.playAgainCallback()}>
            Play Again
          </div>
          <Link className="btn" to="/">
            Back to start
          </Link>
        </div>
      </div>
    );
}

// <div className="h-full flex flex-col items-center justify-center quizStats gap-8">
        //     <div className="flex gap-8">
        //         <div className="flex flex-col p-4 rounded-3xl border-2 border-night-lighter ">
        //             <span className="text-4xl mb-2">{props.correctAnswers}</span>
        //             <span>Correct answers</span>
        //         </div>
        //         <div className="flex flex-col p-4 rounded-3xl border-2 border-night-lighter">
        //             <span className="text-4xl mb-2">{props.questionsCount}</span>
        //             <span>Question count</span>
        //         </div>
        //     </div>
        //     <div className="flex gap-8">
        //         <div className="flex flex-col p-4 rounded-3xl border-2 border-night-lighter ">
        //             <span className="text-4xl mb-2">{props.timeElapsed}</span>
        //             <span>Time elapsed</span>
        //         </div>
        //         <div className="flex flex-col p-4 rounded-3xl border-2 border-night-lighter">
        //             <span className="text-4xl mb-2">{props.questionsCount * 5}</span>
        //             <span>Time total</span>
        //         </div>
        //     </div>
        //     <div className="w-full flex justify-center gap-6 mt-8">
        //         <div className="btn" onClick={() => props.playAgainCallback()}>Play Again</div>
        //         <Link className="btn" href="/">Back to start</Link>
        //     </div>
        // </div>