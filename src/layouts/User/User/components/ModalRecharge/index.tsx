import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import classnames from 'classnames';
import Image from 'next/image';

import Images from '@constants/image';
import rechargeApi from '@services/recharge';
import Swal from '@utils/swal';
import toastr from '@utils/toastr';
import { translateFunc, TranslateType, formatNumber, copyTextToClipboard } from '@utils';

import styles from './ModalRecharge.module.scss';

const { createCode, confirmTransaction } = rechargeApi;

type ReChargeProps = {
	type: string;
	isShow: boolean;
	toggle: () => void;
	translate: TranslateType;
};

const ModalReCharge = (props: ReChargeProps) => {
	const { isShow, toggle, translate = translateFunc, type } = props;
	const [money, setMoney] = useState(1000000);
	const [code, setCode] = useState(null);

	const handleGetCode = async () => {
		const data = await createCode(
			{ payment_method: type, amount: money },
			{ setAppLoading: true, isOffToast: true },
		);
		if (type === 'momo') {
			const dataCode = data?.data;
			setCode(dataCode);
		} else {
			const dataCode = data?.data?.code;
			setCode(dataCode);
		}
	};

	useEffect(() => {
		handleGetCode();
	}, [money, type]);

	const handleConfirm = async () => {
		if (money < 10000 || money > 10 ** 11) {
			Swal({
				icon: 'error',
				title: translate('Please enter an amount between 10,000 VNĐ and 100,000,000,000 VNĐ'),
				html: '',
				confirmButton: translate('Close'),
			});
		} else {
			const confirm = await Swal({
				icon: 'question',
				title: translate('Transferred confirmation'),
				html: '',
				cancelButton: translate('No'),
				confirmButton: translate('Yes'),
			});
			if (confirm) {
				const res = await confirmTransaction({ code }, { setAppLoading: true, isOffToast: false });
				if (res.success) {
					toggle();
				}
			}
		}
	};

	const handleChangeMoney = (e) => {
		const data = e.target.value.replace(/(,*)/g, '');
		console.log('data nhan :', typeof Number(data));
		const num = Number(e.target.value.replace(/(,*)/g, ''));
		setMoney(num);
	};

	const renderBlockBank = () => (
		<div className={styles.bank}>
			<div className={styles.bank__blItem}>
				<div className={classnames(styles['bank__blItem-item'], styles['bank__blItem-item-mr4'])}>
					<div className={styles['bank__blItem-item-name']}>{translate('Account name')}</div>
					<div className={styles['bank__blItem-item-input']}>
						<div>NGUYEN LE CHI</div>
					</div>
					{/* <input placeholder={`${translate('Account name')} ...`} /> */}
				</div>
				<div className={styles['bank__blItem-item']}>
					<div className={styles['bank__blItem-item-name']}>{translate('Account number')}</div>
					<div className={styles['bank__blItem-item-input']}>
						<div>9213999999</div>
					</div>
				</div>
			</div>
			<div className={styles.bank__blItem}>
				<div className={classnames(styles['bank__blItem-item'], styles['bank__blItem-item-mr4'])}>
					<div className={styles['bank__blItem-item-name']}>{translate('Bank name')}</div>
					<div className={styles['bank__blItem-item-input']}>
						<div>Vietcombank</div>
					</div>
				</div>
				<div className={styles['bank__blItem-item']}>
					<div className={styles['bank__blItem-item-name']}>{translate('Branch')}</div>
					<div className={styles['bank__blItem-item-input']}>
						<div>Bình Thạnh TPHCM</div>
					</div>
				</div>
			</div>
			<div className={classnames('mb-4', styles.bank__blItem1)}>
				<div className={styles['bank__blItem-item-name']}>{translate('Recharge amount')}:</div>
				<div className={styles['bank__blItem1-item']}>
					<input	
						placeholder={translate('Enter recharge amount')}
						value={formatNumber(money)}
						onChange={handleChangeMoney}
					/>
				</div>
			</div>
			<div className={styles.bank__blItem1}>
				<div className={styles['bank__blItem1-name']}>{translate('Money transfer content')}</div>
				<div className={styles['bank__blItem1-item']}>
					<div className={styles['bank__blItem1-item-input']}>
						<div>{code}</div>
					</div>
					<button
						type="button"
						className={styles['bank__blItem1-button']}
						onClick={() => {
							const result = copyTextToClipboard(code);
							if (result) {
								toastr.success(translate('Copied successfully'));
							}
						}}
					>
						<i className="icon-mt-copy" />
						Copy
					</button>
				</div>
			</div>
		</div>
	);

	const renderBlockMomo = () => (
		<div className={classnames(styles.momo)}>
			<div className={styles.momo__blLeft}>
				<Image src={Images.QRCODE} width="243px" height="236px" />
			</div>
			<div className={styles.momo__blRight}>
				<div className={styles['momo__blRight-title']}>{translate('User information')}</div>
				<div className={styles.momo__main}>
					<div className={styles['momo__main-blItem']}>
						<div
							className={classnames(
								styles['momo__main-blItem-item'],
								styles['momo__main-blItem-item-mr4'],
							)}
						>
							<div className={styles['momo__main-blItem-item-name']}>{translate('Account name')}</div>
							<div className={styles['momo__main-blItem-item-input']}>
								<div>NGUYEN HUU THUAN</div>
							</div>
						</div>
						<div className={styles['momo__main-blItem-item']}>
							<div className={styles['momo__main-blItem-item-name']}>{translate('Account number')}</div>
							<div className={styles['momo__main-blItem-item-input']}>
								<div>0914684568</div>
							</div>
						</div>
					</div>
					<div className={classnames('mb-4', styles['momo__main-blItem1'])}>
						<div className={styles['momo__main-blItem1-name']}>{translate('Recharge amount')}:</div>
						<div className={styles['momo__main-blItem1-item']}>
							<input
								placeholder={translate('Enter recharge amount')}
								value={formatNumber(money)}
								onChange={handleChangeMoney}
							/>
						</div>
					</div>
					<div className={styles['momo__main-blItem1']}>
						<div className={styles['momo__main-blItem1-name']}>{translate('Money transfer content')}</div>
						<div className={styles['momo__main-blItem1-item']}>
							<div className={styles['momo__main-blItem1-item-input']}>
								<div>{code}</div>
							</div>
							<button
								type="button"
								onClick={() => {
									const result = copyTextToClipboard(code);
									if (result) {
										toastr.success(translate('Copied successfully'));
									}
								}}
								className={styles['momo__main-blItem1-button']}
							>
								<i className="icon-mt-copy" />
								<div>Copy</div>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<>
			<Modal
				keyboard={false}
				visible={isShow}
				onCancel={toggle}
				footer={null}
				closeIcon={(() => (
					<i className={classnames('icon-mt-clear', styles['close-icon'])} />
				))()}
				width="100vw"
				className={styles['wrapper-recharge']}
			>
				<div className={styles.recharge}>
					<div className={styles.recharge__title}>{translate('Deposit money into govip account')}</div>
					{type === 'bank' ? renderBlockBank() : renderBlockMomo()}
					<div className={styles.recharge__main}>
						<div className={styles['recharge__main-textNote']}>{translate('Note')}:</div>
						<div className={styles['recharge__main-textDes']}>{translate('Description recharge')}</div>
						<div className={styles['recharge__main-textMoney']}>
							{translate('Exchange rate')}: 1 vnđ = 1 G coin
						</div>
						<div className={styles['recharge__main-textDes1']}>
							{translate(
								'If after 10 minutes since the money in your account has been deducted, the money has not been added, please press',
							)}{' '}
							<span className={styles['recharge__main-textLink']}>{translate('COME IN')}</span>{' '}
							{translate('to contact support')}.
						</div>
					</div>
				</div>
				<div className={styles.recharge__blButton}>
					<button type="button" className={styles['recharge__blButton-back']} onClick={toggle}>
						<i className="icon-mt-chevron_left" />
						<div>{translate('Back')}</div>
					</button>
					<button type="button" className={styles['recharge__blButton-confirm']} onClick={handleConfirm}>
						<i className="icon-mt-done" />
						<div>{translate('Confirm')}</div>
					</button>
				</div>
			</Modal>
		</>
	);
};

export default ModalReCharge;
