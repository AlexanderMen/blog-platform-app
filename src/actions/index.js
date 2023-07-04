import BlogPlatformService from '../services/BlogPlatformService';

const blogPlatformService = new BlogPlatformService();

export const CHANGE_PAGE = 'CHANGE_PAGE';
export const SHOW_ARTICLE = 'SHOW_ARTICLE';
export const CREATE_ACC = 'CREATE_ACC';
export const SIGN_IN = 'SIGN_IN';
export const EDIT_PROFILE = 'EDIT_PROFILE';
export const GET_FORM_RESPONSE = 'GET_FORM_RESPONSE';
export const CREATE_ARTICLE = 'CREATE_ARTICLE';
export const SHOW_ERROR_MESSAGE = 'SHOW_ERROR_MESSAGE';

export const HOME_ROUTE = '/';
export const ARTICLES_ROUTE = '/articles/';
export const FULL_ARTICLE_ROUTE = '/articles/:slug';
export const SIGNING_UP_ROUTE = '/sign-up/';
export const SIGNING_IN_ROUTE = '/sign-in/';
export const EDITING_PROFILE_ROUTE = '/profile/';
export const NEW_ARTICLE_ROUTE = '/new-article/';
export const EDITING_ARTICLE_ROUTE = '/articles/:slug/edit/';
export const NOT_FOUND_PAGE_ROUTE = '*';
export const NO_PHOTO = '../images/noPhoto.png';

const ARTICLES_COUNT_PER_PAGE = 5;

export const USER_EMAIL_VALIDATION = {
	required: 'This field is required.',
	pattern: {
		value: /^[a-z\d]{2,}@[a-z]{2,}\.[a-z]{2,}$/,
		message: 'You should use correct email address.',
	},
};

export const USER_PASSWORD_VALIDATION = {
	minLength: { value: 6, message: 'Your password needs to be at least 6 characters.' },
	maxLength: { value: 40, message: 'Your password needs to be no longer than 40 characters.' },
	pattern: {
		value: /^[a-zA-Z]\w*$/,
		message: 'The first character must be an English letter, followed by numbers or English letters.',
	},
};

export const newArticleFieldValidation = (fieldName, fieldLength) => {
	const validation = {
		minLength: { value: 1, message: `Your ${fieldName} needs to be at least 1 character.` },
		pattern: {
			value: /\S+/,
			message: 'This field cannot contain only whitespace characters.',
		},
	};
	if (!fieldLength) return validation;

	return {
		...validation,
		maxLength: { value: fieldLength, message: `Your title needs to be no longer than ${fieldLength} characters.` },
	};
};

export const changePage = (page, articles, articlesCount) => ({
	type: CHANGE_PAGE,
	page,
	articles,
	articlesCount,
	ARTICLES_COUNT_PER_PAGE,
});

export const showArticle = (article) => {
	return {
		type: SHOW_ARTICLE,
		article,
	};
};

export const validateCreatingAccForm = (formField, errs) => ({
	type: CREATE_ACC,
	formField,
	errs,
});

export const validateSigningInForm = (formField, errs) => ({
	type: SIGN_IN,
	formField,
	errs,
});

export const validateEditingProfileForm = (formField, errs) => ({
	type: EDIT_PROFILE,
	formField,
	errs,
});

export const validateNewArticleForm = (formField, errs) => ({
	type: CREATE_ARTICLE,
	formField,
	errs,
});

export const getFormResponse = (response) => ({
	type: GET_FORM_RESPONSE,
	username: response.username,
	email: response.email,
	image: response.image,
	token: response.token,
});

const showErrorMessage = (errs) => ({
	type: SHOW_ERROR_MESSAGE,
	errs,
});

export const fetchArticles =
	(page, token = '') =>
	(dispatch) =>
		blogPlatformService.fetchingArticles(page, token, ARTICLES_COUNT_PER_PAGE).then(
			(json) => dispatch(changePage(page, json.articles, json.articlesCount)),
			() => dispatch(showErrorMessage())
		);

export const fetchFullArticle =
	(article, slug, token = '') =>
	(dispatch) =>
		article
			? dispatch(showArticle(article))
			: blogPlatformService.fetchingFullArticle(slug, token).then(
					(article) => {
						dispatch(showArticle(article));
						return article;
					},
					() => dispatch(showErrorMessage())
			  );

export const sendCreatingAccForm = (values, page, navigate, goTo, createLocalStorage) => (dispatch) =>
	blogPlatformService.sendingCreatingAccForm(values).then(
		(json) => {
			if (json.errors) return dispatch(validateCreatingAccForm(null, json.errors));
			onSuccessSubmit(dispatch, page, navigate, goTo, null);
			json.user.password = values.user.password;
			createLocalStorage('loggedIn', JSON.stringify(json.user));
			return dispatch(getFormResponse(json.user));
		},
		() => dispatch(showErrorMessage())
	);

export const sendSigningInForm = (values, page, navigate, goTo, createLocalStorage) => (dispatch) =>
	blogPlatformService.sendingSigningInForm(values).then(
		(json) => {
			if (json.errors) return dispatch(validateSigningInForm(null, json.errors));
			onSuccessSubmit(dispatch, page, navigate, goTo, null);
			json.user.password = values.user.password;
			createLocalStorage('loggedIn', JSON.stringify(json.user));
			return dispatch(getFormResponse(json.user));
		},
		() => dispatch(showErrorMessage())
	);

export const sendEditingProfileForm = (values, page, navigate, goTo, createLocalStorage, token) => (dispatch) =>
	blogPlatformService.sendingEditingProfileForm(values, token).then(
		(json) => {
			if (json.errors) return dispatch(validateEditingProfileForm(null, json.errors));
			onSuccessSubmit(dispatch, page, navigate, goTo, null, token);
			json.user.password = values.user.password;
			createLocalStorage('loggedIn', JSON.stringify(json.user));
			return dispatch(getFormResponse(json.user));
		},
		() => dispatch(showErrorMessage())
	);

export const sendNewArticleForm = (values, method, page, navigate, goTo, slug, token) => (dispatch) =>
	blogPlatformService.sendingNewArticleForm(values, method, slug, token).then(
		(resp) => {
			if (resp === 'success') return onSuccessSubmit(dispatch, page, navigate, goTo, slug, token);
			dispatch(validateNewArticleForm(null, resp));
		},
		() => dispatch(showErrorMessage())
	);

export const deleteArticle = (page, navigate, goTo, slug, token) => (dispatch) =>
	blogPlatformService.deletingArticle(slug, token).then(
		() => onSuccessSubmit(dispatch, page, navigate, goTo),
		() => dispatch(showErrorMessage())
	);

export const favoriteActicle = (page, slug, token) => (dispatch) =>
	blogPlatformService.favoritingActicle(slug, token).then(
		() => onSuccessSubmit(dispatch, page, null, null, slug, token),
		() => dispatch(showErrorMessage())
	);

export const unfavoriteActicle = (page, slug, token) => (dispatch) =>
	blogPlatformService.unfavoritingActicle(slug, token).then(
		() => onSuccessSubmit(dispatch, page, null, null, slug, token),
		() => dispatch(showErrorMessage())
	);

export const checkToken = (token, email, password) => (dispatch) =>
	blogPlatformService.checkingToken(token, email, password).then(
		(token) => token,
		() => dispatch(showErrorMessage())
	);

export const onSuccessSubmit = (dispatch, page, navigate, goTo, slug, token) => {
	if (page || token) dispatch(fetchArticles(page, token));
	if (slug) dispatch(fetchFullArticle(null, slug, token));
	if (navigate) navigate(goTo);
};
