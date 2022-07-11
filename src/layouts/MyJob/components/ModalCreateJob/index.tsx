// Libraries
import { useEffect, useState, useMemo, useRef } from 'react';
import classnames from 'classnames';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { ConfigProvider, Switch, Modal } from 'antd';
import moment, { Moment } from 'moment';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';
import 'moment/locale/vi';
import axios from 'axios';
import { SyncOutlined } from '@ant-design/icons';

// Components
import CkEditor from '@components/CkEditor';
import InputComp from '@components/Input';
import SelectComp from '@components/Select';
import SelectMultiple from '@components/SelectMultiple';
import SliderComp from '@components/Slider';
import TooltipComp from '@components/Tooltip';
import DateRange from '@components/DateRange';
import CountUp from '@components/CountUp';
// Services
import jobServices from '@services/jobs';
import userServices from '@services/user';
// Utils
import toastr from '@utils/toastr';
import { getSafely, random, translateFunc } from '@utils';
// Store
import { RootState } from '@store/rootReducer';
// Constants
import { GENDERS as GENS, TIME_UNIT as TIMES, AGE_RANGE, appConfigs } from '@constants';
// Hook
import useDebounce from '@hooks/useDebounce';

// Styles
import styles from './styles.module.scss';

const ShowTabs = {
	STEP_1: 1,
	STEP_2: 2,
	STEP_3: 3,
	STEP_4: 4,
};

moment.locale('vi');

type OptionItem = {
	id: string | number;
	name: string;
	alias: string;
	services?: object;
	options?: object;
};

type JobType = {
	isAdvanced: boolean;
	job_id: number;
	title: string;
	platform: OptionItem | null;
	service: OptionItem | null;
	package: OptionItem | null;
	area: {
		id: string;
	}[];
	career: {
		id: string;
	}[];
	time: number;
	timeUnit: {
		id: number;
	};
	gender: {
		id: number | undefined;
	}[];
	quantity: number;
	price: number | string;
	dateRange: {
		start: string;
		end: string;
	};
	education: {
		id: number | undefined;
	}[];
	age: number[];
	useAge: boolean;
	link: string;
	description: string;
	status: number;
	steps: { title: string; content: string }[];
};

type CreateJobProps = {
	isShow: boolean;
	job?: JobType;
	toggle: () => void;
	translate: (str: string, obj?: { text: string | void }) => string;
	MODE: {
		[k: string]: string;
	};
	handleChangeTab: (v: string) => void;
	handleOnChange: (v?: string) => void;
};

const defaultJob = {
	// isAdvanced: false,
	job_id: null,
	title: '',
	platform: null,
	service: null,
	package: null,
	area: [],
	time: 1,
	timeUnit: TIMES[2],
	career: [],
	gender: [],
	quantity: '',
	price: '',
	dateRange: {
		start: moment().startOf('day'),
		end: moment().add(6, 'days').endOf('day'),
	},
	education: [],
	age: [13, 65],
	useAge: false,
	link: '',
	description: '',
	status: 0,
	steps: [
		{
			title: '',
			content: '',
		},
	],
};

const arrayToObj = (arr, key = 'id') => arr?.reduce((acc, curr) => ({ ...acc, [curr[key]]: { ...curr } }), {});

const mappingQuantity = (arr, obj, isSort = true) => {
	const mapped = arr?.map((item) => ({
		...item,
		total: obj?.[item.id]?.users_count,
	}));
	return isSort ? mapped?.sort((a, b) => b.total - a.total) : mapped;
};

const getBodyFilter = (params) => {
	const { area, career, education, gender, age, useAdvanced } = params;

	const getIds = (arr) =>
		arr.reduce((acc, curr) => {
			if (curr?.id) {
				// remove item has id is 0, this is no required selection
				return [...acc, curr?.id];
			}

			return acc;
		}, []);

	const areaIds = getIds(area);
	const careerIds = getIds(career);
	const educationIds = getIds(education);
	const genderIds = getIds(gender);

	return {
		area: useAdvanced.area && areaIds?.length ? areaIds : null,
		career: useAdvanced.career && careerIds?.length ? careerIds : null,
		education: useAdvanced.education && educationIds?.length ? educationIds : null,
		gender: useAdvanced.gender && genderIds?.length ? genderIds : null,
		age: useAdvanced.age ? { from: age[0], to: age[1] } : null,
	};
};

const ModalCreateJob = (props: CreateJobProps) => {
	const {
		isShow,
		toggle,
		job = defaultJob,
		translate = translateFunc,
		MODE,
		handleChangeTab,
		handleOnChange,
	} = props;

	const [showTab, setShowTab] = useState(ShowTabs.STEP_1);
	const [isCreating, setCreating] = useState(false);
	// const [isAdvanced, setAdvanced] = useState(job.isAdvanced);
	// const [useAge, setUseAge] = useState(job?.useAge);

	const [useAdvanced, setUseAdvanced] = useState({
		age: job?.useAge,
		area: job?.area?.length > 0,
		career: job?.career?.length > 0,
		education: job?.education?.length > 0,
		gender: job?.gender?.length > 0,
	});

	const [filterSelect, setFilterSelect] = useState({
		locations: [],
		education: [],
		careers: [],
		genders: [],
		totalUser: 0,
	});

	const cancelTokenFilterAdvance = useRef(null);

	// const userInfo = useSelector((state: RootState) => state?.User?.userInfo || []);
	const language = useSelector((state: RootState) => state?.App?.lang);
	const providers = useSelector((state: RootState) => state?.App?.providers || []);
	const locations = useSelector((state: RootState) => {
		if (!state?.App?.locations) return [];
		return [...state?.App?.locations];
	});
	const careers = useSelector((state: RootState) => {
		if (!state?.App?.careers) return [];
		return [...state?.App?.careers];
	});
	const educations = useSelector((state: RootState) => {
		if (!state?.App?.educations) return [];
		return [...state?.App?.educations];
	});

	const { TIME_UNIT, randomTitle, genders } = useMemo(
		() => ({
			genders: GENS.map((item) => ({
				...item,
				label: translate(item.label),
			})),
			randomTitle: `${translate('Campaign')} #${random(5, 'number')}`,
			TIME_UNIT: TIMES.map((item) => ({
				...item,
				label: translate(item.label),
			})),
		}),
		[translate],
	);

	const {
		reset,
		watch,
		control,
		register,
		setValue,
		handleSubmit,
		clearErrors,
		formState: { errors, dirtyFields },
	} = useForm<JobType>({
		mode: 'all',
		defaultValues: { ...job, title: job?.title || randomTitle } as JobType,
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'steps',
	});

	const [platform, service, _package, price, quantity, link, area, career, education, gender, age] = watch([
		'platform',
		'service',
		'package',
		'price',
		'quantity',
		'link',
		'area',
		'career',
		'education',
		'gender',
		'age',
	]);

	const dbAge = useDebounce(age, 300);

	const advanceFilter = useMemo(() => {
		const { locations: lcsFilter, education: edFilter, careers: crFilter, genders: gdFilter } = filterSelect;

		const lcsObj = arrayToObj(lcsFilter);
		const edObj = arrayToObj(edFilter);
		const crObj = arrayToObj(crFilter);

		const lcs = mappingQuantity(locations, lcsObj);
		const eds = mappingQuantity(educations, edObj, false);
		const crs = mappingQuantity(careers, crObj);
		const gds = genders.map((item) => ({ ...item, total: gdFilter?.[item.id] }));

		return {
			locations: lcs,
			educations: eds,
			careers: crs,
			genders: gds,
		};
	}, [locations, educations, careers, genders, filterSelect]);

	const providerOption = useMemo<Record<string, OptionItem>>(() => {
		const options = providers.reduce((acc, curr) => {
			const { services } = curr;
			const buildServices = services.reduce((accSv, currSv) => {
				const { packages } = currSv;
				const buildPackage = packages.reduce(
					(accPk, currPk) => ({
						...accPk,
						[currPk.alias]: currPk,
					}),
					{},
				);
				return {
					...accSv,
					[currSv.alias]: {
						...currSv,
						packages: buildPackage,
					},
				};
			}, {});
			return {
				...acc,
				[curr.alias]: {
					...curr,
					services: buildServices,
				},
			};
		}, {});

		return options;
	}, [providers]);

	const { minPrice, minQty, maxQty } = useMemo(() => {
		const minPrice = getSafely(() => providerOption[platform.alias].services[service.alias].min_price) || 0;
		const minQty = getSafely(() => providerOption[platform.alias].services[service.alias].min) || 0;
		const maxQty = getSafely(() => providerOption[platform.alias].services[service.alias].max) || 10000;
		return { minPrice, minQty, maxQty };
	}, [service]);

	const priceListener = useMemo(() => {
		const {
			area: areaPc,
			age: agePc,
			gender: genderPc,
			education: educationPc,
			career: careerPc,
		} = getSafely(() => service.options) || {};

		const ftArea = useAdvanced.area && area?.filter((item) => item?.id)?.length ? areaPc : 0;
		const ftAge = useAdvanced.age ? agePc : 0;
		const ftGender = useAdvanced.gender && gender?.filter((item) => item?.id)?.length ? genderPc : 0;
		const ftEducation = useAdvanced.education && education?.filter((item) => item?.id)?.length ? educationPc : 0;
		const ftCareer = useAdvanced.career && career?.filter((item) => item?.id)?.length ? careerPc : 0;

		const factorFilter =
			parseFloat(ftArea) +
			parseFloat(ftAge) +
			parseFloat(ftGender) +
			parseFloat(ftEducation) +
			parseFloat(ftCareer);
		const factorTotal = service ? (100 + factorFilter) / 100 : 1;

		const perPriceFilterAdvance = (+price * factorFilter) / 100;

		return {
			totalPrice: +price * +quantity * factorTotal,
			perPriceFilterAdvance,
			feeAdvanceFilter: ((+price * factorFilter) / 100) * quantity,
		};
	}, [service, price, quantity, age, useAdvanced, career, education, area, gender]);

	const { perPriceFilterAdvance } = priceListener;

	const { feeAdvanceFilter: dbFeeAdvanceFilter, totalPrice: dbTotalPrice } = useDebounce(priceListener, 200);

	const getFilterAdvance = async (params) => {
		if (getSafely(() => cancelTokenFilterAdvance.current.cancel)) {
			cancelTokenFilterAdvance.current.cancel();
		}

		cancelTokenFilterAdvance.current = axios.CancelToken.source();

		const body = { ...getBodyFilter(params), cancelToken: cancelTokenFilterAdvance.current.token };
		const fetchData = await jobServices.filterSelect(body, { setAppLoading: true });

		if (fetchData?.success && fetchData?.data) {
			setFilterSelect({ ...fetchData?.data, totalUser: fetchData?.data?.total_user });
		}
	};

	useEffect(() => {
		if (!dirtyFields?.title && !job?.title) {
			const arr = [];
			if (randomTitle) arr.push(randomTitle);
			if (platform) arr.push(platform?.name);
			if (service) arr.push(service?.name);
			if (_package) arr.push(_package?.name);
			setValue('title', arr.join(' - '));
		}
	}, [randomTitle, platform, service, _package]);

	useEffect(() => {
		if (Object.values(useAdvanced).some((v) => v)) {
			getFilterAdvance({ area, career, education, gender, age: dbAge, useAdvanced });
		}
	}, [area, career, education, gender, dbAge, useAdvanced]);

	useEffect(() => {
		setUseAdvanced({
			age: job?.useAge,
			area: job?.area?.length > 0,
			career: job?.career?.length > 0,
			education: job?.education?.length > 0,
			gender: job?.gender?.length > 0,
		});
	}, [job]);

	useEffect(() => {
		Object.keys(useAdvanced).forEach((key) => {
			if (!useAdvanced[key]) {
				clearErrors(key as 'area' | 'career' | 'education' | 'gender' | 'age');
			}
		});
	}, [useAdvanced]);

	useEffect(() => {
		if (isShow) {
			reset({ ...job, title: job?.title || randomTitle } as JobType);
		}
	}, [isShow]);

	useEffect(() => {
		if (link && typeof link === 'string') setValue('link', link.replace(/^(https:\/\/|http:\/\/)/g, ''));
	}, [link]);

	useEffect(() => {
		if (dirtyFields?.platform) {
			const [_service] = getSafely(() => Object.values(providerOption[platform.alias].services)) || [];
			const [__package] =
				getSafely(() => Object.values(providerOption[platform.alias].services[_service.alias].packages)) || [];
			setValue('service', _service, { shouldValidate: true });
			setValue('package', __package, { shouldValidate: true });
		} else {
			setValue('service', service);
			setValue('package', _package);
		}
	}, [platform]);

	useEffect(() => {
		if (dirtyFields?.service) {
			const [__package] =
				getSafely(() => Object.values(providerOption[platform.alias].services[service.alias].packages)) || [];
			setValue('package', __package, { shouldValidate: true });
		} else {
			setValue('package', _package);
		}
		if (price < minPrice) setValue('price', minPrice, { shouldValidate: true });
		if (quantity < minQty) setValue('quantity', minQty, { shouldValidate: true });
		if (quantity > maxQty) setValue('quantity', maxQty, { shouldValidate: true });
		clearErrors(['price', 'quantity']);
	}, [service]);

	useEffect(() => {
		// if (job.title) setValue('title', job.title);
		// else setValue('title', randomTitle);

		getFilterAdvance({ area, career, education, gender, age: dbAge, useAdvanced });
	}, []);

	const onClickContinue = async () => {
		if (job?.job_id) {
			setShowTab((prev) => (prev === 4 ? 4 : prev + 1));

			return false;
		}

		const getMe = await userServices.getMe({}, { setAppLoading: true });
		const coin = getMe?.data?.coin;
		const totalPrice = +price * +quantity;

		if (coin >= totalPrice) {
			setShowTab((prev) => (prev === 4 ? 4 : prev + 1));
		} else {
			toastr.error(`${translate('Your account does not have enough Coin to create this job')}!`);
		}
	};

	const onClickTurnBack = () => {
		if (showTab === 1) {
			reset();
			toggle();
		} else {
			setShowTab((prev) => (prev === 1 ? 1 : prev - 1));
		}
	};

	const onClickCreateJob = async (data) => {
		if (isCreating) {
			return false;
		}

		const {
			title,
			platform,
			service,
			package: _package,
			area,
			time,
			timeUnit,
			gender,
			quantity,
			price,
			dateRange,
			career,
			education,
			link,
			description,
			steps,
			age,
		} = data;

		const buildSteps = steps.map((step, index) => ({
			name: step.title || `${translate('Step')} ${index + 1}`,
			sort: index + 1,
			description: step.content,
		}));

		const params: { [k: string]: string | number | object | Moment } = {
			title,
			provider_id: platform?.id,
			provider_service_id: service?.id,
			package_id: _package?.id,
			time: +time * timeUnit?.id,
			quantity,
			price_per: price,
			total_price: dbTotalPrice,
			date_start: moment(dateRange.start).unix(),
			date_end: moment(dateRange.end).unix(),
			link: `http://${link}`,
			description,
			steps: buildSteps,
		};

		if (Object.values(useAdvanced).some((v) => v)) {
			params.price_advance = perPriceFilterAdvance;
			params.age = useAdvanced.age ? { from: age[0], to: age[1] } : null;
			params.area = useAdvanced.area && area?.length > 0 ? area.map((item) => item?.id) : null;
			params.education = useAdvanced.education && education.length > 0 ? education.map((item) => item?.id) : null;
			params.gender = useAdvanced.gender && gender.length > 0 ? gender.map((item) => item?.id) : null;
			params.career = useAdvanced.career && career.length > 0 ? career.map((item) => item?.id) : null;
		}

		setCreating(true);
		let result;

		if (job?.job_id) {
			if (Object.values(useAdvanced).every((v) => !v)) {
				params.price_advance = 0;
				params.age = null;
				params.area = null;
				params.education = null;
				params.gender = null;
				params.career = null;
			}

			result = await jobServices.updateJob(
				{
					job_id: job?.job_id,
					...params,
				},
				{ setAppLoading: true },
			);

			if (result?.success) {
				handleChangeTab(MODE.SECOND_LIST);
				await handleOnChange(MODE.THIRD_LIST);
				await handleOnChange(MODE.SECOND_LIST);

				toastr.success(`${translate('Update successfully')}!`);
				toggle();
				setShowTab(ShowTabs.STEP_1);
				reset();
			}
		} else {
			result = await jobServices.createJob(params, { setAppLoading: true });

			if (result?.success) {
				handleChangeTab(MODE.SECOND_LIST);
				await handleOnChange(MODE.SECOND_LIST);

				toastr.success(`${translate('Create job successfully')}!`);
				toggle();
				setShowTab(ShowTabs.STEP_1);
				reset();
			}
		}

		setCreating(false);
	};

	const renderStep1 = () => (
		<div className={styles.step1}>
			<InputComp
				title={translate('Title')}
				className={styles.title}
				name="title"
				type="text"
				placeholder={translate('Enter {{text}}', { text: translate('Title') })}
				rules={{ required: translate('Please enter {{text}}', { text: translate('Title') }) }}
				errors={errors}
				control={control}
			/>
			<InputComp
				title={`${translate(
					'Link job',
				)} (link tải app/link công việc/link bài đăng/... link mà khách hàng muốn người dùng phát triển )`}
				className={styles.link}
				name="link"
				type="text"
				placeholder={translate('Enter {{text}}', { text: translate('Link job') })}
				prefix="http://"
				rules={{ required: translate('Please enter {{text}}', { text: translate('Link job') }) }}
				errors={errors}
				control={control}
			/>
			<div>
				<SelectComp
					title={translate('Platform')}
					name="platform"
					placeholder={translate('Select {{text}}', { text: translate('Platform') })}
					options={Object.values(providerOption) || []}
					rules={{ required: translate('Please select {{text}}', { text: translate('Platform') }) }}
					errors={errors}
					control={control}
				/>
				<SelectComp
					title={translate('Service')}
					name="service"
					placeholder={translate('Select {{text}}', { text: translate('Service') })}
					options={getSafely(() => Object.values(providerOption[platform.alias].services)) || []}
					disabled={!platform}
					rules={{ required: translate('Please select {{text}}', { text: translate('Service') }) }}
					errors={errors}
					control={control}
				/>
				<SelectComp
					title={translate('Package')}
					name="package"
					placeholder={translate('Select {{text}}', { text: translate('Package') })}
					options={
						getSafely(() =>
							Object.values(providerOption[platform.alias].services[service.alias].packages),
						) || []
					}
					disabled={!service}
					rules={{ required: translate('Please select {{text}}', { text: translate('Package') }) }}
					errors={errors}
					control={control}
				/>
			</div>
			<div>
				<div className={styles['working-time']}>
					<label htmlFor="time">{translate('Working time')}</label>
					<div>
						<InputComp
							className={styles.time}
							name="time"
							type="number"
							placeholder={translate('Enter {{text}}', { text: translate('Working time') })}
							rules={{
								required: translate('Please enter {{text}}', { text: translate('Working time') }),
								min: {
									value: 1,
									message: `${translate('Minimum {{text}} is', { text: translate('Quantity') })} 1`,
								},
							}}
							errors={errors}
							control={control}
						/>
						<SelectComp
							className={styles.select}
							name="timeUnit"
							options={TIME_UNIT || []}
							errors={{ timeUnit: !!errors.time }}
							control={control}
						/>
					</div>
				</div>
				<InputComp
					title={
						<>
							{translate('Quantity')}
							<TooltipComp
								placement="right"
								size="sm"
								title={
									!service ? (
										<p
											// eslint-disable-next-line react/no-danger
											dangerouslySetInnerHTML={{
												__html: translate(
													'The <b>maximum</b> and <b>minimum</b> quantity depends on the selected service',
												),
											}}
										/>
									) : (
										<p>
											{translate('Minimum')}: <b>{minQty}</b>, {translate('Maximum')}:{' '}
											<b>{maxQty}</b>
										</p>
									)
								}
							>
								<i className={classnames(styles.tooltip, 'icon-mt-info_outline')} />
							</TooltipComp>
						</>
					}
					name="quantity"
					type="number"
					placeholder={translate('Enter {{text}}', { text: translate('Quantity') })}
					rules={{
						required: translate('Please enter {{text}}', { text: translate('Quantity') }),
						min: {
							value: minQty,
							message: `${translate('Minimum {{text}} is', { text: translate('Quantity') })} ${minQty}`,
						},
						max: {
							value: maxQty,
							message: `${translate('Maximum {{text}} is', { text: translate('Quantity') })} ${maxQty}`,
						},
					}}
					errors={errors}
					control={control}
				/>
				<InputComp
					title={
						<>
							{translate('Price_')}
							<TooltipComp
								placement="right"
								size="sm"
								title={
									!service ? (
										<p
											// eslint-disable-next-line react/no-danger
											dangerouslySetInnerHTML={{
												__html: translate(
													'The <b>minimum</b> price depends on the selected service',
												),
											}}
										/>
									) : (
										<p>
											{translate('Minimum {{text}} is', { text: translate('Price') })}{' '}
											<b>{minPrice}</b> {appConfigs.CURRENCY}
										</p>
									)
								}
							>
								<i className={classnames(styles.tooltip, 'icon-mt-info_outline')} />
							</TooltipComp>
						</>
					}
					name="price"
					type="number"
					placeholder={translate('Enter {{text}}', { text: translate('Price_') })}
					suffix={appConfigs.CURRENCY}
					rules={{
						required: translate('Please enter {{text}}', { text: translate('Price') }),
						min: {
							value: minPrice,
							message: `${translate('Minimum {{text}} is', { text: translate('Price') })} ${minPrice} ${
								appConfigs.CURRENCY
							}`,
						},
					}}
					errors={errors}
					control={control}
				/>
			</div>
			<DateRange
				startTitle={translate('Start day')}
				endTitle={translate('End day')}
				name="dateRange"
				rules={{
					start: { required: translate('Please enter {{text}}', { text: translate('Start day') }) },
					end: { required: translate('Please enter {{text}}', { text: translate('End day') }) },
				}}
				errors={errors}
				setValue={setValue}
				watch={watch}
				control={control}
			/>
		</div>
	);

	const renderStep2 = () => (
		<div className={styles.step2}>
			<div className={styles.item}>
				{translate('Gender')}
				<div className={styles.switch}>
					<Switch
						size="small"
						checked={!useAdvanced?.gender}
						onChange={(e) => setUseAdvanced({ ...useAdvanced, gender: !e })}
					/>
					{translate('Not required')}
				</div>
				<SelectMultiple
					config={{
						isShowQuantity: true,
					}}
					className={styles.item__select}
					name="gender"
					placeholder={translate('Select {{text}}', { text: translate('Gender') })}
					disabled={!useAdvanced?.gender}
					options={advanceFilter?.genders || []}
					rules={{
						validate: (value) => {
							if (!useAdvanced?.gender) return true;
							if (value.length > 0) return true;
							return translate('Please select {{text}}', { text: translate('Gender') });
						},
					}}
					errors={errors}
					control={control}
				/>
			</div>
			<div className={styles.item}>
				<SliderComp
					checked={!useAdvanced?.age}
					setChecked={(e) => setUseAdvanced({ ...useAdvanced, age: !e })}
					title={translate('Age')}
					name="age"
					min={AGE_RANGE[0]}
					max={AGE_RANGE[1]}
					rules={{
						validate: (value) => {
							if (!useAdvanced?.age) return true;
							if (value.length > 0) return true;
							return translate('Please select {{text}}', { text: translate('Age') });
						},
					}}
					translate={translate}
					errors={errors}
					control={control}
				/>
			</div>
			<div className={styles.item}>
				{translate('Area')}
				<div className={styles.switch}>
					<Switch
						size="small"
						checked={!useAdvanced?.area}
						onChange={(e) => setUseAdvanced({ ...useAdvanced, area: !e })}
					/>
					{translate('Not required')}
				</div>
				<SelectMultiple
					config={{
						isShowQuantity: true,
					}}
					className={styles.item__select}
					name="area"
					placeholder={translate('Select {{text}}', { text: translate('Area') })}
					disabled={!useAdvanced?.area}
					options={advanceFilter?.locations || []}
					rules={{
						validate: (value) => {
							if (!useAdvanced?.area) return true;
							if (value.length > 0) return true;
							return translate('Please select {{text}}', { text: translate('Area') });
						},
					}}
					errors={errors}
					control={control}
				/>
			</div>
			<div className={styles.item}>
				{translate('Education')}
				<div className={styles.switch}>
					<Switch
						size="small"
						checked={!useAdvanced?.education}
						onChange={(e) => setUseAdvanced({ ...useAdvanced, education: !e })}
					/>
					{translate('Not required')}
				</div>
				<SelectMultiple
					config={{
						isShowQuantity: true,
					}}
					className={styles.item__select}
					name="education"
					placeholder={translate('Select {{text}}', { text: translate('Education') })}
					disabled={!useAdvanced?.education}
					options={advanceFilter?.educations || []}
					rules={{
						validate: (value) => {
							if (!useAdvanced?.education) return true;
							if (value.length > 0) return true;
							return translate('Please select {{text}}', { text: translate('Education') });
						},
					}}
					errors={errors}
					control={control}
				/>
			</div>
			<div className={styles.item}>
				{translate('Career')}
				<div className={styles.switch}>
					<Switch
						size="small"
						checked={!useAdvanced?.career}
						onChange={(e) => setUseAdvanced({ ...useAdvanced, career: !e })}
					/>
					{translate('Not required')}
				</div>
				<SelectMultiple
					config={{
						isShowQuantity: true,
					}}
					className={styles.item__select}
					name="career"
					placeholder={translate('Select {{text}}', { text: translate('Career') })}
					disabled={!useAdvanced?.career}
					options={advanceFilter?.careers || []}
					rules={{
						validate: (value) => {
							if (!useAdvanced?.career) return true;
							if (value.length > 0) return true;
							return translate('Please select {{text}}', { text: translate('Career') });
						},
					}}
					errors={errors}
					control={control}
				/>
			</div>
		</div>
	);

	const renderStep3 = () => (
		<div className={styles.step3}>
			<InputComp
				title={translate('Description')}
				name="description"
				type="textarea"
				row={9}
				placeholder={translate('Enter {{text}}', { text: translate('Description') })}
				rules={{ required: translate('Please enter {{text}}', { text: translate('Description') }) }}
				errors={errors}
				control={control}
			/>
		</div>
	);

	const renderStep4 = () => (
		<div className={styles.step4}>
			{fields.map((field, index) => (
				<div key={field.id} className={styles['wrapper-step']}>
					<div className={styles['order-step']}>
						<span>
							{translate('Step')} {index + 1}:
						</span>
						{fields.length > 1 && (
							<button
								type="button"
								className={styles['delete-button']}
								onClick={() => (fields.length > 1 ? remove(index as unknown as number) : undefined)}
							>
								<i className="icon-mt-trash" />
							</button>
						)}
					</div>
					<div className={styles['single-col']}>
						<label htmlFor={`step-title-${index}`}>{translate('Title')}:</label>
						<input
							{...register(`steps.${index}.title`, {
								required: translate('Please enter {{text}}', { text: translate('Title') }),
							})}
							spellCheck={false}
							id={`step-title-${index}`}
							type="text"
							className="w-full"
						/>
						{errors.steps?.[index]?.title && (
							<span className={styles['error-text']}>{errors.steps[index].title.message}</span>
						)}
					</div>
					<div className={styles.content}>
						<span>{translate('Content')}:</span>
						<div className={styles.content__body}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<CkEditor data={value || ''} setData={onChange} />
								)}
								rules={{
									required: translate('Please enter {{text}}', { text: translate('Content') }),
								}}
								name={`steps.${index}.content`}
								control={control}
							/>

							{errors.steps?.[index]?.content && (
								<span className={styles['error-text']}>{errors.steps[index].content.message}</span>
							)}
						</div>
					</div>
				</div>
			))}
			<button type="button" className={styles['add-step']} onClick={() => append({ title: '', content: '' })}>
				<i className="icon-mt-plus" />
				{translate('Add')}
			</button>
		</div>
	);

	const switchRenderStep = () => {
		switch (showTab) {
			case ShowTabs.STEP_1: {
				return renderStep1();
			}
			case ShowTabs.STEP_2: {
				return renderStep2();
			}
			case ShowTabs.STEP_3: {
				return renderStep3();
			}
			case ShowTabs.STEP_4: {
				return renderStep4();
			}
			default:
				return null;
		}
	};

	const renderButton = () => (
		<div className={styles['button-group']}>
			<button type="button" className={styles['cancel-button']} onClick={() => onClickTurnBack()}>
				<i className="icon-mt-chevron_left" />
				{translate('Back')}
			</button>
			{showTab !== ShowTabs.STEP_4 ? (
				<button type="button" className={styles['continue-button']} onClick={handleSubmit(onClickContinue)}>
					<i className="icon-mt-chevron_right" />
					{translate('Continue')}
				</button>
			) : (
				<button type="button" className={styles['create-button']} onClick={handleSubmit(onClickCreateJob)}>
					{!isCreating ? (
						<i className="icon-mt-done" />
					) : (
						<SyncOutlined spin style={{ fontSize: 24, marginRight: 10 }} />
					)}
					{job?.job_id ? translate('Update') : translate('Create job')}
				</button>
			)}
		</div>
	);

	return (
		<>
			<Modal
				keyboard={false}
				visible={isShow}
				destroyOnClose
				onCancel={() => {
					setShowTab(ShowTabs.STEP_1);
					reset();
					toggle();
				}}
				footer={null}
				closeIcon={(() => (
					<i className={classnames('icon-mt-clear', styles['close-icon'])} />
				))()}
				width="100vw"
				className={styles['wrapper-create-job']}
			>
				<div className={styles['create-job__container']}>
					<h4 className={styles['create-job__title']}>
						{job?.job_id ? translate('Update Job') : translate('Create new Job')}
					</h4>
					<div className={styles['create-job__wrapper']}>
						<div className="mx-3">
							<div className={styles['tab-create']}>
								<div
									className={classnames(
										styles['tab-pane'],
										showTab >= ShowTabs.STEP_1 && styles.active,
										showTab === ShowTabs.STEP_1 && styles.show,
									)}
									aria-hidden
									onClick={() => showTab >= ShowTabs.STEP_1 && setShowTab(ShowTabs.STEP_1)}
								>
									<div className={styles.step}>
										<span>1</span>
									</div>
									<div className={styles.des}>
										<p>{translate('Step')} 1</p>
										<span>{translate('Configure the type of work and services')}</span>
									</div>
								</div>
								<div
									className={classnames(
										styles['tab-pane'],
										showTab >= ShowTabs.STEP_2 && styles.active,
										showTab === ShowTabs.STEP_2 && styles.show,
									)}
									aria-hidden
									onClick={() => showTab >= ShowTabs.STEP_2 && setShowTab(ShowTabs.STEP_2)}
								>
									<div className={styles.step}>
										<span>2</span>
									</div>
									<div className={styles.des}>
										<p>{translate('Step')} 2</p>
										<span>{translate('Configure the requirement of member')}</span>
									</div>
								</div>
								<div
									className={classnames(
										styles['tab-pane'],
										showTab >= ShowTabs.STEP_3 && styles.active,
										showTab === ShowTabs.STEP_3 && styles.show,
									)}
									aria-hidden
									onClick={() => showTab >= ShowTabs.STEP_3 && setShowTab(ShowTabs.STEP_3)}
								>
									<div className={styles.step}>
										<span>3</span>
									</div>
									<div className={styles.des}>
										<p>{translate('Step')} 3</p>
										<span>{translate('Describe work and services')}</span>
									</div>
								</div>
								<div
									className={classnames(
										styles['tab-pane'],
										showTab >= ShowTabs.STEP_4 && styles.active,
										showTab === ShowTabs.STEP_4 && styles.show,
									)}
									aria-hidden
									onClick={() => showTab >= ShowTabs.STEP_4 && setShowTab(ShowTabs.STEP_4)}
								>
									<div className={styles.step}>
										<span>4</span>
									</div>
									<div className={styles.des}>
										<p>{translate('Step')} 4</p>
										<span>{translate('Build steps to do')}</span>
									</div>
								</div>

								<div className={styles.countup}>
									<p className={styles.countup__title}>{translate('Total')}</p>
									<p className={styles.countup__total}>
										<CountUp end={dbTotalPrice} /> {appConfigs.CURRENCY}
									</p>

									{!!dbFeeAdvanceFilter && (
										<>
											<p className={styles.countup__candidate}>
												{translate('There are')}{' '}
												<b>
													<CountUp end={filterSelect?.totalUser} />
												</b>{' '}
												{translate('qualified members')}
											</p>
											{/* <span
											className={styles.countup__candidate}
											style={{ display: service ? 'block' : 'none' }}
										>
											{translate('Advanced charge')}:{' '}
											<b>
												<CountUp end={dbFeeAdvanceFilter} /> {appConfigs.CURRENCY}
											</b>
										</span> */}
										</>
									)}
								</div>
							</div>
						</div>

						<div className="flex flex-col mx-3 mt-6 lg:mt-0">
							<ConfigProvider locale={language === 'vi' ? viVN : enUS}>
								{switchRenderStep()}
								<div className={classnames(styles.countup, styles.mobile)}>
									<p className={styles.countup__title}>{translate('Total')}</p>
									<p className={styles.countup__total}>
										<CountUp end={dbTotalPrice} /> {appConfigs.CURRENCY}
									</p>

									{!!dbFeeAdvanceFilter && (
										<>
											<p className={styles.countup__candidate}>
												{translate('There are')}{' '}
												<b>
													<CountUp end={filterSelect?.totalUser} />
												</b>{' '}
												{translate('qualified members')}
											</p>
											{/* <span
											className={styles.countup__candidate}
											style={{ display: service ? 'block' : 'none' }}
										>
											{translate('Advanced charge')}:{' '}
											<b>
												<CountUp end={dbFeeAdvanceFilter} /> {appConfigs.CURRENCY}
											</b>
										</span> */}
										</>
									)}
								</div>
								{renderButton()}
							</ConfigProvider>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default ModalCreateJob;
