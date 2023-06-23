import { GET_FORM_RESPONSE } from '../actions';

const gettingFormResponse = (
	state = {
		username: '',
		email: '',
		image: '',
		token: '',
	},
	action
) => {
	switch (action.type) {
		case GET_FORM_RESPONSE: {
			const { username, email, image, token } = action;
			return {
				username,
				email,
				image,
				token,
			};
		}
		default:
			return state;
	}
};

export default gettingFormResponse;
