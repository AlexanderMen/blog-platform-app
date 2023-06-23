import React from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { validateForm, sendForm, SIGN_IN } from '../../actions';
import { createLocalStorage } from '../App';

import classes from './SigningIn.module.scss';

const SigningIn = ({ page, signingIn, validateForm, sendForm }) => {
	const { userEmail, password, errs } = signingIn;
	const navigate = useNavigate();
	const location = useLocation();

	const goTo = location.state?.from?.pathname || '/articles/';

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
		sendForm(SIGN_IN, 'users/login', values, 'POST', page, navigate, goTo, createLocalStorage, null);
	};

	const onInputChange = (evt) => validateForm({ [evt.target.id]: evt.target.value }, SIGN_IN);

	return (
		<form className={classes.signingIn} onSubmit={handleSubmit(formSubmit)}>
			<h1 className={classes.signingIn__header}>Sign In</h1>
			<label className={classes.signingIn__label} htmlFor="userEmail">
				<span className={classes.signingIn__labelText}>Email address</span>
				<input
					className={classes.signingIn__input}
					type="email"
					id="userEmail"
					{...register('userEmail', {
						required: 'This field is required.',
						pattern: {
							value: /^[a-z\d]{2,}@[a-z]{2,}\.[a-z]{2,}$/,
							message: 'You should use correct email address.',
						},
					})}
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
					<Link to="/sign-up/" className={classes.signingIn__footerLink}>
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

export default connect(mapStateToProps, { validateForm, sendForm })(SigningIn);
