import { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { Modal, Button, DatePicker, Select, Input, ConfigProvider } from 'antd';
import moment, { Moment } from 'moment';
import viVN from 'antd/lib/locale/vi_VN';
import 'moment/locale/vi';
import { useRouter } from 'next/router';

import { GENDERS as GENS } from '@constants';
import { actionTypes } from '@store/user/middleware';
import { actionTypes as actionTypesApp } from '@store/app/middleware';
import { RootState } from '@store/rootReducer';

import styles from './index.module.scss';

const { Option } = Select;

type UserInfoProps = {
	name: string;
	username: string;
	birthday: Moment | string | number;
	phone: string;
	home_town: string | number;
	gender: string | number;
};

type ModalUserAuthenProps = {
	translate: (string: string, object?: { text: string | void }) => string;
};

moment.locale('vi');

const ModalUserAuthen = (props: ModalUserAuthenProps) => {
	const { translate } = props;
	const dispatch = useDispatch();
	const userInfo = useSelector((state: RootState) => state?.User?.userInfo) as UserInfoProps;
	const locations = useSelector((state: RootState) => state?.App?.locations);

	const route = useRouter();
	const {
		reset,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			phone: '',
			birthday: '',
			home_town: null,
			gender: null,
		},
	});
	const [isModal, setIsModal] = useState(false);

	const GENDERS = useMemo(
		() =>
			GENS.map((item) => ({
				...item,
				label: translate(item.label),
			})),
		[translate],
	);

	useEffect(() => {
		dispatch({ type: actionTypes.GET_ME });
		dispatch({ type: actionTypesApp.GET_LOCATIONS });
	}, []);

	const onOpen = () => {
		const { name, birthday, phone, home_town: homeTown, gender } = userInfo;
		if (name && phone && birthday && homeTown && gender) {
			route.push('/list-job');
		} else {
			reset({
				name,
				birthday: birthday && (moment(birthday, 'YYYY/MM/DD') as unknown as string),
				phone,
				home_town: locations.find((location) => location.id === homeTown) || null,
				gender: GENDERS.find((item) => item.id === +gender) || null,
			});
			setIsModal(true);
		}
	};

	const handleCancel = () => {
		setIsModal(false);
	};

	const callbackModal = () => {
		setIsModal(false);
		route.push('/list-job');
	};

	const handleOk = async (data) => {
		const { name, birthday, phone, home_town: homeTown, gender } = data;
		dispatch({
			type: actionTypes.UPDATE_USER,
			payload: {
				...userInfo,
				name,
				birthday: birthday?.format('YYYY/MM/DD'),
				phone,
				homeTown: homeTown?.id,
				gender: gender?.id,
				cb: callbackModal,
			},
		});
	};

	const customButton = () => (
		<Button onClick={onOpen} className={styles.btn_open}>
			{translate('EARN MONEY NOW')}
		</Button>
	);

	return (
		<>
			{customButton()}
			<Modal
				title={translate('Verify account information')}
				visible={isModal}
				onCancel={handleCancel}
				onOk={handleSubmit(handleOk)}
				cancelText={translate('Cancel')}
				okText={translate('Save')}
				maskClosable={false}
			>
				<ConfigProvider locale={viVN}>
					<form className={styles.userAuthen}>
						<div className={classnames(styles['userAuthen__item mrTop-0'])}>
							<div className={classnames(styles['userAuthen__item-label'])}>{translate('Full name')}</div>
							<Controller
								render={({ field: { onChange, value: defaultValue } }) => (
									<Input
										type="text"
										value={defaultValue}
										placeholder={translate('Please enter your name correctly')}
										className={classnames(
											styles['userAuthen__item-input'],
											errors.name && styles.error,
										)}
										onChange={onChange}
									/>
								)}
								rules={{ required: translate('Please enter your name correctly') }}
								name="name"
								control={control}
							/>
							<div className={classnames(styles['userAuthen__item-textNote'])}>
								(
								{translate(
									'Please enter exactly according to your ID card, we will verify your ID when withdrawing money',
								)}
								)
							</div>
						</div>
						<div className={styles.userAuthen__item}>
							<div className={classnames(styles['userAuthen__item-label'])}>
								{translate('Remittance confirmation phone number')}
							</div>
							<Controller
								render={({ field: { onChange, value: defaultValue } }) => (
									<Input
										type="text"
										value={defaultValue}
										placeholder={translate('Please enter the correct phone number')}
										className={classnames(
											styles['userAuthen__item-input'],
											errors.phone && styles.error,
										)}
										onChange={onChange}
									/>
								)}
								rules={{ required: translate('Please enter the correct phone number') }}
								name="phone"
								control={control}
							/>
							<div className={classnames(styles['userAuthen__item-textNote'])}>
								(
								{translate(
									'Please enter the correct phone number to verify by text message when withdrawing',
								)}
								)
							</div>
						</div>
						<div className={styles.userAuthen__item}>
							<div className={classnames(styles['userAuthen__item-label'])}>{translate('Gender')}</div>
							<Controller
								render={({ field: { onChange, value: defaultValue } }) => (
									<Select
										className={classnames(
											styles['userAuthen__item-select'],
											styles.italic,
											errors.gender && styles.error,
										)}
										value={defaultValue?.id}
										onSelect={(value) => {
											const option = GENDERS.find((item) => item.id === +value);
											onChange(option);
										}}
										placeholder={translate('Choose your gender')}
									>
										{GENDERS.map((item) => (
											<Option key={item?.name} value={item?.id}>
												{item.label}
											</Option>
										))}
									</Select>
								)}
								rules={{ required: translate('Please select your gender') }}
								name="gender"
								control={control}
							/>
							<div className={classnames(styles['userAuthen__item-textNote'])}>
								(
								{translate(
									'Please enter the exact gender to classify the job, will call to verify if necessary',
								)}
								)
							</div>
						</div>
						<div className={styles.userAuthen__item}>
							<div className={classnames(styles['userAuthen__item-label'])}>{translate('Hometown')}</div>
							<Controller
								render={({ field: { onChange, value: defaultValue } }) => (
									<Select
										className={classnames(
											styles['userAuthen__item-select'],
											styles.italic,
											errors.home_town && styles.error,
										)}
										value={defaultValue?.id}
										onSelect={(value) => {
											const option = locations?.find((item) => item.id === value);
											onChange(option);
										}}
										placeholder={translate('Please select your hometown')}
									>
										{locations?.map((item) => (
											<Option key={item?.id} value={item?.id}>
												{item.name}
											</Option>
										))}
									</Select>
								)}
								rules={{ required: translate('Please select your hometown') }}
								name="home_town"
								control={control}
							/>
							<div className={classnames(styles['userAuthen__item-textNote'])}>
								(
								{translate(
									'Please enter exactly according to your ID card, we will verify your ID when withdrawing money',
								)}
								)
							</div>
						</div>
						<div className={styles.userAuthen__item}>
							<div className={classnames(styles['userAuthen__item-label'])}>{translate('Birthday')}</div>
							<Controller
								render={({ field: { onChange, value } }) => (
									<DatePicker
										className={classnames(
											styles['userAuthen__item-input'],
											errors.birthday && styles.error,
										)}
										defaultValue={moment().subtract(1, 'year')}
										value={value as unknown as Moment}
										format="DD/MM/YYYY"
										onChange={onChange}
										placeholder={translate('Choose your birthday')}
										allowClear={false}
										showToday={false}
										disabledDate={(curr) => curr > moment().subtract(1, 'year')}
									/>
								)}
								rules={{ required: translate('Please enter your date of birth') }}
								name="birthday"
								control={control}
							/>
							<div className={classnames(styles['userAuthen__item-textNote'])}>
								(
								{translate(
									'Please enter exactly according to your ID card, we will verify your ID when withdrawing money',
								)}
								)
							</div>
						</div>
					</form>
				</ConfigProvider>
			</Modal>
		</>
	);
};

export default ModalUserAuthen;
