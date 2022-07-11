import React, { useState, useEffect } from 'react';
import classnames from 'classnames';

import styles from './styles.module.scss';

type Props = {
	mode: string;
	handleOnChange: (v: string) => void;
	listTab: Array<{
		id: string;
		label: string;
	}>;
};

const Tabs = (props: Props) => {
	const { mode, listTab, handleOnChange } = props;

	const [active, setActive] = useState(0);

	useEffect(() => {
		const arr = listTab.map((item) => item?.id);
		setActive(arr.indexOf(mode));
	}, [mode]);

	return (
		<>
			<div className={styles.tabs}>
				<div
					className={styles.tabs__container}
					style={{ maxWidth: listTab.length * 200, minWidth: listTab.length * 75 }}
				>
					<div
						className={styles.tabs__wrap}
						style={{
							left: `calc(${(active / listTab.length) * 100}% + 1px)`,
							width: `${100 / listTab.length}%`,
						}}
					/>
					{listTab.length > 0 &&
						listTab.map((item) => (
							<button
								key={item?.label}
								data-key={item?.label}
								type="button"
								className={classnames(
									styles.tabs__item,
									mode === item?.id ? styles.active : styles.default,
								)}
								onClick={() => handleOnChange(item?.id)}
							>
								{item?.label}
							</button>
						))}
				</div>
			</div>
		</>
	);
};

export default Tabs;
