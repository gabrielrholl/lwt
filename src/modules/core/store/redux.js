import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';

import logger from './middlewares/logger';
import localStorage, { loadState } from './middlewares/localstorage';

import application from './modules/application/reducers';

let middlewares = [thunk, localStorage];
if (process.env.NODE_ENV !== 'production') {
    middlewares = [...middlewares, logger];
}

export const store = createStore(
    combineReducers({
        application,
    }),
    loadState(),
    applyMiddleware(...middlewares),
);
