import React from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import {
	validateSigningInForm,
	sendSigningInForm,
	ARTICLES_ROUTE,
	SIGNING_UP_ROUTE,
	USER_EMAIL_VALIDATION,
} from '../../actions';
import BlogPlatformService from '../../services/BlogPlatformService';

import classes from './SigningIn.module.scss';

const SigningIn = ({ page, signingIn, validateSigningInForm, sendSigningInForm }) => {
	const { userEmail, password, errs } = signingIn;
	const { createLocalStorage } = new BlogPlatformService();
	const navigate = useNavigate();
	const location = useLocation();
	const goTo = location.state?.from?.pathname || ARTICLES_ROUTE;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		mode: 'onBlur',
	});

	const formSubmit = () => {
		const values = {
			user: {
				email: userEmail,
				password,
			},
		};
		reset();
		sendSigningInForm(values, page, navigate, goTo, createLocalStorage);
	};

	const onInputChange = (evt) => validateSigningInForm({ [evt.target.id]: evt.target.value });

	return (
		<form className={classes.signingIn} onSubmit={handleSubmit(formSubmit)}>
			<h1 className={classes.signingIn__header}>Sign In</h1>
			<label className={classes.signingIn__label} htmlFor="userEmail">
				<span className={classes.signingIn__labelText}>Email address</span>
				<input
					className={classes.signingIn__input}
					type="email"
					id="userEmail"
					{...register('userEmail', USER_EMAIL_VALIDATION)}
					placeholder="Email address"
					value={userEmail}
					onChange={(evt) => onInputChange(evt)}
				/>
				{errors.userEmail && <div className={classes.signingIn__inputErr}>{errors.userEmail.message}</div>}
				{errs && <div className={classes.signingIn__inputErr}>email or password is invalid</div>}
			</label>
			<label className={classes.signingIn__label} htmlFor="password">
				<span className={classes.signingIn__labelText}>Password</span>
				<input
					className={classes.signingIn__input}
					type="password"
					id="password"
					{...register('password', { required: 'This field is required.' })}
					placeholder="Password"
					value={password}
					onChange={(evt) => onInputChange(evt)}
				/>
				{errors.password && <div className={classes.signingIn__inputErr}>{errors.password.message}</div>}
				{errs && <div className={classes.signingIn__inputErr}>email or password is invalid</div>}
			</label>
			<div className={classes.signingIn__btnWrapper}>
				<input type="submit" className={classes.signingIn__btn} value="Login" />
			</div>
			<footer className={classes.signingIn__footer}>
				<span className={classes.signingIn__footerSpan}>
					Don’t have an account?
					<Link to={SIGNING_UP_ROUTE} className={classes.signingIn__footerLink}>
						{} Sign Up
					</Link>
					.
				</span>
			</footer>
		</form>
	);
};

const mapStateToProps = ({ changingPage, signingIn }) => ({
	signingIn,
	page: changingPage.page,
});

export default connect(mapStateToProps, { validateSigningInForm, sendSigningInForm })(SigningIn);
