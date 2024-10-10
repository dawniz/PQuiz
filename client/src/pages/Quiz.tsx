import { FormEvent, KeyboardEventHandler, useEffect, useRef, useState } from "react";
import getString from "../lib/strings";
import { setCurrentPath } from "../reducers/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { animate, motion } from 'framer-motion';
import { Generation, getQuestions, getTypes, PokemonType, QuestionData, QuestionDataChoices, QuestionDataTypes } from "../api";
import { setPokemonTypes, setQuestionsLoaded } from "../reducers/quizSlice";
import QuizStats from "../components/QuizStats";
import { IconSizes, IconType, QuestionResult, QuestionType, ThemeColorsClasses, TypeIconType } from "../lib/enums";
import { arrayIntersect, getRandomNumber, stringCapitalize } from "../lib/utils";
import QuizAnswerInformation from "../components/QuizAnswerInformation";
import Icon, { TypeIcon } from "../components/Icons";
import { Link, useNavigate, Navigate } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import QuizCounter from "../components/QuizCounter";
import QuizTimer from "../components/QuizTimer";

export type AnswerCallbackFunc = (answer: string | null | string[]) => void

export type QuizData = {
    questionCount: number, //questionCount
    questionType: QuestionType, //questionType
    generation: Generation //generation
}

const timerDuration: Map<QuestionType, number> = new Map([
    [QuestionType.SILHOUETTES_CHOICES, 10],
    [QuestionType.SILHOUETTES_FULLNAME, 30],
    [QuestionType.SILHOUETTES_TYPES, 15],
])

function Quiz() {
    const dispatch = useDispatch();
    const pathname = '/quiz';
    const navigate = useNavigate();
    const quizData = {
        generation: useSelector((state: RootState) => state.quizParams.selectedGeneration)!,
        questionType: useSelector((state: RootState) => state.quizParams.selectedQuestionType),
        questionCount: useSelector((state: RootState) => state.quizParams.selectedQuestionCount)
    };
    // useEffect(() => {
    //     if (quizData.generation === null) {
    //         navigate('/', { replace: true });;
    //     }
    // }, []);


    // const searchParams = useSearchParams();
    // const pathname = usePathname();
    // const router = useRouter();
    // const pathname = usePathname();
    // const [quizData, setQuizData] = useState<QuizData>({
    //     questionCount: 5,
    //     questionType: QuestionType.SILHOUETTES_CHOICES,
    //     pokemonFrom: 1,
    //     pokemonTo: 150
    // });
    // let quizData: QuizData = {
    //     questionCount: 5,
    //     questionType: QuestionType.SILHOUETTES_CHOICES,
    //     pokemonFrom: 1,
    //     pokemonTo: 150
    // };
    const [activeQuestion, setActiveQuestion] = useState(0);
    const correctAnswers = useRef<boolean[]>([]);
    const timeElapsed = useRef<number[]>([]);
    const questions = useRef<QuestionData[]>([]);
    // const [questionsLoaded, setQuestionsLoaded] = useState(false);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [quizEnded, setQuizEnded] = useState(false);
    let [isTimerCounting, setIsTimerCounting] = useState<boolean>(false);
    let isPlayedAgain = useRef<boolean>(false);
    let isTimerFreezed = useRef<boolean>(false);
    const [answerValue, setAnswerValue] = useState<QuestionResult>(0);
    const selectedTypeAnswers = useRef<string[]>([]);
    const answerFieldRef = useRef<HTMLInputElement>(null);
    const answerButtonRef = useRef<HTMLDivElement>(null);

    const questionsLoaded = useSelector((state: RootState) => state.quiz.questionsLoaded); 
    let pokemonTypes = useSelector((state: RootState) => state.quiz.pokemonTypes);

    useEffect(() => {
        if (quizData.generation === null) {
            navigate('/', { replace: true });
            // navigate(0);
        }
        dispatch(setCurrentPath(pathname));
        if(pokemonTypes.length === 0) {
            getTypes()
            .then((t: PokemonType[]) => {
                dispatch(setPokemonTypes(t));
                pokemonTypes = t;
                if(questions.current.length !== 0){
                    dispatch(setQuestionsLoaded(true));
                    setQuestionsLoading(false);
                }
            }).
            catch((error: any) => {
                console.error("Error fetching types:", error);
                navigate('?error', { replace: true });
            });
        }
        if (quizData && Object.keys(quizData).length > 0 && !questionsLoaded && !questionsLoading) {
            setQuestionsLoading(true);
            if(quizData.generation != null){
                getQuestions(quizData.questionCount, quizData.questionType, quizData.generation.id!)
                .then((q: QuestionData[]) => {
                    questions.current = [...q]
                    if(pokemonTypes.length !== 0){
                        dispatch(setQuestionsLoaded(true));
                        setQuestionsLoading(false);
                    }
                })
                .catch((error: any) => {
                    console.error("Error fetching questions:", error)
                    navigate('?error', { replace: true });
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isPlayedAgain.current) {
        setQuestionsLoading(true);
        getQuestions(quizData.questionCount, quizData.questionType, quizData.generation.id!)
            .then((q: QuestionData[]) => {
                questions.current = [...q];
                dispatch(setQuestionsLoaded(true));
                setQuestionsLoading(false);
            })
            .catch((error: any) => {
                console.error("Error fetching questions:", error);
                navigate('?error', { replace: true });
            });
        isPlayedAgain.current = false;
    }

    // if(!searchParams.has("data") && !questionsLoaded && !isPlayedAgain){
    //     router.replace("/");
    // }

    const handleAnswerFieldEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key == "Enter") {
            answerButtonRef.current!.click()
        }
    }

    function handleAnswerTypeClick(e: FormEvent<HTMLDivElement>, selectedType: string): void {
        const input = e.currentTarget.firstChild as HTMLInputElement;
        if (input.type === 'checkbox') {
            if (!input.checked) {
                input.checked = true;
                selectedTypeAnswers.current = [...selectedTypeAnswers.current, selectedType];
                animate(e.currentTarget, { backgroundColor: getComputedStyle(document.body).getPropertyValue(`--pok-type-${selectedType}`) }, { duration: .2 })
                animate(e.currentTarget, { boxShadow: `0 0 20px ${getComputedStyle(document.body).getPropertyValue(`--pok-type-${selectedType}`)}` }, { duration: .2 })
                animate(`#${selectedType}`, { fill: getComputedStyle(document.body).getPropertyValue(`--tw-color-night`) }, { duration: .2 })
                animate(e.currentTarget, { color: getComputedStyle(document.body).getPropertyValue(`--tw-color-night`) }, { duration: .2 })
            }
            else {
                input.checked = false;
                selectedTypeAnswers.current = selectedTypeAnswers.current.filter((checkedAnswer: string) => checkedAnswer !== selectedType)
                animate(e.currentTarget, { backgroundColor: getComputedStyle(document.body).getPropertyValue(`--tw-color-night`) }, { duration: .2 })
                animate(e.currentTarget, { boxShadow: '0 0 0px' }, { duration: .2 })
                animate(`#${selectedType}`, { fill: getComputedStyle(document.body).getPropertyValue(`--pok-type-${selectedType}`) }, { duration: .2 })
                animate(e.currentTarget, { color: getComputedStyle(document.body).getPropertyValue('--tw-color-night-text') }, { duration: .2 })
            }
        }
    }
    function handleTypeAnswerSubmit(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        getAnswer(selectedTypeAnswers.current);
        selectedTypeAnswers.current = [];
    }

    const constructAnswersFields = (questionType: QuestionType, data: QuestionData) => {
        if (questionType == QuestionType.SILHOUETTES_CHOICES) {
            return (<>
                {(questions.current[activeQuestion] as QuestionDataChoices).answers.map((a: string) => (
                    <div className="btn portrait:py-0" key={a} onClick={() => getAnswer(a)}>{stringCapitalize(a)}</div>
                ))}</>
            );
        }
        else if (questionType == QuestionType.SILHOUETTES_FULLNAME) {
            return (<>
                <input ref={answerFieldRef} onKeyUp={(e) => { handleAnswerFieldEnter(e) }} type="text" name="answer" autoComplete="off" spellCheck={false} autoCorrect="off" className="transition-all box-border focus-visible:box-border p-2 border-2 focus-visible:border-2 rounded-md bg-night border-night-lightest focus-visible:border-red-cmyk text-night-text" />
                <div ref={answerButtonRef} onClick={(e) => { getAnswer(answerFieldRef.current!.value.toLowerCase().trim()) }} className="btn">{">"}</div>
            </>
            );
        }
        else if (questionType == QuestionType.SILHOUETTES_TYPES) {
            return ( // flex flex-wrap flex-grow-0 gap-4 justify-center
                <form onSubmit={(e) => handleTypeAnswerSubmit(e)}>
                    <div className="grid grid-cols-6 gap-4">
                        {
                        pokemonTypes.map((t: PokemonType) => !t.disabled && (
                            <motion.div className={`p-2 border-2 border-[transparent] rounded-md cursor-pointer shadow-type-${t.name} hover:border-night-light`} key={`type${t.id}`} onClick={(e: FormEvent<HTMLDivElement>) => handleAnswerTypeClick(e, t.name)}>
                                <input
                                    className="peer hidden"
                                    type="checkbox"
                                    name="answer"
                                    id={t.id!.toString()}
                                    value={t.name}
                                    readOnly
                                    checked={(selectedTypeAnswers.current.find((st) => st === t.name) != undefined) ? true : false}
                                />
                                <TypeIcon type={TypeIconType.get(t.name)!} color={t.name} size={IconSizes.px48} />
                                {/* <TypeIcon type={ Object.keys(IconType).find((v) => t.name == v) } color={ThemeColorsClasses.TEXT} size={IconSizes.px32} /> */}
                                <div className="mt-2 text-center">{t.name.toUpperCase()}</div>
                            </motion.div>
                        ))
                    }
                    </div>
                    <input type="submit" className="btn" value={getString("next-question")} />
                </form>
            )
        }

    }

    const passTimeElapsed = (time: number) => {
        if (timeElapsed.current[activeQuestion] === undefined && answerValue != QuestionResult.NO_ANSWER) {
            timeElapsed.current = [...timeElapsed.current, time];
        }
    }

    const getAnswer: AnswerCallbackFunc = async (answer) => {
        isTimerFreezed.current = true;
        if (correctAnswers.current.length - 1 < activeQuestion) {
            if (quizData.questionType === QuestionType.SILHOUETTES_TYPES) { // make correct answer detection f.e. array intersection
                if (answer === null) {
                    correctAnswers.current = [...correctAnswers.current, false];
                    setIsTimerCounting(false);
                    setAnswerValue(QuestionResult.TIME_OUT);
                }
                else if (arrayIntersect((questions.current[activeQuestion] as QuestionDataTypes).correctAnswers, answer as string[]).length === (questions.current[activeQuestion] as QuestionDataTypes).correctAnswers.length) {
                    correctAnswers.current.push(true);
                    setIsTimerCounting(false);
                    setAnswerValue(QuestionResult.ANSWER_CORRECT);
                }
                // else if (arrayIntersect((questions.current[activeQuestion] as QuestionDataTypes).correctAnswers, answer as string[]).length != (questions.current[activeQuestion] as QuestionDataTypes).correctAnswers.length) {
                else{
                    correctAnswers.current = [...correctAnswers.current, false];
                    setIsTimerCounting(false);
                    setAnswerValue(QuestionResult.ANSWER_UNCORRECT);
                }
            }
            else {
                if (questions.current[activeQuestion].correctAnswer === answer) {
                    correctAnswers.current.push(true);
                    setIsTimerCounting(false);
                    setAnswerValue(QuestionResult.ANSWER_CORRECT);
                }
                else if (answer === null) {
                    correctAnswers.current = [...correctAnswers.current, false];
                    setIsTimerCounting(false);
                    setAnswerValue(QuestionResult.TIME_OUT);
                }
                else if (questions.current[activeQuestion].correctAnswer !== answer) {
                    correctAnswers.current = [...correctAnswers.current, false];
                    setIsTimerCounting(false);
                    setAnswerValue(QuestionResult.ANSWER_UNCORRECT);
                }
            }
            if (answer !== null) {
                setIsTimerCounting(false);
            }
        }
    }

    const nextQuestion = (): void => {
        if (activeQuestion === quizData.questionCount - 1) {
            setAnswerValue(QuestionResult.NO_ANSWER);
            setIsTimerCounting(false);
            setQuizEnded(true);
        }
        else {
            isTimerFreezed.current = false;
            setAnswerValue(QuestionResult.NO_ANSWER);
            setActiveQuestion(activeQuestion + 1);
        }
    }


    const handleImageLoad = () => {
        setIsTimerCounting(true);
        if (answerFieldRef.current != null)
            answerFieldRef.current.focus()
    }

    const resetQuiz = () => {
        dispatch(setQuestionsLoaded(false));
        setActiveQuestion(0);
        correctAnswers.current = [];
        timeElapsed.current = [];
        setQuestionsLoading(false);
        setQuizEnded(false);
        setIsTimerCounting(false);
        isTimerFreezed.current = false;
        setAnswerValue(QuestionResult.NO_ANSWER);
        isPlayedAgain.current = true;
        // router.push(encodeURI(`${pathname}?data=${JSON.stringify(quizData)}`));
        // router.refresh();
    }
    return (<>
        <Modal current={pathname} query="exit" text={getString("modal_text")} buttons={[{ text: getString("yes"), target: "/", callback: resetQuiz }, { text: getString("no"), target: null, callback: null }]} />
        <div className="flex align-center justify-between w-full h-full flex-col flex-grow">
            {quizEnded && (answerValue == QuestionResult.NO_ANSWER) && <QuizStats playAgainCallback={resetQuiz} correctAnswers={correctAnswers.current.filter(Boolean).length} questionsCount={quizData.questionCount} timerDuration={timerDuration.get(quizData.questionType)!} timeElapsed={timeElapsed.current.reduce(((prev, current) => prev + current), 0.0)} />}
            {!questionsLoaded && questions.current.length === 0 && <Loading />}
            {questionsLoaded && questions.current.length > 0 && activeQuestion !== quizData.questionCount && !quizEnded && (
                <>
                    <div className="w-full flex justify-between items-center">
                        <Link to="/quiz?exit" className="p-2 w-12 h-12 btn"><Icon type={IconType.XMARK} color={ThemeColorsClasses.TEXT} size={IconSizes.px32} /></Link>
                        <QuizCounter correctAnswers={correctAnswers.current} currentQuestion={activeQuestion} questionCount={quizData.questionCount} />
                        <QuizTimer freezed={isTimerFreezed.current} activeQuestion={activeQuestion} duration={timerDuration.get(quizData.questionType)!} expired={() => getAnswer(null)} started={isTimerCounting} passTime={passTimeElapsed} />
                    </div>
                    <div className="questionContainer w-full h-max flex flex-grow justify-between items-center portrait:flex-wrap landscape:flex-nowrap mt-8" key={getRandomNumber(1, 255)}>
                        <div className="questionText landscape:basis-1/2 portrait:basis-full">
                            <>
                                <img 
                                    alt={"Pokemon"}
                                    src={require('../' + questions.current[activeQuestion].images.invisible)} //(imgRef.current === "") ? setImgRefs(arrayRandomEntry(questions[activeQuestion].imgUrls)): imgRef.current 
                                    key={"question-" + activeQuestion}
                                    width={200}
                                    height={200}
                                    onLoad={() => handleImageLoad()}
                                    className={`landscape:w-auto landscape:h-full max-h-[400px] max-w-[400px] transition-all object-contain duration-1000 mx-auto ${(answerValue === QuestionResult.ANSWER_CORRECT) ? "hidden" : ""}`} //(!imageLoaded && "hidden")
                                    />
                                <img
                                    alt={"Pokemon"}
                                    src={require('../' + questions.current[activeQuestion].images.visible)} //(imgRef.current === "") ? setImgRefs(arrayRandomEntry(questions[activeQuestion].imgUrls)): imgRef.current 
                                    key={activeQuestion}
                                    width={200}
                                    height={200}
                                    className={`landscape:w-auto landscape:h-full max-h-[30%] max-w-[400px] transition-all object-contain duration-1000 mx-auto ${(answerValue !== QuestionResult.ANSWER_CORRECT) ? "hidden" : ""}`} //(!imageLoaded && "hidden")
                                    />
                            </>
                        </div>
                        <div className="questionAnswers landscape:basis-1/2 portrait:basis-full w-10/12 grid gap-4">
                            {answerValue > QuestionResult.NO_ANSWER &&
                                <QuizAnswerInformation questionResult={answerValue} correctAnswer={(questions.current[activeQuestion].correctAnswer) ? questions.current[activeQuestion].correctAnswer : (questions.current[activeQuestion] as QuestionDataTypes).correctAnswers} callback={() => nextQuestion()} pokemonNameWhenAskingTypes={((questions.current[activeQuestion] as QuestionDataTypes).pokemonName)} />}
                            {answerValue === 0 && (<>
                                {constructAnswersFields(quizData.questionType, questions.current[activeQuestion])}
                            </>)}
                        </div>
                    </div>
                </>
            )}
        </div>
    </>
    );
}
export default Quiz;