/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/forbid-prop-types */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { appConfigs } from '@constants';
import Avatar from '@assets/img/table/user-avatar.png';
import TableContext from '@contexts/Table';
import { formatNumber, translateFunc } from '@utils';

import styles from './TableWrapper.module.scss';

const Item = ({ row, translate = translateFunc }) => {
	const tableCtx = useContext(TableContext);
	const { config } = tableCtx;
	const { avatar, coin, useTop, referral } = config;
	const finalAvatar = row?.user?.avatar ? row?.user?.avatar : Avatar.src;
	return (
		<>
			<div
				className={
					useTop && (row.first || row.second || row.third) ? styles['list-item'] : styles['list-item-normal']
				}
			>
				{avatar && (
					<div className={styles['left-wrapper']}>
						{!useTop && (
							<img src={finalAvatar} alt="user name" width={45} height={45} className="rounded-full" />
						)}
						{useTop && (
							<>
								{row.first && (
									<>
										<div className={styles['avatar-frame-top-1']}>
											<img
												src={finalAvatar}
												alt="user name"
												width={50}
												height={50}
												className="rounded-full"
											/>
										</div>
										<div className={styles['position-frame']}>TOP 1</div>
									</>
								)}
								{row.second && (
									<>
										<div className={styles['avatar-frame-top-2']}>
											<img
												src={finalAvatar}
												alt="user name"
												width={45}
												height={45}
												className="rounded-full"
											/>
										</div>
										<div className={styles['position-frame']}>TOP 2</div>
									</>
								)}
								{row.third && (
									<>
										<div className={styles['avatar-frame-top-3']}>
											<img
												src={finalAvatar}
												alt="user name"
												width={45}
												height={45}
												className="rounded-full"
											/>
										</div>
										<div className={styles['position-frame']}>TOP 3</div>
									</>
								)}
								{row.normal && (
									<>
										<img
											src={finalAvatar}
											alt="user name"
											width={45}
											height={45}
											className="rounded-full"
										/>
									</>
								)}
							</>
						)}
					</div>
				)}
				<div>
					<h3 className="font-bold capitalize">{row.user.name || '******'}</h3>
					{coin && (
						<p className="mb-0">
							{formatNumber(row.coin)} {appConfigs.CURRENCY}
						</p>
					)}
					{referral && (
						<p className="mb-0">
							{formatNumber(row.referral)} {translate('member')}
						</p>
					)}
				</div>
			</div>
		</>
	);
};

Item.propTypes = {
	row: PropTypes.object,
	translate: PropTypes.func,
};

export default Item;
