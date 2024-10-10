import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PokemonType } from '../api';

interface QuizState {
    pokemonTypes: PokemonType[],
    questionsLoaded: boolean
}

const initialState: QuizState = {
    pokemonTypes: [],
    questionsLoaded: false,  
};

const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        setPokemonTypes(state, action: PayloadAction<PokemonType[]>) {
            state.pokemonTypes = action.payload;
        },
        setQuestionsLoaded(state, action: PayloadAction<boolean>) {
            state.questionsLoaded = action.payload
        }
    }
});

export const { setPokemonTypes, setQuestionsLoaded } = quizSlice.actions

export default quizSlice.reducer;
