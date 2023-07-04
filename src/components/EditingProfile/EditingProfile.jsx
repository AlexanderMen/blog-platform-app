import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import {
	validateEditingProfileForm,
	sendEditingProfileForm,
	ARTICLES_ROUTE,
	USER_EMAIL_VALIDATION,
	USER_PASSWORD_VALIDATION,
} from '../../actions';
import BlogPlatformService from '../../services/BlogPlatformService';

import classes from './EditingProfile.module.scss';

const EditingProfile = ({
	editingProfile,
	gettingFormResponse,
	validateEditingProfileForm,
	sendEditingProfileForm,
}) => {
	const { userName, userEmail, newPassword, avatarImg, errs } = editingProfile;
	let { username: name, email, token } = gettingFormResponse;
	const { createLocalStorage, getItemFromLocalStorage } = new BlogPlatformService();
	const loggedIn = getItemFromLocalStorage('loggedIn');

	if (!name && loggedIn) {
		const loggedInValues = JSON.parse(loggedIn);
		name = loggedInValues.username;
		email = loggedInValues.email;
		token = loggedInValues.token;
	}

	useEffect(() => {
		if (name && email) validateEditingProfileForm({ userName: name, userEmail: email });
	}, []);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		mode: 'onBlur',
		defaultValues: {
			userName: name,
			userEmail: email,
		},
	});

	const formSubmit = () => {
		let values = {
			user: {
				email: userEmail,
				username: userName,
			},
		};
		if (newPassword) values.user.password = newPassword;
		if (avatarImg) values.user.image = avatarImg;
		reset();
		sendEditingProfileForm(values, 1, navigate, ARTICLES_ROUTE, createLocalStorage, token);
	};

	const onInputChange = (evt) => validateEditingProfileForm({ [evt.target.id]: evt.target.value });

	return (
		<form className={classes.editingProfile} onSubmit={handleSubmit(formSubmit)}>
			<h1 className={classes.editingProfile__header}>Edit Profile</h1>
			<label className={classes.editingProfile__label} htmlFor="userName">
				<span className={classes.editingProfile__labelText}>Username</span>
				<input
					className={classes.editingProfile__input}
					type="text"
					id="userName"
					{...register('userName', { required: 'This field is required.' })}
					placeholder="Username"
					value={userName}
					onChange={(evt) => onInputChange(evt)}
				/>
				{errors.userName && <div className={classes.editingProfile__inputErr}>{errors.userName.message}</div>}
				{errs?.username && <div className={classes.editingProfile__inputErr}>username {errs.username}</div>}
			</label>
			<label className={classes.editingProfile__label}>
				<span className={classes.editingProfile__labelText}>Email address</span>
				<input
					className={classes.editingProfile__input}
					type="email"
					id="userEmail"
					{...register('userEmail', USER_EMAIL_VALIDATION)}
					placeholder="Email address"
					value={userEmail}
					onChange={(evt) => onInputChange(evt)}
				/>
				{errors.userEmail && <div className={classes.editingProfile__inputErr}>{errors.userEmail.message}</div>}
				{errs?.email && <div className={classes.editingProfile__inputErr}>email {errs.email}</div>}
			</label>
			<label className={classes.editingProfile__label}>
				<span className={classes.editingProfile__labelText}>New password</span>
				<input
					className={classes.editingProfile__input}
					type="password"
					id="newPassword"
					{...register('newPassword', USER_PASSWORD_VALIDATION)}
					placeholder="New password"
					value={newPassword}
					onChange={(evt) => onInputChange(evt)}
				/>
				{errors.newPassword && <div className={classes.editingProfile__inputErr}>{errors.newPassword.message}</div>}
			</label>
			<label className={classes.editingProfile__label}>
				<span className={classes.editingProfile__labelText}>Avatar image (url)</span>
				<input
					className={classes.editingProfile__input}
					type="url"
					id="avatarImg"
					{...register('avatarImg', {
						pattern: {
							value: /^((https?:\/\/www\.)|(www\.)|(https?:\/\/))[a-zA-Z0-9._-]+\.[a-zA-Z.]{2,5}[/\w._-]*$/,
							message: 'You should use correct url.',
						},
					})}
					placeholder="Avatar image"
					value={avatarImg}
					onChange={(evt) => onInputChange(evt)}
				/>
				{errors.avatarImg && <div className={classes.editingProfile__inputErr}>{errors.avatarImg.message}</div>}
			</label>
			<div className={classes.editingProfile__btnWrapper}>
				<input type="submit" className={classes.editingProfile__btn} value="Save" />
			</div>
		</form>
	);
};

const mapStateToProps = ({ editingProfile, gettingFormResponse }) => ({ editingProfile, gettingFormResponse });

export default connect(mapStateToProps, { validateEditingProfileForm, sendEditingProfileForm })(EditingProfile);
