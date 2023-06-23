import { CREATE_ACC } from '../actions';

const creatingAcc = (
	state = {
		userName: '',
		userEmail: '',
		password: '',
		repeatPassword: '',
		checkbox: true,
		errs: null,
	},
	action
) => {
	switch (action.type) {
		case CREATE_ACC: {
			if (action.errs) return { ...state, errs: action.errs };
			return { ...state, ...action.formField, errs: null };
		}
		default:
			return state;
	}
};

export default creatingAcc;
