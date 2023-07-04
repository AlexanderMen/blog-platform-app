import { CHANGE_PAGE } from '../actions';

const changingPage = (
	state = {
		page: 1,
		articles: [],
		totalPages: 5,
	},
	action
) => {
	switch (action.type) {
		case CHANGE_PAGE: {
			const { page, articles, articlesCount, ARTICLES_COUNT_PER_PAGE } = action;
			return {
				page,
				articles: [...articles],
				totalPages: Math.ceil(articlesCount / ARTICLES_COUNT_PER_PAGE),
			};
		}
		default:
			return state;
	}
};

export default changingPage;
