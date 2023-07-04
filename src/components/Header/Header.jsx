import React from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Avatar } from 'antd';

import {
	getFormResponse,
	validateNewArticleForm,
	ARTICLES_ROUTE,
	SIGNING_IN_ROUTE,
	SIGNING_UP_ROUTE,
	NEW_ARTICLE_ROUTE,
	EDITING_PROFILE_ROUTE,
	NO_PHOTO,
} from '../../actions';
import BlogPlatformService from '../../services/BlogPlatformService';

import classes from './Header.module.scss';

const Header = ({ gettingFormResponse, getFormResponse, validateNewArticleForm }) => {
	let { username, image } = gettingFormResponse;
	const location = useLocation();
	const { getItemFromLocalStorage, clearLocalStorage } = new BlogPlatformService();

	const loggedIn = getItemFromLocalStorage('loggedIn');
	if (!username && loggedIn) {
		const loggedInValues = JSON.parse(loggedIn);
		username = loggedInValues.username;
		image = loggedInValues.image;
	}

	const onLogout = () => {
		clearLocalStorage();
		getFormResponse({
			username: '',
			email: '',
			image: '',
			token: '',
		});
	};

	const guestHeader = (
		<div className={classes.mainHeader__btnGroup}>
			<Link
				to={SIGNING_IN_ROUTE}
				state={{ from: location }}
				className={`${classes.mainHeader__btn} ${classes.mainHeader__link}`}
			>
				Sign In
			</Link>
			<Link
				to={SIGNING_UP_ROUTE}
				state={{ from: location }}
				className={`${classes.mainHeader__btn} ${classes.mainHeader__link} ${classes.mainHeader__btn_bordered} ${classes.mainHeader__btn_green}`}
			>
				Sign Up
			</Link>
		</div>
	);

	const userHeader = (
		<div className={classes.mainHeader__btnGroup}>
			<Link
				to={NEW_ARTICLE_ROUTE}
				className={`${classes.mainHeader__btn} ${classes.mainHeader__link} ${classes.mainHeader__btn_bordered} ${classes.mainHeader__btn_little} ${classes.mainHeader__btn_green}`}
				onClick={() =>
					validateNewArticleForm({
						title: '',
						shortDescription: '',
						text: '',
						tags: [],
					})
				}
			>
				Create article
			</Link>
			<Link to={EDITING_PROFILE_ROUTE} className={`${classes.mainHeader__btn}  ${classes.mainHeader__link}`}>
				{username}
				<Avatar className={`${classes.mainHeader__userAvatar}`} size={44} src={image || NO_PHOTO} />
			</Link>
			<button
				type="button"
				className={`${classes.mainHeader__btn} ${classes.mainHeader__link} ${classes.mainHeader__btn_bordered}`}
				onClick={onLogout}
			>
				Log Out
			</button>
		</div>
	);

	return (
		<header className={classes.mainHeader}>
			<h1 className={classes.mainHeader__h1}>
				<Link to={ARTICLES_ROUTE} className={classes.mainHeader__link}>
					Realworld Blog
				</Link>
			</h1>
			{username ? userHeader : guestHeader}
		</header>
	);
};

const mapStateToProps = ({ gettingFormResponse }) => ({ gettingFormResponse });

export default connect(mapStateToProps, { getFormResponse, validateNewArticleForm })(Header);
