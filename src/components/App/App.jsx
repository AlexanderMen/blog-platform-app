import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { fetchArticles, checkToken } from '../../actions';
import Header from '../Header';
import ArticlesList from '../ArticlesList';
import FullArticle from '../FullArticle';
import CreatingAcc from '../CreatingAcc';
import SigningIn from '../SigningIn';
import EditingProfile from '../EditingProfile';
import NewArticle from '../NewArticle';
import { RequireAuth } from '../hoc/RequireAuth';
import ErrorMessage from '../ErrorMessage';

import classes from './App.module.scss';

const App = ({ isErrorMessage, page, fetchArticles, checkToken }) => {
	useEffect(() => {
		const loggedIn = localStorage.getItem('loggedIn');
		const localStoragePage = +localStorage.getItem('page') || page;
		if (loggedIn) {
			const loggedInValues = JSON.parse(loggedIn);
			const { email, token, password } = loggedInValues;
			checkToken(token, email, password).then((newToken) => {
				if (token !== newToken) {
					loggedInValues.token = newToken;
					localStorage.setItem('loggedIn', JSON.stringify(loggedInValues));
				}
				fetchArticles(localStoragePage, loggedInValues.token);
			});
		}
		if (!loggedIn) fetchArticles(localStoragePage);
	}, []);

	const err = (
		<section className={classes.contentWrapper}>
			<ErrorMessage message="Something goes wrong..." description="Something goes wrong, try again..." />
		</section>
	);

	const content = (
		<section className={classes.contentWrapper}>
			<Routes>
				<Route path="/" element={<ArticlesList />} />
				<Route path="/articles/" element={<ArticlesList />} />
				<Route path="/articles/:slug" element={<FullArticle />} />
				<Route path="/sign-up/" element={<CreatingAcc />} />
				<Route path="/sign-in/" element={<SigningIn />} />
				<Route path="/profile/" element={<EditingProfile />} />
				<Route
					path="/new-article/"
					element={
						<RequireAuth>
							<NewArticle />
						</RequireAuth>
					}
				/>
				<Route
					path="/articles/:slug/edit/"
					element={
						<RequireAuth>
							<NewArticle />
						</RequireAuth>
					}
				/>
			</Routes>
		</section>
	);

	return (
		<div className={classes.mainWrapper}>
			<Header />
			{isErrorMessage ? err : content}
		</div>
	);
};

const mapStateToProps = ({ error, changingPage }) => ({
	isErrorMessage: error.err,
	message: error.message,
	page: changingPage.page,
	articles: changingPage.articles,
});

export default connect(mapStateToProps, { fetchArticles, checkToken })(App);

export const createLocalStorage = (key, value) => localStorage.setItem(key, value);
