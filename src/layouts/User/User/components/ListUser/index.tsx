import React from 'react';
import classnames from 'classnames';

import { formatNumber, translateFunc, TranslateType } from '@utils';

import styles from './ListUser.module.scss';

type ListUserProps = {
	dataList?: Array<{
		[key: string]: string | number;
	}>;
	translate: TranslateType;
};

const ListUser = (props: ListUserProps) => {
	const { dataList } = props;
	const { translate = translateFunc } = props;

	const statusMapping = {
		1: translate('Waiting'),
		2: translate('Success'),
		3: translate('Reject'),
	};

	return (
		<>
			<div className={styles.list}>
				{Array.isArray(dataList) && dataList?.length > 0 ? (
					dataList.map((item) => (
						<div className={styles.list__item} key={item?.id}>
							<div className={classnames(styles['list__item-title'])}>{item?.account_name}</div>
							<div className={classnames(styles['list__item-content'])}>
								<div>
									<span className={styles.list__textBold}>{translate('Money')}</span>:{' '}
									{formatNumber(item?.coin)}
								</div>
								<div>
									<span className={classnames(styles.list__textBold, styles.list__mrLeft)}>
										{translate('Status')}
									</span>
									: {statusMapping[item?.status]}
								</div>
							</div>
						</div>
					))
				) : (
					<div className={styles.list__empty}>
						<i className="icon-mt-menu_empty" />
						<p>{translate('No transaction history')}!</p>
					</div>
				)}
			</div>
		</>
	);
};

export default ListUser;
