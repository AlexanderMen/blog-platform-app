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

export const changePage = (page, articles, articlesCount) => ({
	type: CHANGE_PAGE,
	page,
	articles,
	articlesCount,
});

export const showArticle = (article) => ({
	type: SHOW_ARTICLE,
	article,
});

export const validateForm = (formField, actionType, errs) => ({
	type: actionType,
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
		blogPlatformService.fetchingArticles(dispatch, changePage, page, showErrorMessage, token);

export const fetchFullArticle =
	(article, slug, token = '') =>
	(dispatch) =>
		article
			? dispatch(showArticle(article))
			: blogPlatformService.fetchingFullArticle(dispatch, showArticle, slug, showErrorMessage, token);

export const sendForm =
	(actionType, path, values, method, page, navigate, goTo, createLocalStorage, slug, token = '') =>
	(dispatch) =>
		blogPlatformService.sendingForm(
			dispatch,
			actionType,
			getFormResponse,
			validateForm,
			path,
			values,
			method,
			page,
			navigate,
			onSuccessSubmit,
			goTo,
			showErrorMessage,
			createLocalStorage,
			slug,
			token
		);

export const checkToken = (token, email, password) => (dispatch) =>
	blogPlatformService.checkingToken(dispatch, token, email, password, showErrorMessage);

export const onSuccessSubmit = (dispatch, page, navigate, goTo, slug, token) => {
	if (page || token) dispatch(fetchArticles(page, token));
	if (slug) dispatch(fetchFullArticle(null, slug, token));
	if (navigate) navigate(goTo);
};
