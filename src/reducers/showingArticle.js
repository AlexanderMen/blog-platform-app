import { SHOW_ARTICLE } from '../actions';

const showingArticle = (state = { article: null }, action) => {
	switch (action.type) {
		case SHOW_ARTICLE: {
			return { article: action.article };
		}
		default:
			return state;
	}
};

export default showingArticle;
