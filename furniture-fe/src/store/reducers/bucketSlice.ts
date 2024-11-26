import { createSlice } from '@reduxjs/toolkit';

interface IBucketState {
    products: {
        value: any;
        count: number;
    }[];
}

const getArr = (payload: {value: {id: number}, operation: string}, arr: Array<{value: {id: number}; count: number}>) => {
    const { value, operation } = payload;

    let isFound = false;
    const newArr = [];

    arr.forEach(item => {
        if (value.id === item.value.id) {
            if (operation === '+') {
                newArr.push({value, count: item.count+1})
            } else {
                if (item.count !== 1) {
                    newArr.push({value, count: item.count-1});
                }
            }
            isFound = true;
        } else
            newArr.push(item);
    });

    if (!isFound && operation === '+') {
        newArr.push({value, count: 1});
    }

    return newArr;
};

const initialState: IBucketState = {
    products: [],
};

export const bucketSlice = createSlice({
    name: 'bucket',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = getArr(action.payload, state.products);
        },
        setStartProducts: (state, action) => {
            state.products = action.payload;
        },
        clearBucket: (state) => {
            state.products = [];
        },
    },
});

export const { setProducts, setStartProducts, clearBucket } = bucketSlice.actions;

export default bucketSlice.reducer;