import React from 'react';

import styles from './TableNavigator.module.scss';

type TableNavigatorProps = {
	tab: string;
	setTab: (boolean) => void;
	translate: (string: string, object?: { text: string }) => string;
};

const TableNavigator = ({ tab, setTab, translate }: TableNavigatorProps) => (
	<div className={styles.wrapper}>
		<button
			className={`table-navigator week ${tab === 'week' ? ' active' : ''}`}
			onClick={() => setTab('week')}
			type="button"
		>
			{translate("THIS WEEK'S RATING")}
		</button>
		<button
			className={`table-navigator month ${tab === 'month' ? ' active' : ''}`}
			onClick={() => setTab('month')}
			type="button"
		>
			{translate("THIS MONTH'S RANKING")}
		</button>
	</div>
);

export default TableNavigator;
