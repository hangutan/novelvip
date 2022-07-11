import { useState, useMemo, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Select, ConfigProvider, Input, Slider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';

import { FILTER } from '@constants';
import useDebounce from '@hooks/useDebounce';
import { RootState } from '@store/rootReducer';
import { actionTypes } from '@store/app/middleware';
import { getSafely, translateFunc, formatNumber } from '@utils';

import styles from './styles.module.scss';

type OptionItem = {
	id: string | number;
	name: string;
	alias: string;
	services?: object;
};

type FilterProps = {
	onClick: (filter) => void;
	translate: (str: string, obj?: { text: string | void }) => string;
};

const { Option } = Select;

const defaultFilter = {
	platform: null,
	service: null,
	package: null,
	price_per: [0, 10000],
	area: null,
	gender: null,
	career: null,
	education: '',
};

const Filter = (props: FilterProps) => {
	const dispatch = useDispatch();

	const { onClick, translate = translateFunc } = props;

	const lastFilter = useRef(null);

	const providers = useSelector((state: RootState) => state?.App?.providers || []);
	const locations = useSelector((state: RootState) => state?.App?.locations || []);
	const careers = useSelector((state: RootState) => state?.App?.careers || []);
	const language = useSelector((state: RootState) => state?.App?.lang || []);

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

	const [range, setRange] = useState<[number, number]>([0, 10000]);
	const dbRange = useDebounce(range, 500);

	const [search, setSearch] = useState('');
	const dbSearch = useDebounce(search, 400);

	// const [isShowFilter, setShowFilter] = useState(false);
	const [filter, setFilter] = useState(defaultFilter);
	const dbFilter = useDebounce(filter, 500);

	useEffect(() => {
		dispatch({ type: actionTypes.GET_PROVIDERS });
		dispatch({ type: actionTypes.GET_LOCATIONS });
		dispatch({ type: actionTypes.GET_EDUCATIONS });
		dispatch({ type: actionTypes.GET_CAREERS });
	}, []);

	useEffect(() => {
		lastFilter.current = { ...dbFilter, price: range, search: dbSearch };

		if (typeof onClick === 'function') {
			onClick({ ...dbFilter, price: range, search: dbSearch });
		}
	}, [dbFilter, dbRange, dbSearch]);

	// useEffect(() => {
	// 	const lastFilterObj = lastFilter.current || defaultFilter;

	// 	if (isShowFilter && lastFilterObj) {
	// 		setFilter(lastFilterObj);
	// 	}
	// }, [isShowFilter]);

	// const svOptions = useMemo(
	// 	() => getSafely(() => Object.values(providerOption[filter.platform.alias].services)) || [],
	// 	[filter.platform],
	// );

	// const pkOptions = useMemo(
	// 	() =>
	// 		getSafely(() =>
	// 			Object.values(providerOption[filter.platform.alias].services[filter.service.alias].packages),
	// 		) || [],
	// 	[filter.service],
	// );

	return (
		<>
			<ConfigProvider locale={language === 'vi' ? viVN : enUS}>
				<div className={styles['filter-control']}>
					<div className={styles.select__wrapper}>
						<div className={styles.select}>
							<i className={classnames(styles.select__prefix, 'icon-mt-location')} />
							<Select
								bordered={false}
								className={styles['select-list']}
								dropdownClassName={styles['select-dropdown']}
								value={filter?.area?.id}
								onClear={() => setFilter({ ...filter, area: null })}
								onSelect={(value) => {
									const option = getSafely(() => locations.find((item) => item.id === value));

									if (option && value !== filter?.area?.id) {
										setFilter({ ...filter, area: option });
									}
								}}
								allowClear
								clearIcon={<i className="icon-mt-clear" />}
								suffixIcon={<i className="icon-mt-expand_more" />}
								placeholder={translate('Area')}
							>
								{locations?.map((item) => (
									<Option key={item?.id} value={item?.id}>
										{item.name}
									</Option>
								))}
							</Select>
						</div>
						<div className={styles.select}>
							<i className={classnames(styles.select__prefix, 'icon-mt-briefcase')} />
							<Select
								bordered={false}
								className={styles['select-list']}
								dropdownClassName={styles['select-dropdown']}
								value={filter?.career?.id}
								onClear={() => setFilter({ ...filter, career: null })}
								onSelect={(value) => {
									const option = getSafely(() => careers.find((item) => item.id === value));

									if (option && value !== filter?.career?.id) {
										setFilter({ ...filter, career: option });
									}
								}}
								allowClear
								clearIcon={<i className="icon-mt-clear" />}
								suffixIcon={<i className="icon-mt-expand_more" />}
								placeholder={translate('Career')}
							>
								{careers?.map((item) => (
									<Option key={item?.id} value={item?.id}>
										{item.name}
									</Option>
								))}
							</Select>
						</div>
						<div className={styles.select}>
							<i className={classnames(styles.select__prefix, 'icon-mt-briefcase')} />
							<Select
								bordered={false}
								className={styles['select-list']}
								dropdownClassName={styles['select-dropdown']}
								value={filter?.platform?.id}
								onClear={() => setFilter({ ...filter, platform: null })}
								onSelect={(value) => {
									const option = getSafely(() =>
										Object.values(providerOption).find((item) => item.id === value),
									);

									if (option && value !== filter?.platform?.id) {
										setFilter({ ...filter, platform: option });
									}
								}}
								allowClear
								clearIcon={<i className="icon-mt-clear" />}
								suffixIcon={<i className="icon-mt-expand_more" />}
								placeholder={translate('Platform')}
							>
								{Object.values(providerOption)?.map((item) => (
									<Option key={item?.id} value={item?.id}>
										{item.name}
									</Option>
								))}
							</Select>
						</div>
					</div>
					<div className={styles.search}>
						<Input
							type="text"
							bordered={false}
							className={styles['search-wrapper']}
							defaultValue={search}
							placeholder={`${translate('Search')}...`}
							onChange={(e) => setSearch(e.target.value.replace(/^\s+|\s+$/gm, ''))}
						/>
						<i className="icon-mt-search" />
					</div>
					<div className={styles.slider}>
						<div className={styles.slider__text}>
							<span>{translate('Price')}</span>
							<span>
								<b>
									{formatNumber(range[0])} - {formatNumber(range[1])}
								</b>{' '}
								VNĐ
							</span>
						</div>
						<Slider
							range
							tipFormatter={formatNumber}
							defaultValue={range}
							min={FILTER?.PRICE?.MIN}
							max={FILTER?.PRICE?.MAX}
							step={100}
							onChange={setRange}
						/>
					</div>
				</div>
			</ConfigProvider>
		</>
	);
};

export default Filter;
