import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Generation } from '../api';
import { QuestionType } from '../lib/enums';

interface QuizChooserState {
    selectedGeneration: Generation | null,
    selectedQuestionType: QuestionType,
    selectedQuestionCount: number
}

const initialState: QuizChooserState = {
    selectedGeneration: null,
    selectedQuestionType: QuestionType.SILHOUETTES_CHOICES,
    selectedQuestionCount: 5
};

const quizChooserSlice = createSlice({
    name: "quizChooser",
    initialState,
    reducers: {
        setSelectedGeneration(state, action: PayloadAction<Generation>) {
            state.selectedGeneration = action.payload;
        },
        setSelectedQuestionType(state, action: PayloadAction<QuestionType>) {
            state.selectedQuestionType = action.payload;
        },
        setSelectedQuestionCount(state, action: PayloadAction<number>) {
            state.selectedQuestionCount = action.payload;
        }
    }
});

export const { setSelectedGeneration, setSelectedQuestionType, setSelectedQuestionCount } = quizChooserSlice.actions

export default quizChooserSlice.reducer;