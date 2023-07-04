import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Tag } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { format } from 'date-fns';

import { ARTICLES_ROUTE, NO_PHOTO } from '../../actions';

import classes from './Article.module.scss';

const Article = ({ title, slug, favorited, favoritesCount, description, tagList, author, createdAt }) => {
	const { username, image } = author;
	const favoriteClass = favorited ? classes.article__like_favorited : null;
	const creationDate = format(new Date(createdAt), 'MMMM dd, yyyy');
	const tags = tagList?.map((tag, index) => (
		<Tag className={classes.article__tag} key={tag + title + index}>
			{tag}
		</Tag>
	));

	return (
		<li className={`${classes.article} ${classes.articlesList__item}`}>
			<div className={classes.article__col_left}>
				<h1 className={classes.article__header}>
					<Link to={`${ARTICLES_ROUTE}${slug}`} className={classes.article__headerLink}>
						{title}
					</Link>{' '}
					<HeartOutlined className={`${classes.article__like} ${favoriteClass}`} />
					<span className={classes.article__likesCount}>{favoritesCount}</span>
				</h1>
				{tags}
				<article className={classes.article__description}>{description}</article>
			</div>
			<div className={classes.article__col_right}>
				<div className={classes.article__userNameAndDateWrap}>
					<div className={classes.article__userName}>{username}</div>
					<div className={classes.article__date}>{creationDate}</div>
				</div>
				<Avatar size={44} src={image || NO_PHOTO} />
			</div>
		</li>
	);
};

export default Article;
