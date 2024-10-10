import { Link, useNavigate } from 'react-router-dom';
import { QuestionType } from "../lib/enums";
// import { GenerationPokemonsRange, getGenerations, getGenerationsPokemonRanges } from "../lib/questions";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
// import Loading from "@/app/loading";
import getString from "../lib/strings";
import { stringCapitalize } from "../lib/utils";
import { Generation } from '../api';
import { getGenerations } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedGeneration, setSelectedQuestionCount, setSelectedQuestionType } from '../reducers/quizChooserSlice';
import { RootState } from '../store';
import { setCurrentPath } from '../reducers/appSlice';
import { setQuestionsLoaded } from '../reducers/quizSlice';
import Loading from './Loading';

export default function QuizChooser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectedGeneration = useSelector((state: RootState) => state.quizParams.selectedGeneration);
    const selectedQuestionType = useSelector((state: RootState) => state.quizParams.selectedQuestionType);
    const questionsCount = useSelector((state: RootState) => state.quizParams.selectedQuestionCount);
    

    const [generationsArr, setGenerationsArr] = useState<Generation[]>([]);
    // const [selectedQuestionType, setSelectedQuestionTypeLocal] = useState<QuestionType>(QuestionType.SILHOUETTES_CHOICES)
    // const [selectedGeneration, setSelectedGenerationLocal] = useState<Generation>();
    // const [questionsCount, setQuestionsCount] = useState(5);
    const [isGenerationsLoaded, setGenerationsLoaded] = useState(false);

    const questionTypes = useMemo(() => {
      return Object.values(QuestionType).map((type) => ({
          type,
          label: getString(type)
      }));
    }, []);
    useEffect(()=> {
      dispatch(setCurrentPath('/'));
      getGenerations()
      .then((response) => {
        setGenerationsArr(response);
        setGenerationsLoaded(true);
        dispatch(setSelectedGeneration(response[0]));
        dispatch(setQuestionsLoaded(false));
      })
      .catch((error: any) => {
        navigate('?error', { replace: true });
      });
    },[navigate, dispatch]);
    // if(generationsArr.length != 0)
    // {
    //   memoGenerationArr = generationsArr.map(generation => ({
    //     object: generation,
    //     labelName: getString(generation.name),
    //     labelRegion: ,
    //   }));
    // }
    // useMemo(() => first, [second])
                  // setGenerationsArr(g);
          // setSelectedGenerationLocal(g[0]);
        
        
      // const generations = getGenerations().then((g)=>{
      //   setGenerationsArr(g);
      //   setSelectedGenerationLocal(g[0]);
      // }).catch((e => {
      //   console.log("Error, try again later");
      // }))

    // useEffect(() => {
    //     if (generationsArr.length > 0)
    //         setGenerationsLoaded(true);
    // }, [generationsArr]);

    // const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const formData = new FormData(e.currentTarget);
    //     formData.forEach((value, key) => console.log(key, value));
    //     // router.push('/quiz',)
    // };

    const onButtonClicked = (e: FormEvent<HTMLDivElement>, selectedQuestionType: QuestionType | null = null, selectedGeneration: Generation | null = null) => {
        const input = e.currentTarget.firstChild as HTMLInputElement;
        if (input.type === 'radio')
        {
            // input.checked = true;
            if(selectedQuestionType !== null)
                dispatch(setSelectedQuestionType(selectedQuestionType!));
            if(selectedGeneration !== null)
              dispatch(setSelectedGeneration(selectedGeneration));
        }
        
    };

    const handleQuestionCountInput = (e: ChangeEvent<HTMLInputElement>): void => {
        dispatch(setSelectedQuestionCount(parseInt(e.currentTarget.value)));
    }

    return (
      <div className="flex flex-grow justify-center items-center">
        {!isGenerationsLoaded && <Loading/>}
        {isGenerationsLoaded && (generationsArr.length > 0) && (
          <div className="flex flex-wrap">
            <form>
              <div>
                <div className="flex flex-row gap-4 portrait:flex-wrap landscape:flex-nowrap">
                  <div className="flex flex-col gap-2 portrait:flex-grow">
                    <label className="portrait:w-full">Question Types</label>
                    <div className="flex portrait:flex-col gap-2">
                      {questionTypes.map((t) => (
                        <div
                          className="radio"
                          key={t.type}
                          onClick={(e) => onButtonClicked(e, t.type, null)}
                        >
                          <input
                            type="radio"
                            name="questionTypes"
                            id={t.type}
                            value={t.type}
                            readOnly
                            checked={(selectedQuestionType === t.type) ? true: false}
                          />
                          <label htmlFor={t.type}>{ t.label }</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-col portrait:flex-grow">
                      <div className="flex">
                        <label>Questions count</label>
                        <div className="min-w-12 landscape:mx-6 portrait:ml-6 text-right portrait:flex-grow">{questionsCount}</div>
                      </div>
                      <div className="flex flex-grow">
                        <input
                          type="range"
                          name="questionsCount"
                          step={5}
                          min={5}
                          max={30}
                          defaultValue={5}
                          onChange={(e) => handleQuestionCountInput(e)}
                          className="w-full landscape:mr-6 portrait:mr-0"
                        />  
                      </div>
                  </div>
                </div>
              </div>
              <label>Generations</label>
              <div className="flex gap-2 flex-wrap portrait:flex-col">
                {generationsArr.map((g) => (
                  <div
                    className="radio"
                    key={g.name}
                    onClick={(e) => onButtonClicked(e, null, g) }
                  >
                    <input
                      type="radio"
                      name="generation"
                      id={g.name}
                      value={g.name}
                      onChange={()=>{}}
                      readOnly
                      checked={(selectedGeneration!.name === g.name) ? true: false }
                    />
                    <label htmlFor={g.name}>
                      {getString(g.name)}<br/>{stringCapitalize(g.regionName)}
                    </label>
                  </div>
                ))}
              </div>
              <Link className="landscape:absolute landscape:bottom-0 landscape:left-1/2 landscape:-translate-x-1/2 landscape:translate-y-1/2 btn w-1/4 mt-6 mx-auto" to="/quiz">Play</Link>
            </form>
          </div>
        )}
      </div>
    );
}
