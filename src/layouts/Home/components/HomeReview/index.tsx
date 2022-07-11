import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Images from '@constants/image';
import { translateFunc, TranslateType } from '@utils';

import styles from './HomeReview.module.scss';

type HomeReviewProps = {
	translate: TranslateType;
};

const HomeReview = (props: HomeReviewProps) => {
	const { translate = translateFunc } = props;

	return (
		<div className={styles.homeReview}>
			<div className={styles.homeReview__bgImg1}>
				<div className={styles.homeReview__bgOpacity} />
				<Image
					src={Images.home_bg1}
					className={styles['homeReview__bgImg1-img1']}
					priority
					layout="responsive"
					alt="govip background"
				/>
			</div>
			<div className={styles.homeReview__bgImg2}>
				<Image
					src={Images.home_bg2}
					className={styles['homeReview__bgImg2-img2']}
					layout="responsive"
					alt="govip background"
				/>
			</div>
			<div className={styles.homeReview__bgButton}>
				<Link href="/list-job">
					<button type="button" className={styles['homeReview__bgButton-btn']}>
						{translate('EARN MONEY NOW')}
					</button>
				</Link>
				<Link href="/create-job">
					<button type="button" className={styles['homeReview__bgButton-btn']}>
						{translate('CREATE NEW JOB')}
					</button>
				</Link>
			</div>
		</div>
	);
};

export default HomeReview;
