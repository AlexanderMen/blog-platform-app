import { EDIT_PROFILE } from '../actions';

const editingProfile = (
	state = {
		userName: '',
		userEmail: '',
		newPassword: '',
		avatarImg: '',
		errs: null,
	},
	action
) => {
	switch (action.type) {
		case EDIT_PROFILE: {
			if (action.errs) return { ...state, errs: action.errs };
			return { ...state, ...action.formField, errs: null };
		}
		default:
			return state;
	}
};

export default editingProfile;
