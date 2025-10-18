import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Async thunks for storage operations
export const setDarkModeAsync = createAsyncThunk(
    'ui/setDarkModeAsync',
    async (value) => {
        await AsyncStorage.setItem('@elearning_dark_mode', JSON.stringify(value));
        return value;
    }
);

export const setLocaleAsync = createAsyncThunk(
    'ui/setLocaleAsync',
    async (locale) => {
        await AsyncStorage.setItem('@elearning_locale', locale);
        return locale;
    }
);

const slice = createSlice({
    name: 'ui',
    initialState: { darkMode: false, hasUnread: true, locale: 'en', primaryColor: null, siteTitle: 'E-Learning' },
    reducers: {
        // ✅ Pure reducer - no side effects
        setUnread(state, action) {
            state.hasUnread = Boolean(action.payload);
        },
        setPrimaryColor(state, action) {
            state.primaryColor = action.payload || null;
        },
        setSiteTitle(state, action) {
            state.siteTitle = action.payload || 'E-Learning';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(setDarkModeAsync.fulfilled, (state, action) => {
                state.darkMode = action.payload;
            })
            .addCase(setLocaleAsync.fulfilled, (state, action) => {
                state.locale = action.payload;
            });
    },
});

export const { setUnread, setPrimaryColor, setSiteTitle } = slice.actions;

 export const setDarkMode = setDarkModeAsync;
export const setLocaleUI = setLocaleAsync;

export default slice.reducer;