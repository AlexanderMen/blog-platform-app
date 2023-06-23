import React from 'react';
import { Alert, Col } from 'antd';

import classes from './ErrorMessage.module.scss';

const ErrorMessage = ({ message, description }) => (
	<Col span={24}>
		<div className={classes.alert}>
			<Alert message={message} description={description} type="warning" showIcon />
		</div>
	</Col>
);

export default ErrorMessage;
