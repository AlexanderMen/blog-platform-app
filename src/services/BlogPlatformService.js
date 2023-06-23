export default class BlogPlatformService {
	async fetchingArticles(dispatch, changePage, page, showErrorMessage, token) {
		try {
			const offset = 5 * (page - 1);
			const response = await fetch(`https://blog.kata.academy/api/articles?limit=5&offset=${offset}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
			});
			const json = await response.json();
			return dispatch(changePage(page, json.articles, json.articlesCount));
		} catch (err) {
			dispatch(showErrorMessage());
		}
	}

	async fetchingFullArticle(dispatch, showArticle, slug, showErrorMessage, token) {
		try {
			const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
			});
			const json = await response.json();
			dispatch(showArticle(json.article));
			return json.article;
		} catch (err) {
			dispatch(showErrorMessage());
		}
	}

	async sendingForm(
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
	) {
		try {
			let headers = { Authorization: `Token ${token}` };
			if (method !== 'DELETE' && !path.includes('favorite'))
				headers = { ...headers, 'Content-Type': 'application/json' };
			const response = await fetch(`https://blog.kata.academy/api/${path}`, {
				method,
				headers,
				body: JSON.stringify(values),
			});

			if (method === 'DELETE' && path.includes('favorite'))
				return onSuccessSubmit(dispatch, page, navigate, goTo, slug, token);
			if (method === 'DELETE' && response.status) return onSuccessSubmit(dispatch, page, navigate, goTo);
			const json = await response.json();
			if (response.status === 422) return dispatch(validateForm(null, actionType, json.errors));
			onSuccessSubmit(dispatch, page, navigate, goTo, slug, token);

			if (path.includes('articles')) return;

			json.user.password = values.user.password;
			createLocalStorage('loggedIn', JSON.stringify(json.user));
			return dispatch(getFormResponse(json.user));
		} catch (err) {
			dispatch(showErrorMessage());
		}
	}

	async checkingToken(dispatch, token, email, password, showErrorMessage) {
		try {
			const response = await fetch('https://blog.kata.academy/api/user', {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
			});
			if (response.status === 401 || response.status === 422) {
				const response = await fetch('https://blog.kata.academy/api/users/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						user: {
							email,
							password,
						},
					}),
				});
				const json = await response.json();
				return json.user.token;
			}
			return token;
		} catch (err) {
			dispatch(showErrorMessage());
		}
	}
}
