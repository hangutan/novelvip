import React from 'react';
import { Modal, Input, ConfigProvider, Select } from 'antd';
import classnames from 'classnames';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';

import { formatNumber, translateFunc, TranslateType } from '@utils';
import toastr from '@utils/toastr';
// Store
import { RootState } from '@store/rootReducer';
// Services
import withdrawApi from '@services/withdraw';

import styles from './ModalWithdraw.module.scss';

const { createWithdraw } = withdrawApi;

type WithdrawProps = {
	type: string;
	isShow: boolean;
	toggle: () => void;
	translate: TranslateType;
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

const { Option } = Select;

const ModalWithdraw = (props: WithdrawProps) => {
	const { isShow, toggle, translate = translateFunc, type } = props;
	const language = useSelector((state: RootState) => state?.App?.lang);

	const {
		// getValues,
		// resetField,
		// reset,
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

	const listAmount = [50000, 100000, 200000, 500000];

	const onSubmit = async (value) => {
		try {
			const param = {
				payment_method: type,
				account_name: value.name,
				coin: value.amount,
			} as ParamType;

			switch (type) {
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
				// reset();
				toggle();
			}
		} catch (err) {
			console.log(err);
		}
	};

	const renderBlockBank = () => (
		<div className={styles.withdraw__main}>
			<div className={styles['withdraw__main-blItem']}>
				<div
					className={classnames(
						styles['withdraw__main-blItem-item'],
						styles['withdraw__main-blItem-item-mr2'],
					)}
				>
					<div className={styles['withdraw__main-blItem-item-title']}>{translate('Bank name')}</div>
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
				</div>
				<div className={styles['withdraw__main-blItem-item']}>
					<div className={styles['withdraw__main-blItem-item-title']}>{translate('Account name')}</div>
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
				</div>
			</div>
			<div className={styles['withdraw__main-blItem']}>
				<div
					className={classnames(
						styles['withdraw__main-blItem-item'],
						styles['withdraw__main-blItem-item-mr2'],
					)}
				>
					<div className={styles['withdraw__main-blItem-item-title']}>{translate('Account number')}</div>
					<Controller
						render={({ field: { onChange, value: defaultValue } }) => (
							<Input
								id="account_number"
								type="text"
								value={defaultValue}
								placeholder={translate('Enter {{text}}', {
									text: translate('Account number'),
								})}
								className={classnames(styles.form__input, errors.account_number && styles.error)}
								onChange={onChange}
							/>
						)}
						rules={{ required: true }}
						name="account_number"
						control={control}
					/>
				</div>
				<div className={styles['withdraw__main-blItem-item']}>
					<div className={styles['withdraw__main-blItem-item-title']}>{translate('Branch')}</div>
					<Controller
						render={({ field: { onChange, value: defaultValue } }) => (
							<Input
								id="branch"
								type="text"
								value={defaultValue}
								placeholder={translate('Enter {{text}}', {
									text: translate('Branch'),
								})}
								className={classnames(styles.form__input, errors.branch && styles.error)}
								onChange={onChange}
							/>
						)}
						rules={{ required: true }}
						name="branch"
						control={control}
					/>
				</div>
			</div>
			<div className={styles['withdraw__main-blItem']}>
				<div className={styles['withdraw__main-blItem-item']}>
					<div className={styles['withdraw__main-blItem-item-title']}>{translate('Amount to withdraw')}</div>
					<div className={styles.form__group}>
						<Controller
							render={({ field: { onChange, value: defaultValue } }) => (
								<Select
									className={classnames(styles.form__select, errors.amount && styles.error)}
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
					</div>
				</div>
			</div>
		</div>
	);

	const renderBlockMomo = () => (
		<div className={styles.withdraw__main}>
			<div className={styles['withdraw__main-blItem']}>
				<div
					className={classnames(
						styles['withdraw__main-blItem-item'],
						styles['withdraw__main-blItem-item-mr2'],
					)}
				>
					<div className={styles['withdraw__main-blItem-item-title']}>
						{translate('Enter your phone number')}(momo)
					</div>
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
				</div>
				<div className={styles['withdraw__main-blItem-item']}>
					<div className={styles['withdraw__main-blItem-item-title']}>{translate('Account name')}</div>
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
				</div>
			</div>
			<div className={styles['withdraw__main-blItem']}>
				<div className={styles['withdraw__main-blItem-item']}>
					<div className={styles['withdraw__main-blItem-item-title']}>{translate('Amount to withdraw')}</div>
					<Controller
						render={({ field: { onChange, value: defaultValue } }) => (
							<Select
								className={classnames(styles.form__select, errors.amount && styles.error)}
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
				</div>
			</div>
		</div>
	);

	return (
		<>
			<Modal
				centered
				keyboard={false}
				visible={isShow}
				onCancel={toggle}
				footer={null}
				closeIcon={(() => (
					<i className={classnames('icon-mt-clear', styles['close-icon'])} />
				))()}
				width="100vw"
				className={styles['withdraw-job']}
			>
				<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
					<ConfigProvider locale={language === 'vi' ? viVN : enUS}>
						<div className={styles.withdraw}>
							<div className={styles.withdraw__title}>
								{translate('Withdraw money into govip account')}
							</div>
							{type === 'bank' ? renderBlockBank() : renderBlockMomo()}
						</div>
						<div className={styles.withdraw__blButton}>
							<button type="button" className={styles['withdraw__blButton-back']} onClick={toggle}>
								<i className="icon-mt-chevron_left" />
								<div>{translate('Back')}</div>
							</button>
							<button type="submit" className={styles['withdraw__blButton-confirm']}>
								<i className="icon-mt-done" />
								<div>{translate('Send')}</div>
							</button>
						</div>
					</ConfigProvider>
				</form>
			</Modal>
		</>
	);
};

export default ModalWithdraw;
