import { combineReducers } from '@reduxjs/toolkit';

import { Query } from '#api';

import app from './app';

export default combineReducers({ app, [Query.reducerPath]: Query.reducer });
