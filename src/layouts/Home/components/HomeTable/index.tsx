import React from 'react';

import { translateFunc, TranslateType } from '@utils';

import Ranking from './components/Ranking';
import Referral from './components/Referral';
import styles from './HomeTable.module.scss';

type HomeTableProps = {
	translate: TranslateType;
};

const HomeTable = (props: HomeTableProps) => {
	const { translate = translateFunc } = props;
	return (
		<div className={styles.homeTable}>
			<div className={styles.homeTable__title}>{translate('RANKINGS')}</div>
			<div className={styles.homeTable__blTable}>
				<Ranking translate={translate} />
				<Referral translate={translate} />
			</div>
		</div>
	);
};

export default HomeTable;
