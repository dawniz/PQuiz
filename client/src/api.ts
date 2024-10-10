import { QuestionType } from "./lib/enums";


export interface Generation {
    id: number | null
    name: string;
    regionName: string;
}

export interface PokemonType {
    id: number | null,
    name: string,
    disabled: boolean
}

export interface Pokemon {
    id: number | null,
    pokeDexId: number,
    name: string
}

export interface PokemonForm {
    id: number | null,
    name: string,
    pokemonId: number,
    generationId: number,
    sprite: string
}

export const getGenerations = async() => {
    const response = await fetch(process.env.REACT_APP_API_URL + "/generation")
    .catch((e) => {
        console.log("API ERROR: Error when fetching generations");
    });
    return ((await response!.json()) as Generation[] );
}

// const getPokemonForms = async() => {
//     const response = await fetch(process.env.REACT_APP_API_URL + "/forms")
//     .catch((e) => {
//         console.log("API ERROR: Error when fetching pokemon forms");
//     });
//     return ((await response!.json()) as PokemonForm );
// }

// const getPokemon = async(id: number) => {
//     const response = await fetch(process.env.REACT_APP_API_URL + "/pokemon/" + id)
//     .catch((e) => {
//         console.log("API ERROR: Error when fetching pokemon with id", id);
//     });
//     return ((await response!.json()) as Pokemon );
// }
// const getPokemons = async(ids: number[]) => {
//     const response = await fetch(process.env.REACT_APP_API_URL + "/pokemon/" + ids.join(','))
//     .catch((e) => {
//         console.log("API ERROR: Error when fetching pokemos");
//     });
//     return ((await response!.json()) as Pokemon );
// }




export interface QuestionData {
    correctAnswer: string,
    images: PokemonImages,
}
export interface QuestionDataChoices extends QuestionData {
    answers:string[]
}
export interface QuestionDataTypes extends QuestionData {
    pokemonName: string,
    correctAnswers: string[]
}
export interface QuestionDataFullname extends QuestionData{}
export type GenerationPokemonsRange = {
    name: string,
    regionName: string,
    pokemonFrom: number,
    pokemonTo: number,
};
export type PokemonImages = {
    visible: string,
    invisible: string
}


// async function getRandomPokemonsNamesFromGeneration(count: number, idsArray: { id: number, pokemonId: number}[], idToExclude: number){
//     const ids = [...idsArray];
//     const values = [];
//     ids[idToExclude] = ids.slice(-1)[0];
//     ids.pop();
//     for(let i = 0; i < count; i++){
//         let number = getRandomNumber(0, ids.length - 1);
//         values.push(ids[number]);
//         ids[number] = ids.slice(-1)[0];
//         ids.pop();
//     }
//     console.log(`Answers randomized in getRandomPokemonWithAnswer(): `);
//     console.log(values);
//     const names = await prisma.pokemon.findMany({
//         select:{
//             name: true,
//         },
//         where:{
//             id: {
//                 in: values.map((v)=> (v.pokemonId) )
//             }
//         }
//     })
//     console.log(`Names from randomized IDs in getRandomPokemonWithAnswer(): `);
//     console.log(names);
//     // return arrayShuffle(names); // shuffle outside of this func
//     return names;
// }
// export async function getQuestions(questionsCount: number, type: QuestionType, generationName: string){
//     let questionArr: QuestionData[] = [];
//     const promisesArr = [];
//     const generationId = await prisma.generation.findUnique({
//         where: {
//             name: generationName
//         },
//         select: {
//             id: true
//         }
//     })
//     console.log(`Generation in getQuestions(): ${generationName} / ${generationId}`);
//     for (let i = 0; i < questionsCount; i++) {
//         promisesArr.push(getQuestionData(type, generationId!.id))
//     }
//     await Promise.all(promisesArr)
//         .then(q => questionArr = q)
//         .catch(error => console.log(error));
//     return questionArr;
// }

// export async function getGenerationsPokemonRanges(){

//     let generationsData: Generation[];
//     let generationsList:GenerationPokemonsRange[] = []

//     return await getGenerationsList()
//         .then(async (generationsData: Generation[]) => {
//             for (let i = 0; i < generationsData.length; i++) {
//                 const obj: GenerationPokemonsRange = {
//                     name: generationsData![i].name,
//                     regionName: generationsData![i].main_region.name,
//                     pokemonFrom: (await getPokemonData(generationsData![i].pokemon_species[0].name)).id,
//                     pokemonTo: (await getPokemonData(generationsData![i].pokemon_species[generationsData![i].pokemon_species.length - 1].name)).id
//                 }
//                 generationsList[i] = obj;
//             }
//         }).then(()=> generationsList);
// }

export async function getQuestions(questionCount: number, questionType: QuestionType, generationId: number): Promise<QuestionData[]>{
    var response = await (await fetch(process.env.REACT_APP_API_URL + `/question/${questionCount}/${questionType}/${generationId}`)).json()
    .catch((e) => {
        console.log("API ERROR: Error when fetching questions");
    });
    return ((await response) as QuestionData[]);

}

export const getTypes = async() =>{
    const response = await fetch(process.env.REACT_APP_API_URL + "/pokemontype")
    .catch((e) => {
        console.log("API ERROR: Error when fetching pokemon types");
    });
    return ((await response!.json()) as PokemonType[] );
}
    

