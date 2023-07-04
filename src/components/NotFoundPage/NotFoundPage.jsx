import React from 'react';
import { Link } from 'react-router-dom';

import classes from './NotFoundPage.module.scss';

const NotFoundPage = () => {
	return (
		<section className={classes.notFoundPage}>
			Ooooops... this page does not exist.
			<Link className={classes.notFoundPage__link} to="/articles/">
				{} Go home...
			</Link>
		</section>
	);
};

export default NotFoundPage;
