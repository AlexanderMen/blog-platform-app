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
			const { page, articles, articlesCount } = action;
			return {
				page,
				articles: [...articles],
				totalPages: Math.ceil(articlesCount / 5),
			};
		}
		default:
			return state;
	}
};

export default changingPage;
