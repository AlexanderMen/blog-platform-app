import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Col, Row } from 'antd';

import { fetchFullArticle, validateForm, sendForm, CREATE_ARTICLE } from '../../actions';
import { createLocalStorage } from '../App';

import classes from './NewArticle.module.scss';

const NewArticle = ({ creatingArticle, fetchFullArticle, page, validateForm, sendForm, article, articles }) => {
	const { title, shortDescription, text, tags, errs } = creatingArticle;
	const { slug } = useParams();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm({
		mode: 'onBlur',
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'tags',
	});

	const fillingExistingInputs = (article) => {
		validateForm(
			{
				title: article.title,
				shortDescription: article.description,
				text: article.body,
				tags: article.tagList,
			},
			CREATE_ARTICLE
		);
		append(article.tagList.map((tag) => ({ tag })));
	};

	useEffect(() => {
		if (slug) {
			if (!article || article.slug !== slug) {
				const isStateHasArticle = articles.length ? articles.find((article) => article.slug === slug) : null;
				fetchFullArticle(isStateHasArticle, slug).then((article) => {
					fillingExistingInputs(article);
				});
				return;
			}
			fillingExistingInputs(article);
		}
		if (!slug && fields.length) remove();
	}, [slug]);

	let token;
	const loggedIn = localStorage.getItem('loggedIn');
	if (loggedIn) {
		const loggedInValues = JSON.parse(loggedIn);
		token = loggedInValues.token;
	}

	const formSubmit = () => {
		let sameTags;
		tags.forEach((tag, index, arr) => {
			if (arr.includes(tag, index + 1)) sameTags = true;
		});
		if (sameTags) return validateForm(null, CREATE_ARTICLE, { tags: 'do not have to be the same' });

		const values = {
			article: {
				title,
				description: shortDescription,
				body: text,
				tagList: tags,
			},
		};
		reset();
		if (slug)
			return sendForm(
				CREATE_ARTICLE,
				`/articles/${slug}/`,
				values,
				'PUT',
				page,
				navigate,
				`/articles/${slug}`,
				createLocalStorage,
				slug,
				token
			);

		sendForm(CREATE_ARTICLE, 'articles', values, 'POST', page, navigate, '/articles/', createLocalStorage, null, token);
	};

	const onInputChange = (evt) => {
		const { id, value } = evt.target;
		if (id.includes('tag')) {
			tags[id.slice(3)] = value;
			return validateForm({ tags }, CREATE_ARTICLE);
		}
		validateForm({ [id]: value }, CREATE_ARTICLE);
	};

	return (
		<form className={classes.newArticle} onSubmit={handleSubmit(formSubmit)}>
			<h1 className={classes.newArticle__header}>{slug ? 'Edit article' : 'Create new article'}</h1>
			<label className={classes.newArticle__label} htmlFor="title">
				<span className={classes.newArticle__labelText}>Title</span>
				<input
					className={classes.newArticle__input}
					type="text"
					id="title"
					{...register('title', {
						required: 'This field is required.',
						minLength: { value: 1, message: 'Your title needs to be at least 1 character.' },
						maxLength: { value: 5000, message: 'Your title needs to be no longer than 5000 characters.' },
						pattern: {
							value: /\S+/,
							message: 'This field cannot contain only whitespace characters.',
						},
					})}
					placeholder="Title"
					value={title}
					onChange={(evt) => onInputChange(evt)}
				/>
				{errors.title && <div className={classes.newArticle__inputErr}>{errors.title.message}</div>}
				{errs?.title && <div className={classes.newArticle__inputErr}>title {errs.title}</div>}
			</label>
			<label className={classes.newArticle__label} htmlFor="shortDescription">
				<span className={classes.newArticle__labelText}>Short description</span>
				<input
					className={classes.newArticle__input}
					type="text"
					id="shortDescription"
					{...register('shortDescription', {
						required: 'This field is required.',
						minLength: { value: 1, message: 'Your description needs to be at least 1 character.' },
						maxLength: { value: 5000, message: 'Your description needs to be no longer than 5000 characters.' },
						pattern: {
							value: /\S+/,
							message: 'This field cannot contain only whitespace characters.',
						},
					})}
					placeholder="Description"
					value={shortDescription}
					onChange={(evt) => onInputChange(evt)}
				/>
				{errors.shortDescription && (
					<div className={classes.newArticle__inputErr}>{errors.shortDescription.message}</div>
				)}
				{errs?.description && <div className={classes.newArticle__inputErr}>description {errs.description}</div>}
			</label>
			<label className={classes.newArticle__label} htmlFor="text">
				<span className={classes.newArticle__labelText}>Text</span>
				<textarea
					className={`${classes.newArticle__input} ${classes.newArticle__inputTextarea}`}
					id="text"
					{...register('text', {
						required: 'This field is required.',
						minLength: { value: 1, message: 'Your text needs to be at least 1 character.' },
						pattern: {
							value: /\S+/,
							message: 'This field cannot contain only whitespace characters.',
						},
					})}
					placeholder="Text"
					value={text}
					onChange={(evt) => onInputChange(evt)}
				/>
				{errors.text && <div className={classes.newArticle__inputErr}>{errors.text.message}</div>}
				{errs?.body && <div className={classes.newArticle__inputErr}>text {errs.body}</div>}
			</label>
			<div className={classes.newArticle__label}>
				<span className={classes.newArticle__labelText}>Tags</span>
				<Row align="bottom">
					<Col span={12}>
						{fields.map((field, index) => {
							return (
								<section key={field.id} className={classes.newArticle__inputWrap}>
									<input
										className={`${classes.newArticle__input} ${classes.newArticle__inputTag}`}
										type="text"
										id={`tag${index}`}
										{...register(`tags.${index}.tag`, {
											required:
												'This field is required. If you do not want to provide the tag, please delete it before sending form',
											minLength: { value: 1, message: 'Your tag needs to be at least 1 character.' },
											maxLength: { value: 100, message: 'Your tag needs to be no longer than 100 characters.' },
											pattern: {
												value: /\S+/,
												message: 'This field cannot contain only whitespace characters.',
											},
										})}
										placeholder="Tag"
										value={tags[index]}
										onChange={(evt) => onInputChange(evt)}
									/>
									<button
										type="button"
										className={`${classes.newArticle__btn} ${classes.newArticle__btn_red}`}
										onClick={() => {
											remove(index);
											tags.splice(index, 1);
											if (!tags) return validateForm({ tags: [] }, CREATE_ARTICLE);
											validateForm({ tags }, CREATE_ARTICLE);
										}}
									>
										Delete
									</button>
									{errors?.tags && (
										<div className={classes.newArticle__inputErr}>{errors?.tags[index]?.tag.message}</div>
									)}
									{errs?.tags && <div className={classes.newArticle__inputErr}>tags {errs.tags}</div>}
								</section>
							);
						})}
					</Col>
					<Col span={11} className={`${classes.newArticle__btnWrapper} ${classes.newArticle__btnWrapper_blue}`}>
						<button
							type="button"
							className={`${classes.newArticle__btn} ${classes.newArticle__btn_blue}`}
							onClick={() => {
								append({ tag: '' });
								tags.push('');
								validateForm({ tags }, CREATE_ARTICLE);
							}}
						>
							Add tag
						</button>
					</Col>
				</Row>
			</div>
			<div className={classes.newArticle__btnWrapper}>
				<input type="submit" className={classes.newArticle__btn} value="Send" />
			</div>
		</form>
	);
};

const mapStateToProps = ({ creatingArticle, changingPage, showingArticle }) => ({
	creatingArticle,
	articles: changingPage.articles,
	article: showingArticle.article,
	page: changingPage.page,
});

export default connect(mapStateToProps, { fetchFullArticle, validateForm, sendForm })(NewArticle);
