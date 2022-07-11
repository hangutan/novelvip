// Libraries
import { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { useForm, Controller } from 'react-hook-form';
import { Select, Input, Table, Tag, ConfigProvider } from 'antd';
import { BankTwoTone } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Image from 'next/image';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';
import 'moment/locale/vi';

// Utils
import toastr from '@utils/toastr';
import { formatNumber, random } from '@utils';
// Constants
import Images from '@constants/image';
// Services
import withdrawApi from '@services/withdraw';
// Store
import { RootState } from '@store/rootReducer';

// Styles
import styles from './index.module.scss';

const { createWithdraw, getWithdrawHistory } = withdrawApi;

const ShowTabs = {
	WITHDRAW: 'WITHDRAW',
	HISTORY: 'HISTORY',
};

moment.locale('vi');

const { Option } = Select;

type Props = {
	translate: (str: string, obj?: { text: string }) => string;
};

type ParamType = {
	payment_method: string;
	account_name: string;
	coin: number;
	phone?: string;
	bank_name: string;
	bank_branch: string;
	account_number: string;
};

const Withdraw = (props: Props) => {
	const { translate } = props;
	const [showTab, setShowTab] = useState(ShowTabs.WITHDRAW);
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

	const {
		// getValues,
		// resetField,
		reset,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			amount: null,
			name: '',
			account_number: '',
			phone: '',
			branch: '',
			bank: '',
		},
		mode: 'all',
	});

	const page = useRef(1);
	const pageMax = useRef(2);
	const isDisable = useRef(false);
	const [method, setMethod] = useState('momo');

	const [listData, setListData] = useState([]);

	const getHistory = async () => {
		if (!isDisable.current && page.current !== pageMax.current) {
			isDisable.current = true;
			const res = await getWithdrawHistory({ limit: 20, page: page.current }, { setAppLoading: true });
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

	useEffect(() => {
		try {
			getHistory();
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

	const handleChangeTab = (str) => {
		setShowTab(str);
	};

	const onSubmit = async (value) => {
		try {
			const param = {
				payment_method: method,
				account_name: value.name,
				coin: value.amount,
			} as ParamType;

			switch (method) {
				case 'momo':
					param.phone = value.phone;
					break;
				case 'bank':
					param.bank_name = value.bank;
					param.bank_branch = value.branch;
					param.account_number = value.account_number;
					break;
				default:
			}

			const res = await createWithdraw(param, { disableShowToast: true });
			if (res.success) {
				toastr.success(`${translate('Create withdrawal order successfully')}!`);
				reset();
				page.current = 1;
				setListData([]);
				getHistory();
			}
		} catch (err) {
			console.log(err);
		}
	};

	const renderWithdraw = () => {
		const onChangeMethod = (str) => {
			setMethod(str);
			reset();
		};

		const listAmount = [50000, 100000, 200000, 500000];

		return (
			<form
				className={styles.form}
				style={{ display: showTab !== ShowTabs.WITHDRAW && 'none' }}
				onSubmit={handleSubmit(onSubmit)}
			>
				<ConfigProvider locale={language === 'vi' ? viVN : enUS}>
					<div className={styles.form__group}>
						<label htmlFor="method" className={styles.form__label}>
							<p>{translate('Withdrawal method')}</p>
							<Select
								className={styles.form__select}
								value={method}
								placeholder={translate('Select {{text}}', { text: translate('Withdrawal method') })}
								onSelect={onChangeMethod}
							>
								<Option value="momo">
									<span className={styles['form__select-option']}>
										<Image src={Images.MOMO_ICON} width="26" height="26" />
										{translate('Momo wallet')}
									</span>
								</Option>
								<Option value="bank">
									<span className={styles['form__select-option']}>
										<BankTwoTone twoToneColor="#1fab89" style={{ fontSize: '26px' }} />
										{translate('Bank account')}
									</span>
								</Option>
							</Select>
						</label>
					</div>
					{method === 'momo' && (
						<>
							<div className={styles.form__group}>
								<label htmlFor="amount" className={styles.form__label}>
									<p>{translate('Withdrawal amount')}</p>
									<Controller
										render={({ field: { onChange, value: defaultValue } }) => (
											<Select
												className={classnames(
													styles.form__select,
													errors.amount && styles.error,
												)}
												value={defaultValue}
												onSelect={(value) => {
													onChange(value);
												}}
												placeholder={translate('Select {{text}}', {
													text: translate('Withdrawal amount'),
												})}
											>
												{listAmount?.map((item) => (
													<Option key={item} value={item}>
														{`${formatNumber(item)} VNĐ`}
													</Option>
												))}
											</Select>
										)}
										rules={{ required: true }}
										name="amount"
										control={control}
									/>
								</label>
							</div>
							<div className={styles.form__group}>
								<label htmlFor="phone" className={styles.form__label}>
									<p>{translate('Phone')}</p>
									<Controller
										render={({ field: { onChange, value: defaultValue } }) => (
											<Input
												id="phone"
												type="text"
												value={defaultValue}
												placeholder={translate('Enter {{text}}', {
													text: translate('Phone'),
												})}
												className={classnames(styles.form__input, errors.phone && styles.error)}
												onChange={onChange}
											/>
										)}
										rules={{ required: true }}
										name="phone"
										control={control}
									/>
								</label>
							</div>
							<div className={styles.form__group}>
								<label htmlFor="name" className={styles.form__label}>
									<p>{translate('Full name')}</p>
									<Controller
										render={({ field: { onChange, value: defaultValue } }) => (
											<Input
												id="name"
												type="text"
												value={defaultValue}
												placeholder={translate('Enter {{text}}', {
													text: translate('Full name'),
												})}
												className={classnames(styles.form__input, errors.name && styles.error)}
												onChange={onChange}
											/>
										)}
										rules={{ required: true }}
										name="name"
										control={control}
									/>
								</label>
							</div>
						</>
					)}
					{method === 'bank' && (
						<>
							<div className={styles.form__group}>
								<label htmlFor="bank" className={styles.form__label}>
									<p>{translate('Bank name')}</p>
									<Controller
										render={({ field: { onChange, value: defaultValue } }) => (
											<Input
												id="bank"
												type="text"
												value={defaultValue}
												placeholder={translate('Enter {{text}}', {
													text: translate('Bank name'),
												})}
												className={classnames(styles.form__input, errors.bank && styles.error)}
												onChange={onChange}
											/>
										)}
										rules={{ required: true }}
										name="bank"
										control={control}
									/>
								</label>
							</div>
							<div className={styles.form__group}>
								<label htmlFor="name" className={styles.form__label}>
									<p>{translate('Account owner name')}</p>
									<Controller
										render={({ field: { onChange, value: defaultValue } }) => (
											<Input
												id="name"
												type="text"
												value={defaultValue}
												placeholder={translate('Enter {{text}}', {
													text: translate('Account owner name'),
												})}
												className={classnames(styles.form__input, errors.name && styles.error)}
												onChange={onChange}
											/>
										)}
										rules={{ required: true }}
										name="name"
										control={control}
									/>
								</label>
							</div>
							<div className={styles.form__group}>
								<label htmlFor="account_number" className={styles.form__label}>
									<p>{translate('Account number')}</p>
									<Controller
										render={({ field: { onChange, value: defaultValue } }) => (
											<Input
												id="account_number"
												type="text"
												value={defaultValue}
												placeholder={translate('Enter {{text}}', {
													text: translate('Account number'),
												})}
												className={classnames(
													styles.form__input,
													errors.account_number && styles.error,
												)}
												onChange={onChange}
											/>
										)}
										rules={{ required: true }}
										name="account_number"
										control={control}
									/>
								</label>
							</div>
							<div className={styles.form__group}>
								<label htmlFor="branch" className={styles.form__label}>
									<p>{translate('Branch')}</p>
									<Controller
										render={({ field: { onChange, value: defaultValue } }) => (
											<Input
												id="branch"
												type="text"
												value={defaultValue}
												placeholder={translate('Enter {{text}}', {
													text: translate('Branch'),
												})}
												className={classnames(
													styles.form__input,
													errors.branch && styles.error,
												)}
												onChange={onChange}
											/>
										)}
										rules={{ required: true }}
										name="branch"
										control={control}
									/>
								</label>
							</div>
							<div className={styles.form__group}>
								<label htmlFor="amount" className={styles.form__label}>
									<p>{translate('Withdrawal amount')}</p>
									<Controller
										render={({ field: { onChange, value: defaultValue } }) => (
											<Input
												id="amount"
												type="number"
												value={defaultValue}
												placeholder={translate('Enter {{text}}', {
													text: translate('Withdrawal amount'),
												})}
												className={classnames(
													styles.form__input,
													errors.amount && styles.error,
												)}
												onChange={onChange}
											/>
										)}
										rules={{ required: true }}
										name="amount"
										control={control}
									/>
								</label>
							</div>
						</>
					)}
					<div className={styles['form__btn-group']}>
						<button type="submit" className={styles.form__btn}>
							{translate('Confirm')}
						</button>
					</div>
				</ConfigProvider>
			</form>
		);
	};

	const renderHistory = () => {
		const columns = [
			{
				title: translate('Account'),
				dataIndex: 'account_name',
				key: 'account_name',
			},
			{
				title: translate('Withdraw amount'),
				dataIndex: 'coin',
				key: 'coin',
				render: (data) => formatNumber(data),
			},
			{
				title: translate('Bank'),
				dataIndex: 'bank',
				key: 'bank',
				render: (data, record) =>
					record.payment_method === 'momo' ? (
						<span style={{ color: '#A51F68' }}>Momo</span>
					) : (
						record.bank_name
					),
			},
			{
				title: translate('Created'),
				dataIndex: 'created_at',
				key: 'created_at',
				render: (data) => moment(data).format('HH:mm DD/MM/YYYY'),
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
			<div className={styles.withdraw__container}>
				<div className={styles.withdraw__wrapper}>
					<div className={styles.withdraw__tab}>
						<div
							aria-hidden="true"
							className={classnames(styles['withdraw__tab-pane'], {
								[styles.active]: showTab === ShowTabs.WITHDRAW,
							})}
							onClick={() => handleChangeTab('WITHDRAW')}
						>
							{translate('Withdraw')}
						</div>
						<div
							aria-hidden="true"
							className={classnames(styles['withdraw__tab-pane'], {
								[styles.active]: showTab === ShowTabs.HISTORY,
							})}
							onClick={() => handleChangeTab('HISTORY')}
						>
							{translate('Withdraw History')}
						</div>
					</div>

					{renderWithdraw()}
					{renderHistory()}
				</div>
			</div>
		</>
	);
};

export default Withdraw;
