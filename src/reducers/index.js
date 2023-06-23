import { combineReducers } from 'redux';

import changingPage from './changingPage';
import showingArticle from './showingArticle';
import creatingAcc from './creatingAcc';
import signingIn from './signingIn';
import editingProfile from './editingProfile';
import gettingFormResponse from './gettingFormResponse';
import creatingArticle from './creatingArticle';
import error from './error';

export default combineReducers({
	changingPage,
	showingArticle,
	creatingAcc,
	signingIn,
	editingProfile,
	gettingFormResponse,
	creatingArticle,
	error,
});
