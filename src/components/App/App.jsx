import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import {
	fetchArticles,
	checkToken,
	HOME_ROUTE,
	ARTICLES_ROUTE,
	FULL_ARTICLE_ROUTE,
	SIGNING_UP_ROUTE,
	SIGNING_IN_ROUTE,
	EDITING_PROFILE_ROUTE,
	NEW_ARTICLE_ROUTE,
	EDITING_ARTICLE_ROUTE,
	NOT_FOUND_PAGE_ROUTE,
} from '../../actions';
import Header from '../Header';
import ArticlesList from '../ArticlesList';
import FullArticle from '../FullArticle';
import CreatingAcc from '../CreatingAcc';
import SigningIn from '../SigningIn';
import EditingProfile from '../EditingProfile';
import NewArticle from '../NewArticle';
import NotFoundPage from '../NotFoundPage';
import { RequireAuth } from '../hoc/RequireAuth';
import { HidePagesWhenAuth } from '../hoc/HidePagesWhenAuth';
import ErrorMessage from '../ErrorMessage';
import BlogPlatformService from '../../services/BlogPlatformService';

import classes from './App.module.scss';

const App = ({ isErrorMessage, page, fetchArticles, checkToken }) => {
	const { createLocalStorage, getItemFromLocalStorage } = new BlogPlatformService();

	useEffect(() => {
		const loggedIn = getItemFromLocalStorage('loggedIn');
		const localStoragePage = +getItemFromLocalStorage('page') || page;
		if (loggedIn) {
			const loggedInValues = JSON.parse(loggedIn);
			const { email, token, password } = loggedInValues;
			checkToken(token, email, password).then((newToken) => {
				if (token !== newToken) {
					loggedInValues.token = newToken;
					createLocalStorage('loggedIn', JSON.stringify(loggedInValues));
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
				<Route path={HOME_ROUTE} element={<ArticlesList />} />
				<Route path={ARTICLES_ROUTE} element={<ArticlesList />} />
				<Route path={FULL_ARTICLE_ROUTE} element={<FullArticle />} />
				<Route
					path={SIGNING_UP_ROUTE}
					element={
						<HidePagesWhenAuth>
							<CreatingAcc />
						</HidePagesWhenAuth>
					}
				/>
				<Route
					path={SIGNING_IN_ROUTE}
					element={
						<HidePagesWhenAuth>
							<SigningIn />
						</HidePagesWhenAuth>
					}
				/>
				<Route path={EDITING_PROFILE_ROUTE} element={<EditingProfile />} />
				<Route
					path={NEW_ARTICLE_ROUTE}
					element={
						<RequireAuth>
							<NewArticle />
						</RequireAuth>
					}
				/>
				<Route
					path={EDITING_ARTICLE_ROUTE}
					element={
						<RequireAuth>
							<NewArticle />
						</RequireAuth>
					}
				/>
				<Route path={NOT_FOUND_PAGE_ROUTE} element={<NotFoundPage />} />
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
