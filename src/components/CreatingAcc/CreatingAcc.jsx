import React from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import {
	validateCreatingAccForm,
	sendCreatingAccForm,
	ARTICLES_ROUTE,
	SIGNING_IN_ROUTE,
	USER_EMAIL_VALIDATION,
	USER_PASSWORD_VALIDATION,
} from '../../actions';
import BlogPlatformService from '../../services/BlogPlatformService';

import classes from './CreatingAcc.module.scss';

const CreatingAcc = ({ page, creatingAcc, validateCreatingAccForm, sendCreatingAccForm }) => {
	const { userName, userEmail, password, repeatPassword, checkbox, errs } = creatingAcc;
	const navigate = useNavigate();
	const location = useLocation();
	const { createLocalStorage } = new BlogPlatformService();

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
				username: userName,
				email: userEmail,
				password,
			},
		};
		reset();
		sendCreatingAccForm(values, page, navigate, goTo, createLocalStorage);
	};

	const onInputChange = (evt) => {
		const id = evt.target.id;
		let value = evt.target.value;
		if (id === 'checkbox') value = evt.target.checked;
		validateCreatingAccForm({ [id]: value });
	};

	return (
		<form className={classes.creatingAcc} onSubmit={handleSubmit(formSubmit)}>
			<h1 className={classes.creatingAcc__header}>Create new account</h1>
			<label className={classes.creatingAcc__label} htmlFor="userName">
				<span className={classes.creatingAcc__labelText}>Username</span>
				<input
					className={classes.creatingAcc__input}
					type="text"
					id="userName"
					{...register('userName', {
						required: 'This field is required.',
						minLength: { value: 3, message: 'Your username needs to be at least 3 characters.' },
						maxLength: { value: 20, message: 'Your username needs to be no longer than 20 characters.' },
						pattern: {
							value: /^[a-z][a-z0-9]*$/,
							message:
								'The first character must be a lowercase English letter, followed by numbers or English letters.',
						},
					})}
					placeholder="Username"
					value={userName}
					onChange={(evt) => onInputChange(evt)}
				/>
				{errors.userName && <div className={classes.creatingAcc__inputErr}>{errors.userName.message}</div>}
				{errs?.username && <div className={classes.creatingAcc__inputErr}>username {errs.username}</div>}
			</label>
			<label className={classes.creatingAcc__label} htmlFor="userEmail">
				<span className={classes.creatingAcc__labelText}>Email address</span>
				<input
					className={classes.creatingAcc__input}
					type="email"
					id="userEmail"
					{...register('userEmail', USER_EMAIL_VALIDATION)}
					placeholder="Email address"
					value={userEmail}
					onChange={(evt) => onInputChange(evt)}
				/>
				{errors.userEmail && <div className={classes.creatingAcc__inputErr}>{errors.userEmail.message}</div>}
				{errs?.email && <div className={classes.creatingAcc__inputErr}>email {errs.email}</div>}
			</label>
			<label className={classes.creatingAcc__label} htmlFor="password">
				<span className={classes.creatingAcc__labelText}>Password</span>
				<input
					className={classes.creatingAcc__input}
					type="password"
					id="password"
					{...register('password', { ...USER_PASSWORD_VALIDATION, required: 'This field is required.' })}
					placeholder="Password"
					value={password}
					onChange={(evt) => onInputChange(evt)}
				/>
				{errors.password && <div className={classes.creatingAcc__inputErr}>{errors.password.message}</div>}
			</label>
			<label className={classes.creatingAcc__label} htmlFor="repeatPassword">
				<span className={classes.creatingAcc__labelText}>Repeat Password</span>
				<input
					className={classes.creatingAcc__input}
					type="password"
					id="repeatPassword"
					{...register('repeatPassword', {
						required: 'This field is required.',
						validate: (repeatPassword, formValues) => repeatPassword === formValues.password || 'Passwords must match',
					})}
					placeholder="Password"
					value={repeatPassword}
					onChange={(evt) => onInputChange(evt)}
				/>
				{errors.repeatPassword && <div className={classes.creatingAcc__inputErr}>{errors.repeatPassword.message}</div>}
			</label>
			<label className={classes.creatingAcc__checkboxLabel} htmlFor="checkbox">
				<div className={classes.creatingAcc__checkboxInputWrap}>
					<input
						className={classes.creatingAcc__inputCheckbox}
						type="checkbox"
						id="checkbox"
						{...register('checkbox', {
							validate: (checkbox) => checkbox || 'You must agree to the processing of your personal information',
						})}
						checked={checkbox}
						onChange={(evt) => onInputChange(evt)}
					/>
					<span className={classes.creatingAcc__checkboxLabelText}>
						I agree to the processing of my personal information
					</span>
				</div>
				{errors.checkbox && <div className={classes.creatingAcc__inputErr}>{errors.checkbox.message}</div>}
			</label>
			<div className={classes.creatingAcc__btnWrapper}>
				<input type="submit" className={classes.creatingAcc__btn} value="Create" />
			</div>
			<footer className={classes.creatingAcc__footer}>
				<span className={classes.creatingAcc__footerSpan}>
					Already have an account?
					<Link to={SIGNING_IN_ROUTE} className={classes.creatingAcc__footerLink}>
						{} Sign In
					</Link>
					.
				</span>
			</footer>
		</form>
	);
};

const mapStateToProps = ({ changingPage, creatingAcc }) => ({
	creatingAcc,
	page: changingPage.page,
});

export default connect(mapStateToProps, { validateCreatingAccForm, sendCreatingAccForm })(CreatingAcc);
