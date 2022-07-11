import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { DatePicker, ConfigProvider } from 'antd';
import moment, { Moment } from 'moment';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';
import 'moment/locale/vi';

import Images from '@constants/image';
import Button from '@components/Button';
import InputComp from '@components/Input';
import SelectComp from '@components/Select';
import { appConfigs, GENDERS as GENS } from '@constants';
import { RootState } from '@store/rootReducer';
import { actionTypes } from '@store/user/middleware';
import { actionTypes as actionTypesApp } from '@store/app/middleware';
import { translateFunc, TranslateType, buildLinkUrl, formatNumber } from '@utils';
import toastr from '@utils/toastr';
import withdrawApi from '@services/withdraw';

import ListUser from '../ListUser';
import BlockChart from '../BlockChart';

import styles from './Tab1.module.scss';

// Services

type UserInfoProps = {
	avatar: string;
	name: string;
	username: string;
	birthday: Moment | string | number;
	phone: string;
	education: string;
	email: string;
	home_town: string | number;
	gender: string | number;
	level: string | number;
	career: string;
	facebook: string;
	coin: number;
	referral: string;
	created_at: string;
	updated_at: string;
};

type Tab1Props = {
	translate: TranslateType;
};

const { getWithdrawHistory } = withdrawApi;

const Tab1 = (props: Tab1Props) => {
	const dispatch = useDispatch();
	const [isProfile, setIsProfile] = useState(true);
	const [idGender, setIdGender] = useState(1);

	const [defaultSrc, setDefaultSrc] = useState(null);
	const [dataHis, setDataHis] = useState([]);

	const { translate = translateFunc } = props;
	const language = useSelector((state: RootState) => state?.App?.lang);

	const userInfo = useSelector((state: RootState) => state?.User?.userInfo) as UserInfoProps;
	const locations = useSelector((state: RootState) => state?.App?.locations);
	const listCareer = useSelector((state: RootState) => state?.App?.careers || []);
	const listEducation = useSelector((state: RootState) => state?.App?.educations || []);

	const getHistory = async () => {
		const res = await getWithdrawHistory({ limit: 7 }, { setAppLoading: true });
		if (res?.success) {
			setDataHis(res?.data);
		}
	};

	useEffect(() => {
		getHistory();
		dispatch({ type: actionTypesApp.GET_LOCATIONS });
		dispatch({ type: actionTypesApp.GET_EDUCATIONS });
		dispatch({ type: actionTypesApp.GET_CAREERS });
	}, []);

	const GENDERS = useMemo(
		() =>
			GENS.map((item) => ({
				...item,
				label: translate(item.label),
			})),
		[translate],
	);

	const {
		getValues,
		resetField,
		reset,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			avatar: null,
			name: '',
			birthday: '',
			phone: '',
			education: null,
			email: '',
			homeTown: null,
			gender: null,
			career: null,
			facebook: '',
			level: '',
			referral: '',
			coin: 0,
		},
	});

	const uploadedImage = useRef(null);

	const srcAvatar = useMemo(
		() => (getValues('avatar') ? buildLinkUrl(appConfigs.API_HOST, getValues('avatar')) : Images.AVATAR_USER),
		[getValues('avatar')],
	);

	useEffect(() => {
		if (userInfo) {
			const {
				avatar,
				name,
				birthday,
				phone,
				education,
				email,
				home_town: homeTown,
				gender,
				career,
				facebook,
				level,
				coin,
				referral,
			} = userInfo;

			setIdGender(gender as unknown as number);

			reset({
				avatar,
				name,
				birthday: birthday && (moment(birthday, 'YYYY/MM/DD') as unknown as string),
				phone,
				education: listEducation.find((item) => +item.id === +education) || null,
				email,
				homeTown: locations.find((location) => +location.id === +homeTown) || null,
				gender: GENDERS.find((item) => +item.id === +gender) || null,
				career: listCareer.find((item) => +item.id === +career) || null,
				facebook,
				referral,
				level: level as unknown as string,
				coin,
			});
		}
	}, [userInfo]);

	const handleImageUpload = async (e) => {
		const [file] = e.target.files;
		if (file) {
			const reader = new FileReader();

			uploadedImage.current = {
				file,
			};

			reader.readAsDataURL(file);
			reader.onload = (ev) => {
				resetField('avatar', {
					defaultValue: ev.target.result,
				});
			};
		}
	};

	const handleCallback = (data) => {
		if (data?.type === 'img') {
			setDefaultSrc(userInfo?.avatar);
		} else {
			toastr.success(data?.message);
		}
		setIsProfile(true);
	};

	const editProfile = () => {
		setIsProfile(!isProfile);
	};

	const selectGender = (data) => {
		setIdGender(data);
	};

	const onSubmit = (data) => {
		const { name, birthday, phone, education, email, homeTown, career, facebook, referral } = data;
		dispatch({
			type: actionTypes.UPDATE_USER,
			payload: {
				name,
				birthday: birthday?.format('YYYY/MM/DD'),
				phone,
				education: education?.id,
				email,
				homeTown: homeTown?.id,
				gender: idGender,
				career: career?.id,
				facebook,
				userInfo,
				referral,
				avatar: uploadedImage?.current,
				cb: handleCallback,
			},
		});
	};

	return (
		<main className={styles.bg_user}>
			<div className={styles.user}>
				<ConfigProvider locale={language === 'vi' ? viVN : enUS}>
					<form className={styles.user__left}>
						<div className={styles.user__cover}>
							<div className={styles['user__cover-img']}>
								<Image
									layout="fill"
									objectFit="cover"
									priority
									src={Images.BACKGROUND_IMG_USER}
									alt="cover"
								/>
							</div>
							<div className={styles['user__cover-info']}>
								<div className={styles['user__cover-info-item']}>
									<i className="icon-mt-clock" />
									<div>
										{translate('Participation')}:{' '}
										<span className="font-bold">
											{moment(userInfo?.created_at).format('DD/MM/YYYY')}
										</span>
									</div>
								</div>
								<div className={styles['user__cover-info-item']}>
									<i className="icon-mt-clock" />
									<div>
										{translate('Activity')}:{' '}
										<span className="font-bold">
											{moment(userInfo?.updated_at).locale(language).fromNow()}
										</span>
									</div>
								</div>
								<div className={styles['user__cover-info-item']}>
									<i className="icon-mt-dollar-sign" />
									<div>
										{translate('Total income')}:{' '}
										<span className="font-bold">{formatNumber(userInfo?.coin)}</span>
									</div>
								</div>
							</div>
						</div>

						<div className={styles.user__avatar}>
							<div className={styles['user__avatar-img']}>
								<Image
									src={defaultSrc || srcAvatar}
									layout="fill"
									objectFit="cover"
									alt="avatar"
									className="rounded-full"
								/>
								{!isProfile && (
									<div className={styles['user__avatar-img-upload']}>
										<input
											type="file"
											accept="image/*"
											id="selectedFile"
											onChange={handleImageUpload}
										/>
										<i className="icon-mt-camera_enhance" />
									</div>
								)}
							</div>
							<div className={styles['user__avatar-name']}>
								<p>{userInfo?.name}</p>
								<span>Freelance</span>
							</div>
							<Button
								title={isProfile ? translate('Edit Profile') : translate('Save')}
								icon={<i className="icon-mt-edit-2" />}
								className={
									isProfile ? styles['user__avatar-btn-default'] : styles['user__avatar-btn-warning']
								}
								onClick={isProfile ? editProfile : handleSubmit(onSubmit)}
							/>
						</div>

						<div className={classnames(styles.user__content, !isProfile && styles.active)}>
							{isProfile ? (
								getValues('name') && (
									<div className={styles.detail}>
										<div className={styles.detail__title}>{translate('Full name')}</div>
										<div className={styles.detail__content}>
											<div className={styles['detail__content-text']}>{getValues('name')}</div>
										</div>
									</div>
								)
							) : (
								<div className={classnames(styles.editing, styles.name)}>
									<div className={styles.editing__name}>{translate('Full name')}</div>
									<InputComp
										className={styles.editing__input}
										name="name"
										type="text"
										placeholder={translate('Enter your account name')}
										rules={{ required: translate('Please enter your name') }}
										errors={errors}
										control={control}
									/>
								</div>
							)}

							{isProfile ? (
								getValues('education')?.name && (
									<div className={styles.detail}>
										<div className={styles.detail__title}>{translate('Education')}</div>
										<div className={styles.detail__content}>
											<div className={styles['detail__content-text']}>
												{getValues('education')?.name}
											</div>
										</div>
									</div>
								)
							) : (
								<div className={styles.editing}>
									<div className={styles.editing__name}>{translate('Education')}</div>
									<SelectComp
										className={styles.editing__select}
										name="education"
										placeholder={translate('Choose your education')}
										options={listEducation || []}
										errors={errors}
										control={control}
									/>
								</div>
							)}

							{isProfile ? (
								getValues('birthday') && (
									<div className={styles.detail}>
										<div className={styles.detail__title}>{translate('Birthday')}</div>
										<div className={styles.detail__content}>
											<div className={styles['detail__content-text']}>
												{moment(getValues('birthday')).format('DD/MM/YYYY')}
											</div>
										</div>
									</div>
								)
							) : (
								<div className={classnames(styles.editing, styles.birthday)} id="user_birthday">
									<div className={styles.editing__name}>{translate('Birthday')}</div>
									<Controller
										render={({ field: { onChange, value } }) => (
											<DatePicker
												className={styles.editing__date}
												defaultValue={moment().subtract(1, 'year')}
												value={value as unknown as Moment}
												format="DD/MM/YYYY"
												onChange={onChange}
												placeholder={translate('Choose your birthday')}
												getPopupContainer={() => document.getElementById('user_birthday')}
												allowClear={false}
												showToday={false}
												suffixIcon={<i className="icon-mt-calendar" />}
												disabledDate={(curr) => curr > moment().subtract(1, 'year')}
											/>
										)}
										name="birthday"
										control={control}
									/>
								</div>
							)}

							{isProfile ? (
								!!idGender && (
									<div className={styles.detail}>
										<div className={styles.detail__title}>{translate('Gender')}</div>
										<div className={styles.detail__content}>
											<div className={styles['detail__content-text']}>
												{+idGender === 1 && translate('Male')}
												{+idGender === 2 && translate('Female')}
												{+idGender === 3 && translate('Other')}
											</div>
										</div>
									</div>
								)
							) : (
								<div className={classnames(styles.editing, styles.gender)}>
									<div className={styles.editing__name}>{translate('Gender')}</div>
									<div className={styles.editing__gender}>
										<div
											className={styles['editing__gender-item']}
											aria-hidden
											onClick={() => selectGender(1)}
										>
											{+idGender === 1 ? (
												<i className="icon-mt-box-checked" />
											) : (
												<i className="icon-mt-box-empty" />
											)}
											<div>{translate('Male')}</div>
										</div>
										<div
											className={styles['editing__gender-item']}
											aria-hidden
											onClick={() => selectGender(2)}
										>
											{+idGender === 2 ? (
												<i className="icon-mt-box-checked" />
											) : (
												<i className="icon-mt-box-empty" />
											)}
											<div>{translate('Female')}</div>
										</div>
										<div
											className={styles['editing__gender-item']}
											aria-hidden
											onClick={() => selectGender(3)}
										>
											{+idGender === 3 ? (
												<i className="icon-mt-box-checked" />
											) : (
												<i className="icon-mt-box-empty" />
											)}
											<div>{translate('Other')}</div>
										</div>
									</div>
								</div>
							)}

							{isProfile ? (
								getValues('career')?.name && (
									<div className={styles.detail}>
										<div className={styles.detail__title}>{translate('Career')}</div>
										<div className={styles.detail__content}>
											<div className={styles['detail__content-text']}>
												{getValues('career')?.name}
											</div>
										</div>
									</div>
								)
							) : (
								<div className={styles.editing}>
									<div className={styles.editing__name}>{translate('Career')}</div>
									<SelectComp
										className={styles.editing__select111}
										name="career"
										placeholder={translate('Choose your career')}
										options={listCareer || []}
										errors={errors}
										control={control}
									/>
								</div>
							)}
						</div>
					</form>
					<div className={styles.user__right}>
						<ListUser dataList={dataHis} translate={translate} />
						<BlockChart translate={translate} />
					</div>
				</ConfigProvider>
			</div>
		</main>
	);
};

export default Tab1;
