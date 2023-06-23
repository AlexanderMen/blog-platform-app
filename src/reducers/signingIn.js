import { SIGN_IN } from '../actions';

const signingIn = (
	state = {
		userEmail: '',
		password: '',
		errs: null,
	},
	action
) => {
	switch (action.type) {
		case SIGN_IN: {
			if (action.errs) return { ...state, errs: action.errs };
			return { ...state, ...action.formField, errs: null };
		}
		default:
			return state;
	}
};

export default signingIn;
