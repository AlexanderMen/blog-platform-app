import React from 'react';
import { connect } from 'react-redux';
import { Spin, Pagination, ConfigProvider } from 'antd';

import { fetchArticles } from '../../actions';
import Article from '../Article';
import BlogPlatformService from '../../services/BlogPlatformService';

import classes from './ArticlesList.module.scss';

const ArticlesList = ({ articles, page, totalPages, error, fetchArticles }) => {
	const { createLocalStorage, getItemFromLocalStorage } = new BlogPlatformService();
	const localStoragePage = +getItemFromLocalStorage('page') || page;

	const articlesList = articles.map((article) => {
		const { title, slug, description, tagList, favorited, favoritesCount, author, createdAt } = article;
		return (
			<Article
				key={slug}
				title={title}
				slug={slug}
				description={description}
				tagList={tagList}
				favorited={favorited}
				favoritesCount={favoritesCount}
				author={author}
				createdAt={createdAt}
			/>
		);
	});

	return (
		<div>
			<ul className={classes.articlesList}>
				{!articles.length && !error ? (
					<Spin size="large" tip="Loading articles..." className={classes.spinner} />
				) : (
					articlesList
				)}
			</ul>
			<footer className={classes.paginationWrapper}>
				<ConfigProvider
					theme={{
						token: {
							colorBgContainer: '#1890ff',
							colorPrimary: '#ffffff',
							colorPrimaryBorder: '#1890ff',
							fontFamily: 'Inter, sans-serif',
							fontSize: 12,
						},
					}}
				>
					<Pagination
						current={page || localStoragePage}
						onChange={(page) => {
							createLocalStorage('page', page);
							fetchArticles(page, JSON.parse(localStorage.getItem('loggedIn'))?.token);
						}}
						total={totalPages * 10}
					/>
				</ConfigProvider>
			</footer>
		</div>
	);
};

const mapStateToProps = ({ error, changingPage }) => ({
	articles: changingPage.articles,
	page: changingPage.page,
	totalPages: changingPage.totalPages,
	error: error.err,
});

export default connect(mapStateToProps, { fetchArticles })(ArticlesList);
