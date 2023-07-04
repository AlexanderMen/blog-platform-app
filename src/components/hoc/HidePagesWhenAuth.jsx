import React from 'react';
import { Navigate } from 'react-router-dom';

import { ARTICLES_ROUTE } from '../../actions';
import BlogPlatformService from '../../services/BlogPlatformService';

const HidePagesWhenAuth = ({ children }) => {
	const { getItemFromLocalStorage } = new BlogPlatformService();
	const loggedIn = getItemFromLocalStorage('loggedIn');

	if (loggedIn) return <Navigate to={ARTICLES_ROUTE} />;
	return children;
};

export { HidePagesWhenAuth };
