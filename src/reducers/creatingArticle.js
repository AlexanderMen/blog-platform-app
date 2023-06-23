import { CREATE_ARTICLE } from '../actions';

const creatingArticle = (
	state = {
		title: '',
		shortDescription: '',
		text: '',
		tags: [],
		errs: null,
	},
	action
) => {
	switch (action.type) {
		case CREATE_ARTICLE: {
			if (action.errs) return { ...state, errs: action.errs };
			return { ...state, ...action.formField, errs: null };
		}
		default:
			return state;
	}
};

export default creatingArticle;
