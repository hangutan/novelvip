import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.scss';

type TabProps = {
	tab?: string;
	listTab: Array<{
		key: string | number;
		value: string | number;
		label: string;
		clickable?: boolean;
	}>;
	setTab?: (str: string) => void;
};

const TabNavigator = (props: TabProps) => {
	const { tab, listTab, setTab } = props;
	const setTabCurrent = (data) => {
		setTab(data);
	};
	return (
		<div className={styles.tab}>
			{listTab?.length > 0 &&
				listTab?.map((item) => (
					<div
						key={item.key}
						className={classnames(styles.tab__blButton, tab === item.value && styles.active)}
					>
						<div className={styles.background} />
						<button type="button" onClick={() => (item.clickable ? setTabCurrent(item.value) : null)}>
							{item.label}
						</button>
					</div>
				))}
		</div>
	);
};

export default TabNavigator;
