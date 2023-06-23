import React from 'react';
import Markdown from 'markdown-to-jsx';
import { connect } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Avatar, Popconfirm, Spin, Tag } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { format } from 'date-fns';

import { fetchFullArticle, sendForm, CREATE_ARTICLE } from '../../actions';

import classes from './FullArticle.module.scss';

const FullArticle = ({ article, articles, fetchFullArticle, page, sendForm, error }) => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const loggedIn = localStorage.getItem('loggedIn');
	const token = JSON.parse(loggedIn)?.token;
	let buttons;

	if (!article || article.slug !== slug) {
		const isStateHasArticle = articles.length ? articles.find((article) => article.slug === slug) : null;
		fetchFullArticle(isStateHasArticle, slug, token);
	}

	if (!article && !error) return <Spin size="large" tip="Loading article..." className={classes.spinner} />;

	const { title, description, tagList, favorited, favoritesCount, author, createdAt, body } = article;

	const creationDate = format(new Date(createdAt), 'MMMM dd, yyyy');
	const tags = tagList?.map((tag, index) => (
		<Tag className={classes.fullArticle__tag} key={tag + title + index}>
			{tag}
		</Tag>
	));

	const favoriteClass = favorited ? classes.fullArticle__like_favorited : null;
	if (loggedIn && author.username === JSON.parse(loggedIn).username) {
		buttons = (
			<div className={classes.fullArticle__buttonsWrapper}>
				<Popconfirm
					placement="rightTop"
					description="Are you sure to delete this article?"
					onConfirm={() => {
						sendForm(
							CREATE_ARTICLE,
							`/articles/${slug}/`,
							null,
							'DELETE',
							page,
							navigate,
							'/articles/',
							null,
							null,
							token
						);
					}}
					onCancel={() => {}}
					okText="Yes"
					cancelText="No"
				>
					<button type="button" className={`${classes.fullArticle__button} ${classes.fullArticle__button_red}`}>
						Delete
					</button>
				</Popconfirm>
				<Link
					className={`${classes.fullArticle__button} ${classes.fullArticle__button_green}`}
					to={`/articles/${slug}/edit`}
				>
					Edit
				</Link>
			</div>
		);
	}

	return (
		<section className={`${classes.fullArticle}`}>
			<div className={`${classes.fullArticle__colsWrapper}`}>
				<div className={classes.fullArticle__col_left}>
					<h1 className={classes.fullArticle__header}>
						{title}
						{}
						<HeartOutlined
							className={`${classes.fullArticle__like} ${favoriteClass}`}
							onClick={() => {
								if (!token) return;
								if (favorited)
									return sendForm(
										null,
										`/articles/${slug}/favorite/`,
										null,
										'DELETE',
										page,
										null,
										null,
										null,
										slug,
										token
									);
								sendForm(null, `/articles/${slug}/favorite/`, null, 'POST', page, null, null, null, slug, token);
							}}
						/>
						<span className={classes.fullArticle__likesCount}>{favoritesCount}</span>
					</h1>
					{tags}
					<article className={classes.fullArticle__description}>{description}</article>
				</div>
				<div className={classes.fullArticle__col_right}>
					<div className={classes.fullArticle__userNameAndDateWrap}>
						<div className={classes.fullArticle__userName}>{author.username}</div>
						<div className={classes.fullArticle__date}>{creationDate}</div>
					</div>
					<Avatar size={44} src={author.image} />
					{loggedIn ? buttons : null}
				</div>
			</div>
			<div className={classes.fullArticle__body}>
				<Markdown>{body}</Markdown>
			</div>
		</section>
	);
};

const mapStateToProps = ({ changingPage, showingArticle, error }) => ({
	articles: changingPage.articles,
	article: showingArticle.article,
	page: changingPage.page,
	error: error.err,
});

export default connect(mapStateToProps, { fetchFullArticle, sendForm })(FullArticle);
