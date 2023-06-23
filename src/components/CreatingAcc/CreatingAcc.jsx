import React from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { validateForm, sendForm, CREATE_ACC } from '../../actions';
import { createLocalStorage } from '../App';

import classes from './CreatingAcc.module.scss';

const CreatingAcc = ({ page, creatingAcc, validateForm, sendForm }) => {
	const { userName, userEmail, password, repeatPassword, checkbox, errs } = creatingAcc;
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
				username: userName,
				email: userEmail,
				password,
			},
		};
		reset();
		sendForm(CREATE_ACC, 'users', values, 'POST', page, navigate, goTo, createLocalStorage, null);
	};

	const onInputChange = (evt) => {
		const id = evt.target.id;
		let value = evt.target.value;
		if (id === 'checkbox') value = evt.target.checked;
		validateForm({ [id]: value }, CREATE_ACC);
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
				{errors.userEmail && <div className={classes.creatingAcc__inputErr}>{errors.userEmail.message}</div>}
				{errs?.email && <div className={classes.creatingAcc__inputErr}>email {errs.email}</div>}
			</label>
			<label className={classes.creatingAcc__label} htmlFor="password">
				<span className={classes.creatingAcc__labelText}>Password</span>
				<input
					className={classes.creatingAcc__input}
					type="password"
					id="password"
					{...register('password', {
						required: 'This field is required.',
						minLength: { value: 6, message: 'Your password needs to be at least 6 characters.' },
						maxLength: { value: 40, message: 'Your password needs to be no longer than 40 characters.' },
						pattern: {
							value: /^[a-zA-Z]\w*$/,
							message: 'The first character must be an English letter, followed by numbers or English letters.',
						},
					})}
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
					<Link to="/sign-in/" className={classes.creatingAcc__footerLink}>
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

export default connect(mapStateToProps, { validateForm, sendForm })(CreatingAcc);
