import React, { useEffect } from 'react';

import { translateFunc, TranslateType } from '@utils';

import HomeReview from './components/HomeReview';
import HomeInviteFriend from './components/HomeInviteFriend';
import HomeTable from './components/HomeTable';
import HomeReviewQuestion from './components/HomeReviewQuestion';
import styles from './Home.module.scss';

type InfoProps = {
	translate: TranslateType;
};

const HomeLayout = (props: InfoProps) => {
	const { translate = translateFunc } = props;

	useEffect(() => {
		// modalRef.current.onOpen();
	}, []);

	return (
		<div className={styles['home-container']}>
			<HomeReview translate={translate} />
			<HomeInviteFriend translate={translate} />
			<HomeTable translate={translate} />
			<HomeReviewQuestion translate={translate} />
		</div>
	);
};

export default HomeLayout;
