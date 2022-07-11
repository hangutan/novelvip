// Libraries
import { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { ConfigProvider, Table, Tag, Checkbox } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Image from 'next/image';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';
import 'moment/locale/vi';

// Utils
import Swal from '@utils/swal';
import toastr from '@utils/toastr';
import { formatNumber, copyTextToClipboard, random } from '@utils';
// Constants
import Images from '@constants/image';
// Services
import rechargeApi from '@services/recharge';
// Store
import { RootState } from '@store/rootReducer';
// Hook
import useDebounce from '@hooks/useDebounce';

// Styles
import styles from './index.module.scss';

const { getRechargeHistory, createCode, confirmTransaction } = rechargeApi;

const ShowTabs = {
	RECHARGE: 'RECHARGE',
	HISTORY: 'HISTORY',
};

moment.locale('vi');

type Props = {
	translate: (str: string, obj?: { text: string }) => string;
};

const Recharge = (props: Props) => {
	const { translate } = props;
	const [showTab, setShowTab] = useState(ShowTabs.RECHARGE);
	const language = useSelector((state: RootState) => state?.App?.lang);

	const statusMapping = {
		'1': {
			label: translate('Waiting'),
			color: 'processing',
		},
		'2': {
			label: translate('Success'),
			color: 'success',
		},
		'3': {
			label: translate('Reject'),
			color: 'error',
		},
	};

	const [active, setActive] = useState('momo');
	const [qrImg, setQrImg] = useState(null);
	const [amount, setAmount] = useState(1000000);
	const [checked, setCheck] = useState(false);

	const [message, setMessage] = useState('');
	const methods = {
		momo: {
			account_name: 'NGUYEN HUU THUAN',
			account_number: '0914684568',
		},
		bank: {
			account_name: 'PHAN LE CHI',
			account_number: '9213999999',
			bank_name: 'Vietcombank',
			branch: 'Bình Thạnh TPHCM',
		},
	};

	const dbAmount = useDebounce(amount, 1000);

	const page = useRef(1);
	const pageMax = useRef(2);
	const isDisable = useRef(false);

	const [listData, setListData] = useState([]);

	const getHistory = async () => {
		if (!isDisable.current && page.current !== pageMax.current) {
			isDisable.current = true;
			const res = await getRechargeHistory({ limit: 20, page: page.current }, { setAppLoading: true });
			if (res.success) {
				const data = res.data.map((item) => ({ ...item, key: random(8) }));
				setListData((prev) => [...prev, ...data]);
				if (res.data?.length > 0) {
					page.current += 1;
				}
				if (res.data?.length === 20) {
					pageMax.current += 1;
				}
			}
			isDisable.current = false;
		}
	};

	const handleChangeTab = (str) => {
		setShowTab(str);
		if (str === ShowTabs.HISTORY) {
			getHistory();
		}
	};

	const handleCreateCode = async (str) => {
		setQrImg(Images.LOADING);
		setMessage('');
		const res = await createCode({ payment_method: str, amount }, { setAppLoading: true, isOffToast: true });
		if (str === 'momo') {
			setMessage(res?.data);
		} else {
			setMessage(res?.data?.code);
			setQrImg(res?.data?.qr);
		}
	};

	const handleConfirm = async () => {
		setCheck(true);
		if (amount < 10000 || amount > 10 ** 11) {
			Swal({
				icon: 'error',
				title: translate('Please enter {{text}}', {
					text: translate('an amount between 10,000 VNĐ and 100,000,000,000 VNĐ'),
				}),
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
				const res = await confirmTransaction({ code: message }, { setAppLoading: true, isOffToast: true });
				if (res.success) {
					setListData([]);
					page.current = 1;
					await getHistory();
					setShowTab(ShowTabs.HISTORY);
					handleCreateCode(active);
				}
			}
		}
		setCheck(false);
	};

	useEffect(() => {
		if (dbAmount < 10000 || dbAmount > 10 ** 11) {
			Swal({
				icon: 'error',
				title: translate('Please enter {{text}}', {
					text: translate('an amount between 10,000 VNĐ and 100,000,000,000 VNĐ'),
				}),
				html: '',
				confirmButton: translate('Close'),
			});
		} else {
			handleCreateCode(active);
		}
	}, [dbAmount]);

	useEffect(() => {
		try {
			handleCreateCode(active);
			const tableContent = document.querySelector('.ant-table-body');
			tableContent?.addEventListener('scroll', (event) => {
				if (
					(event.target as HTMLInputElement).scrollHeight -
						(event.target as HTMLInputElement).scrollTop -
						(event.target as HTMLInputElement).clientHeight <
					1
				) {
					getHistory();
				}
			});
		} catch (err) {
			console.log(err);
		}
	}, []);

	const renderRecharge = () => {
		const renderInfo = () => {
			const content = methods[active];

			return (
				<div className={classnames(styles.detail__info, styles[active])}>
					<div className={styles['detail__info-qrcode']}>
						{active === 'momo' && <Image src={Images.QRCODE} layout="fill" objectFit="cover" />}
						{active === 'bank' && qrImg && <Image src={qrImg} layout="fill" objectFit="cover" />}
					</div>
					{content?.account_name && (
						<span>
							<b>{translate('Account name')}:</b> {content?.account_name}
						</span>
					)}
					{content?.account_number && (
						<span>
							<b>{active === 'bank' ? `${translate('Account number')}:` : `${translate('Phone')}:`}</b>{' '}
							{content?.account_number}
						</span>
					)}
					{content?.bank_name && (
						<span>
							<b>{translate('Bank')}:</b> {content?.bank_name}
						</span>
					)}
					{content?.branch && (
						<span>
							<b>{translate('Branch')}:</b> {content?.branch}
						</span>
					)}
					<label htmlFor="amount" className={styles['detail__info-amount']}>
						<b>{translate('Transfer amount')}:</b>
						<input
							id="amount"
							value={formatNumber(amount)}
							onChange={(e) => {
								const num = Number(e.target.value.replace(/(,*)/g, ''));
								if (Number.isNaN(num) || num < 0) {
									setAmount('');
								} else {
									setAmount(num);
								}
							}}
							spellCheck="false"
						/>
					</label>
					<Checkbox
						className={styles['detail__info-confirm']}
						checked={checked}
						onChange={(e) => {
							if (e.target.checked) handleConfirm();
						}}
					>
						{translate('Confirm transferred successfully')}
					</Checkbox>
					<div className={styles['detail__info-message']}>
						<b>{translate('Transfer message')}:</b>
						<div>
							<input type="text" value={message} spellCheck="false" disabled />
							<button
								type="button"
								onClick={() => {
									const result = copyTextToClipboard(message);
									if (result) {
										toastr.success(translate('Copied successfully'));
									}
								}}
							>
								<i className="icon-mt-sticky_note" />
								Copy
							</button>
						</div>
					</div>
				</div>
			);
		};

		const onChangeMethod = (str) => {
			setActive(str);
			handleCreateCode(str);
		};

		return (
			<div className={styles.detail} style={{ display: showTab !== ShowTabs.RECHARGE && 'none' }}>
				<div className={styles.detail__method}>
					<div
						className={classnames(styles['detail__icon-bank'], active === 'bank' && styles.active)}
						aria-hidden
						onClick={() => onChangeMethod('bank')}
					>
						<Image src={Images.vcb} layout="fill" objectFit="contain" />
					</div>
					<div
						className={classnames(styles['detail__icon-momo'], active === 'momo' ? styles.active : null)}
						aria-hidden
						onClick={() => onChangeMethod('momo')}
					>
						<Image src={Images.momo} layout="fill" objectFit="contain" />
					</div>
				</div>
				{renderInfo()}

				<div className={styles.detail__note}>
					<p>
						{translate(
							'If after 10 minutes since the money has been deducted without adding money to your account, please',
						)}{' '}
						<a href="#">{translate('CLICK HERE')}</a> {translate('to contact support')}.
					</p>
				</div>
			</div>
		);
	};

	const renderHistory = () => {
		const columns = [
			{
				title: translate('Beneficiary account'),
				dataIndex: 'account_number',
				key: 'account_number',
			},
			{
				title: translate('Recharge amount'),
				dataIndex: 'coin',
				key: 'coin',
				render: (data) => formatNumber(data),
			},
			{
				title: translate('Bank'),
				dataIndex: 'payment_method',
				key: 'payment_method',
				render: (data, record) => (data === 'momo' ? 'Momo' : record.bank_name),
			},
			{
				title: translate('Created'),
				dataIndex: 'create_at',
				key: 'create_at',
				render: (data) => moment(data * 1000).format('HH:mm DD/MM/YYYY'),
			},
			{
				title: translate('Status'),
				dataIndex: 'status',
				key: 'status',
				render: (data) => (
					<Tag className={styles['custom-tag']} color={statusMapping[data]?.color}>
						{statusMapping[data]?.label}
					</Tag>
				),
			},
		];

		return (
			<div className={styles.history} style={{ display: showTab !== ShowTabs.HISTORY && 'none' }}>
				<ConfigProvider locale={language === 'vi' ? viVN : enUS}>
					<Table
						className={styles['history__table-body']}
						columns={columns}
						dataSource={listData}
						pagination={false}
						scroll={{ x: 900, y: 'calc(100vh - 300px)' }}
					/>
				</ConfigProvider>
			</div>
		);
	};

	return (
		<>
			<div className={styles.recharge__container}>
				<div className={styles.recharge__wrapper}>
					<div className={styles.recharge__tab}>
						<div
							aria-hidden="true"
							className={classnames(styles['recharge__tab-pane'], {
								[styles.active]: showTab === ShowTabs.RECHARGE,
							})}
							onClick={() => handleChangeTab(ShowTabs.RECHARGE)}
						>
							{translate('Recharge')}
						</div>
						<div
							aria-hidden="true"
							className={classnames(styles['recharge__tab-pane'], {
								[styles.active]: showTab === ShowTabs.HISTORY,
							})}
							onClick={() => handleChangeTab(ShowTabs.HISTORY)}
						>
							{translate('Recharge History')}
						</div>
					</div>

					{renderRecharge()}
					{renderHistory()}
				</div>
			</div>
		</>
	);
};

export default Recharge;
