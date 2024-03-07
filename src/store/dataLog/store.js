// store.js
import { createStore } from 'redux';
import dataReducer from './reducers';

const store = createStore(dataReducer);

export default store;
