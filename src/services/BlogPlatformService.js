export default class BlogPlatformService {
	baseURL = 'https://blog.kata.academy/api/';

	createLocalStorage = (key, value) => localStorage.setItem(key, value);

	getItemFromLocalStorage = (item) => localStorage.getItem(item);

	clearLocalStorage = () => localStorage.clear();

	async fetchingArticles(page, token, ARTICLES_COUNT_PER_PAGE) {
		try {
			const searchParams = new URLSearchParams('limit=5');
			const offset = ARTICLES_COUNT_PER_PAGE * (page - 1);
			searchParams.append('offset', offset);
			const response = await fetch(`${this.baseURL}articles?${searchParams}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
			});
			return await response.json();
		} catch (err) {
			return err;
		}
	}

	async fetchingFullArticle(slug, token) {
		try {
			const response = await fetch(`${this.baseURL}articles/${slug}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
			});
			if (response.status === 404) return { notFoundPage: true };
			const json = await response.json();
			return json.article;
		} catch (err) {
			return err;
		}
	}

	async sendingCreatingAccForm(values) {
		try {
			const response = await fetch(`${this.baseURL}users`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			});
			const json = await response.json();
			if (response.status === 422) return json;
			return json;
		} catch (err) {
			return err;
		}
	}

	async sendingSigningInForm(values) {
		try {
			const response = await fetch(`${this.baseURL}users/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			});
			const json = await response.json();
			if (response.status === 422) return json;
			return json;
		} catch (err) {
			return err;
		}
	}

	async sendingEditingProfileForm(values, token) {
		try {
			const response = await fetch(`${this.baseURL}user`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
				body: JSON.stringify(values),
			});
			const json = await response.json();
			if (response.status === 422) return json;
			return json;
		} catch (err) {
			return err;
		}
	}

	async sendingNewArticleForm(values, method, slug, token) {
		try {
			const response = await fetch(`${this.baseURL}articles/${slug}`, {
				method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
				body: JSON.stringify(values),
			});
			const json = await response.json();
			if (response.status === 422) return json.errors;
			return 'success';
		} catch (err) {
			return err;
		}
	}

	async deletingArticle(slug, token) {
		try {
			const response = await fetch(`${this.baseURL}articles/${slug}`, {
				method: 'DELETE',
				headers: { Authorization: `Token ${token}` },
			});
			if (response.status) return;
		} catch (err) {
			return err;
		}
	}

	async favoritingActicle(slug, token) {
		try {
			await fetch(`${this.baseURL}articles/${slug}/favorite/`, {
				method: 'POST',
				headers: { Authorization: `Token ${token}` },
			});
		} catch (err) {
			return err;
		}
	}

	async unfavoritingActicle(slug, token) {
		try {
			await fetch(`${this.baseURL}articles/${slug}/favorite/`, {
				method: 'DELETE',
				headers: { Authorization: `Token ${token}` },
			});
		} catch (err) {
			return err;
		}
	}

	async checkingToken(token, email, password) {
		try {
			const response = await fetch(`${this.baseURL}user`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
			});
			if (response.status === 401 || response.status === 422) {
				const response = await fetch(`${this.baseURL}users/login`, {
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
			return err;
		}
	}
}
