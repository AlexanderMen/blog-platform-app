import React from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Avatar } from 'antd';

import { getFormResponse, validateForm, CREATE_ARTICLE } from '../../actions';

import classes from './Header.module.scss';

const Header = ({ gettingFormResponse, getFormResponse, validateForm }) => {
	let { username, image } = gettingFormResponse;
	const location = useLocation();
	const loggedIn = localStorage.getItem('loggedIn');
	if (!username && loggedIn) {
		const loggedInValues = JSON.parse(loggedIn);
		username = loggedInValues.username;
		image = loggedInValues.image;
	}

	const onLogout = () => {
		localStorage.clear();
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
				to="/sign-in/"
				state={{ from: location }}
				className={`${classes.mainHeader__btn} ${classes.mainHeader__link}`}
			>
				Sign In
			</Link>
			<Link
				to="/sign-up/"
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
				to="/new-article/"
				className={`${classes.mainHeader__btn} ${classes.mainHeader__link} ${classes.mainHeader__btn_bordered} ${classes.mainHeader__btn_little} ${classes.mainHeader__btn_green}`}
				onClick={() =>
					validateForm(
						{
							title: '',
							shortDescription: '',
							text: '',
							tags: [],
						},
						CREATE_ARTICLE
					)
				}
			>
				Create article
			</Link>
			<Link to="/profile/" className={`${classes.mainHeader__btn}  ${classes.mainHeader__link}`}>
				{username}
				<Avatar className={`${classes.mainHeader__userAvatar}`} size={44} src={image || '../images/noPhoto.png'} />
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
				<Link to="/articles/" className={classes.mainHeader__link}>
					Realworld Blog
				</Link>
			</h1>
			{username ? userHeader : guestHeader}
		</header>
	);
};

const mapStateToProps = ({ gettingFormResponse }) => ({ gettingFormResponse });

export default connect(mapStateToProps, { getFormResponse, validateForm })(Header);
