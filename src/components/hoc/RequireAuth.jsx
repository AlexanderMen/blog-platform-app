import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
	const location = useLocation();
	const loggedIn = localStorage.getItem('loggedIn');

	if (!loggedIn) return <Navigate to="/sign-in/" state={{ from: location }} />;
	return children;
};

export { RequireAuth };
