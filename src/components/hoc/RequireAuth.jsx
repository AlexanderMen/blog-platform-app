import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

import { SIGNING_IN_ROUTE } from '../../actions';
import BlogPlatformService from '../../services/BlogPlatformService';

const RequireAuth = ({ children }) => {
	const { getItemFromLocalStorage } = new BlogPlatformService();
	const location = useLocation();
	const loggedIn = getItemFromLocalStorage('loggedIn');

	if (!loggedIn) return <Navigate to={SIGNING_IN_ROUTE} state={{ from: location }} />;
	return children;
};

export { RequireAuth };
