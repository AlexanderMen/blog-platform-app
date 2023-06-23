import { SHOW_ERROR_MESSAGE } from '../actions';

const error = (
	state = {
		err: false,
	},
	action
) => {
	switch (action.type) {
		case SHOW_ERROR_MESSAGE:
			return { err: true };
		default:
			return state;
	}
};

export default error;
