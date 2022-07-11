// Libraries
import { useEffect, useState, useMemo, useRef } from 'react';
import classnames from 'classnames';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ConfigProvider, Switch } from 'antd';
import moment, { Moment } from 'moment';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';
import 'moment/locale/vi';
import { useRouter } from 'next/router';
import axios from 'axios';

// Components
import CkEditor from '@components/CkEditor';
import InputComp from '@components/Input';
import SelectComp from '@components/Select';
import SliderComp from '@components/Slider';
import TooltipComp from '@components/Tooltip';
import DateRange from '@components/DateRange';
import CountUp from '@components/CountUp';
// Services
import jobServices from '@services/jobs';
import userServices from '@services/user';
// Utils
import toastr from '@utils/toastr';
import { getSafely, random, toggleCollapse } from '@utils';
// Store
import { actionTypes } from '@store/app/middleware';
import { RootState } from '@store/rootReducer';
// Constants
import { GENDERS as GENS, TIME_UNIT as TIMES, AGE_RANGE, appConfigs } from '@constants';
// Hook
import useDebounce from '@hooks/useDebounce';

// Styles
import styles from './styles.module.scss';

const ShowTabs = {
	CREATE_JOB: 'CREATE_JOB',
	STEP_JOB: 'STEP_JOB',
};

// const serviceCurrency = 'like';

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
	job?: JobType;
	translate: (str: string, obj?: { text: string | void }) => string;
};

const defaultJob = {
	isAdvanced: false,
	job_id: null,
	title: '',
	platform: null,
	service: null,
	package: null,
	area: [{ id: 0 }],
	time: 1,
	timeUnit: TIMES[2],
	career: [{ id: 0 }],
	gender: [{ id: 0 }],
	quantity: '',
	price: '',
	dateRange: {
		start: moment().startOf('day'),
		end: moment().add(6, 'days').endOf('day'),
	},
	education: [{ id: 0 }],
	age: [13, 65],
	useAge: true,
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
	const { area, career, education, gender, age, useAge } = params;

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
		area: areaIds?.length ? areaIds : null,
		career: careerIds?.length ? careerIds : null,
		education: educationIds?.length ? educationIds : null,
		gender: genderIds?.length ? genderIds : null,
		age: useAge ? { from: age[0], to: age[1] } : null,
	};
};

const CreateJob = (props: CreateJobProps) => {
	const router = useRouter();
	const dispatch = useDispatch();

	const { translate, job = defaultJob } = props;

	const [showTab, setShowTab] = useState(ShowTabs.CREATE_JOB); // STEP_JOB CREATE_JOB
	const [isCreating, setCreating] = useState(false);
	const [isAdvanced, setAdvanced] = useState(job.isAdvanced);
	const [useAge, setUseAge] = useState(job?.useAge);
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
		defaultValues: job as JobType,
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
			locations: [{ id: 0, name: translate('Not required') }, ...lcs],
			educations: [{ id: 0, name: translate('Not required') }, ...eds],
			careers: [{ id: 0, name: translate('Not required') }, ...crs],
			genders: [{ id: 0, name: translate('Not required') }, ...gds],
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

		const ftArea = area?.filter((item) => item?.id)?.length ? areaPc : 0;
		const ftAge = useAge ? agePc : 0;
		const ftGender = gender?.filter((item) => item?.id)?.length ? genderPc : 0;
		const ftEducation = education?.filter((item) => item?.id)?.length ? educationPc : 0;
		const ftCareer = career?.filter((item) => item?.id)?.length ? careerPc : 0;

		const factorFilter =
			parseFloat(ftArea) +
			parseFloat(ftAge) +
			parseFloat(ftGender) +
			parseFloat(ftEducation) +
			parseFloat(ftCareer);
		const factorTotal = isAdvanced && service ? (100 + factorFilter) / 100 : 1;

		const perPriceFilterAdvance = (+price * factorFilter) / 100;

		return {
			totalPrice: +price * +quantity * factorTotal,
			perPriceFilterAdvance,
			feeAdvanceFilter: ((+price * factorFilter) / 100) * quantity,
		};
	}, [isAdvanced, service, price, quantity, age, useAge, career, education, area, gender]);

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
		if (!dirtyFields?.title && !job.title) {
			const arr = [];
			if (randomTitle) arr.push(randomTitle);
			if (platform) arr.push(platform?.name);
			if (service) arr.push(service?.name);
			if (_package) arr.push(_package?.name);
			setValue('title', arr.join(' - '));
		}
	}, [randomTitle, platform, service, _package]);

	useEffect(() => {
		if (isAdvanced) {
			toggleCollapse('#advanced', 'open');
		}
	}, [area, career, education, gender, showTab]);

	useEffect(() => {
		if (isAdvanced) {
			getFilterAdvance({ area, career, education, gender, age: dbAge, useAge });
		}
	}, [area, career, education, gender, dbAge, useAge]);

	useEffect(() => {
		setValue('link', link.replace(/^(https:\/\/|http:\/\/)/g, ''));
	}, [link]);

	useEffect(() => {
		if (dirtyFields?.platform) {
			const [_service] = getSafely(() => Object.values(providerOption[platform.alias].services)) || [];
			const [__package] =
				getSafely(() => Object.values(providerOption[platform.alias].services[_service.alias].packages)) || [];
			setValue('service', _service);
			setValue('package', __package);
		} else {
			setValue('service', service);
			setValue('package', _package);
		}
	}, [platform]);

	useEffect(() => {
		if (dirtyFields?.service) {
			const [__package] =
				getSafely(() => Object.values(providerOption[platform.alias].services[service.alias].packages)) || [];
			setValue('package', __package);
		} else {
			setValue('package', _package);
		}
		if (price < minPrice) setValue('price', minPrice, { shouldValidate: true });
		if (quantity < minQty) setValue('quantity', minQty, { shouldValidate: true });
		if (quantity > maxQty) setValue('quantity', maxQty, { shouldValidate: true });
		clearErrors(['price', 'quantity']);
	}, [service]);

	useEffect(() => {
		if (job.title) setValue('title', job.title);
		else setValue('title', randomTitle);
		dispatch({ type: actionTypes.GET_PROVIDERS });
		dispatch({ type: actionTypes.GET_LOCATIONS });
		dispatch({ type: actionTypes.GET_EDUCATIONS });
		dispatch({ type: actionTypes.GET_CAREERS });

		getFilterAdvance({ area, career, education, gender, age: dbAge, useAge });
	}, []);

	const onClickContinue = async () => {
		if (job?.job_id) {
			setShowTab(ShowTabs.STEP_JOB);

			return false;
		}

		const getMe = await userServices.getMe({}, { setAppLoading: true });
		const coin = getMe?.data?.coin;
		const totalPrice = +price * +quantity;

		if (coin >= totalPrice) {
			setShowTab(ShowTabs.STEP_JOB);
		} else {
			toastr.error(`${translate('Your account does not have enough Coin to create this job')}!`);
		}
	};

	const handleSwitch = (e) => {
		setAdvanced(e);
		toggleCollapse('#advanced', e ? 'open' : 'close');
	};

	const renderCreateJob = () => (
		<ConfigProvider locale={language === 'vi' ? viVN : enUS}>
			<div className={styles['create-job']}>
				<InputComp
					title={translate('Title')}
					className={styles.title}
					name="title"
					type="text"
					rules={{ required: translate('Please enter {{text}}', { text: translate('Title') }) }}
					errors={errors}
					control={control}
				/>
				<SelectComp
					title={translate('Platform')}
					className={styles.platform}
					name="platform"
					options={Object.values(providerOption) || []}
					rules={{ required: translate('Please select {{text}}', { text: translate('Platform') }) }}
					errors={errors}
					control={control}
				/>
				<SelectComp
					title={translate('Service')}
					className={styles.service}
					name="service"
					options={getSafely(() => Object.values(providerOption[platform.alias].services)) || []}
					disabled={!platform}
					rules={{ required: translate('Please select {{text}}', { text: translate('Service') }) }}
					errors={errors}
					control={control}
				/>
				<SelectComp
					title={translate('Package')}
					className={styles.package}
					name="package"
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
				<div className={styles.advanced}>
					<div className={styles['toggle-collapse']}>
						<Switch checked={isAdvanced} onChange={handleSwitch} />
						<span>{`(${translate('Advanced filter')})`}</span>
						<TooltipComp
							placement="right"
							size="sm"
							title={
								<p>
									{translate('Find more relevant candidates with advanced filters')}:{' '}
									<b>{translate('Area')}</b>, <b>{translate('Age')}</b>, <b>{translate('Gender')}</b>,{' '}
									<b>{translate('Education')}</b>, <b>{translate('Career')}</b>
								</p>
							}
						>
							<i className="icon-mt-info_outline" />
						</TooltipComp>
					</div>

					<div id="advanced" aria-hidden style={{ height: 0, overflow: 'hidden' }}>
						<div className={styles['advanced-content']}>
							<SelectComp
								config={{
									isShowQuantity: true,
								}}
								title={translate('Area')}
								className={styles.area}
								name="area"
								multiple
								options={advanceFilter?.locations || []}
								rules={
									isAdvanced && {
										required: translate('Please select {{text}}', { text: translate('Area') }),
									}
								}
								errors={errors}
								control={control}
							/>
							<SliderComp
								isOpen={useAge}
								setOpen={setUseAge}
								title={translate('Age')}
								className={styles.age}
								name="age"
								min={AGE_RANGE[0]}
								max={AGE_RANGE[1]}
								rules={
									isAdvanced && {
										required: translate('Please select {{text}}', { text: translate('Age') }),
									}
								}
								errors={errors}
								control={control}
							/>
							<SelectComp
								config={{
									isShowQuantity: true,
								}}
								title={translate('Gender')}
								className={styles.gender}
								name="gender"
								multiple
								options={advanceFilter?.genders || []}
								rules={
									isAdvanced && {
										required: translate('Please select {{text}}', { text: translate('Gender') }),
									}
								}
								errors={errors}
								control={control}
							/>
							<SelectComp
								config={{
									isShowQuantity: true,
								}}
								title={translate('Education')}
								className={styles.education}
								name="education"
								multiple
								options={advanceFilter?.educations || []}
								rules={
									isAdvanced && {
										required: translate('Please select {{text}}', { text: translate('Education') }),
									}
								}
								errors={errors}
								control={control}
							/>
							<SelectComp
								config={{
									isShowQuantity: true,
								}}
								title={translate('Career')}
								className={styles.career}
								name="career"
								multiple
								options={advanceFilter?.careers || []}
								rules={
									isAdvanced && {
										required: translate('Please select {{text}}', { text: translate('Career') }),
									}
								}
								errors={errors}
								control={control}
							/>
						</div>
					</div>
				</div>
				<DateRange
					startTitle={translate('Start day')}
					endTitle={translate('End day')}
					className={styles.daterange}
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
				<div className={styles.time}>
					<InputComp
						title={translate('Working time')}
						name="time"
						type="number"
						min={0}
						rules={{ required: translate('Please enter {{text}}', { text: translate('Working time') }) }}
						errors={errors}
						control={control}
					/>
					<SelectComp
						name="timeUnit"
						options={TIME_UNIT || []}
						errors={{ timeUnit: !!errors.time }}
						control={control}
					/>
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
					className={styles.quantity}
					name="quantity"
					type="number"
					min={0}
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
							{translate('Price')}
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
					className={styles.price}
					name="price"
					type="number"
					min={0}
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
				<InputComp
					title={translate('Link')}
					className={styles.link}
					name="link"
					type="text"
					prefix="http://"
					errors={errors}
					control={control}
				/>
				<InputComp
					title={translate('Description')}
					className={styles.description}
					name="description"
					type="textarea"
					rules={{ required: translate('Please enter {{text}}', { text: translate('Description') }) }}
					errors={errors}
					control={control}
				/>
				<div className={styles.countup}>
					{isAdvanced && !!dbFeeAdvanceFilter && (
						<>
							<span className={styles.countup__candidate}>
								{translate('Candidates')}:{' '}
								<b>
									<CountUp end={filterSelect?.totalUser} /> {translate('member')}
								</b>
							</span>
							<span className={styles.countup__candidate} style={{ display: service ? 'block' : 'none' }}>
								{translate('Advanced charge')}:{' '}
								<b>
									<CountUp end={dbFeeAdvanceFilter} /> {appConfigs.CURRENCY}
								</b>
							</span>
						</>
					)}

					<span className={styles.countup__total}>
						{translate('Total')}:{' '}
						<b>
							<CountUp end={dbTotalPrice} /> {appConfigs.CURRENCY}
						</b>
					</span>
					{/* <span className={styles.countup__des}>
						{translate('You will buy')}{' '}
						<b>
							<CountUp end={+quantity} /> {serviceCurrency}
						</b>{' '}
						{translate('for')}{' '}
						<b>
							<CountUp end={+price} /> {appConfigs.CURRENCY}/{serviceCurrency}
						</b>
					</span> */}
				</div>
				<div className={styles['button-group']}>
					<button type="button" className={styles['cancel-button']} onClick={() => reset()}>
						{translate('Reset form')}
					</button>
					<button type="button" className={styles['continue-button']} onClick={handleSubmit(onClickContinue)}>
						{translate('Continue')}
					</button>
				</div>
			</div>
		</ConfigProvider>
	);

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

		if (isAdvanced) {
			params.price_advance = perPriceFilterAdvance;
			params.age = useAge ? { from: age[0], to: age[1] } : null;
			params.area = area.some((item) => item?.id === 0) ? null : area.map((item) => item?.id);
			params.education = education.some((item) => item?.id === 0) ? null : education.map((item) => item?.id);
			params.gender = gender.some((item) => item?.id === 0) ? null : gender.map((item) => item?.id);
			params.career = career.some((item) => item?.id === 0) ? null : career.map((item) => item?.id);
		}

		setCreating(true);
		let result;

		if (job?.job_id) {
			if (!isAdvanced) {
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
				toastr.success(`${translate('Update successfully')}!`);

				router.push(!job?.status ? '/my-job' : '/my-job?status=approved');
			}
		} else {
			result = await jobServices.createJob(params, { setAppLoading: true });

			if (result?.success) {
				toastr.success(`${translate('Create job successfully')}!`);

				router.push('/my-job');
			}
		}

		setCreating(false);
	};

	const onClickTurnBack = () => {
		setShowTab(ShowTabs.CREATE_JOB);
	};

	const renderStepJob = () => (
		<div className={styles['step-job']}>
			{fields.map((field, index) => {
				const { id } = field;

				return (
					<div key={id} className={styles['wrapper-step']}>
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
									{translate('Delete')}
								</button>
							)}
						</div>

						<div className={styles['single-col']}>
							<label htmlFor={`step-title-${index}`}>{translate('Title')}:</label>
							<div className="w-full relative">
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
						</div>
						<div className={styles.content}>
							<span>{translate('Content')}:</span>
							<div className="w-full relative mt-3">
								<Controller
									render={({ field: { value, onChange } }) => (
										<CkEditor data={value} setData={onChange} />
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
				);
			})}
			<button type="button" className={styles['add-step']} onClick={() => append({ title: '', content: '' })}>
				<i className="icon-mt-add_box" />
			</button>
			<div className={styles['button-group']}>
				<button type="button" className={styles['go-back-button']} onClick={onClickTurnBack}>
					{translate('Back')}
				</button>
				<button type="button" className={styles['create-button']} onClick={handleSubmit(onClickCreateJob)}>
					{job?.job_id ? translate('Update') : translate('Create job')}
				</button>
			</div>
		</div>
	);

	return (
		<div className={styles['create-job-container']}>
			<div className={styles['create-job-wrapper']}>
				<div className={styles['tab-create']}>
					<div
						aria-hidden="true"
						className={classnames(styles['tab-pane'], { [styles.active]: showTab === ShowTabs.CREATE_JOB })}
					>
						<span>
							<span>1</span>
						</span>
						{translate('Create job')}
					</div>
					<div
						aria-hidden="true"
						className={classnames(styles['tab-pane'], { [styles.active]: showTab === ShowTabs.STEP_JOB })}
					>
						<span>
							<span>2</span>
						</span>
						{translate('Create step')}
					</div>
				</div>

				{showTab === ShowTabs.CREATE_JOB ? renderCreateJob() : renderStepJob()}
			</div>
		</div>
	);
};

export default CreateJob;
