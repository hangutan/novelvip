import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import classnames from 'classnames';
import { Modal } from 'antd';
import { SwitcherOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { isEqual } from 'lodash';

import toastr from '@utils/toastr';
// import usePrevious from '@hooks/usePrevious';
import { getSafely, timeWatch, translateFunc } from '@utils';
import JobItem from '@components/JobItem';
import JobDetail from '@components/JobDetail';

export default function useListJob(props) {
	const router = useRouter();
	const { id, MODE, defaultMode, styles, services, translate = translateFunc, handleEditJob } = props;

	const [mode, setMode] = useState(defaultMode || MODE.FIRST_LIST);
	// const prevMode = usePrevious(mode);

	const [isLimitJob, setLimitJob] = useState(false);

	const [isMobile, setMobile] = useState(false);
	const [isShowDetail, setShowDetail] = useState(false);

	const [isLoading, setLoading] = useState(false);

	const [filter, setFilter] = useState(null);

	const [firstList, setFirstList] = useState([]);
	const [pageFirstList, setPageFirstList] = useState<number | boolean>(1);

	const [secondList, setSecondList] = useState([]);
	const [pageSecondList, setPageSecondList] = useState<number | boolean>(1);

	const [thirdList, setThirdList] = useState([]);
	const [pageThirdList, setPageThirdList] = useState<number | boolean>(1);

	const [fourthList, setFourthList] = useState([]);
	const [pageFourthList, setPageFourthList] = useState<number | boolean>(1);

	const [detailJob, setDetailJob] = useState({
		id: '',
		job_id: '',
		title: '',
		author: {
			avatar: '',
			name: '',
			created_at: '',
		},
		provider_id: '',
		provider_service_id: '',
		package_id: '',
		gender: null,
		area: null,
		education: null,
		career: null,
		age: null,
		reason: '',
		quantity: 0,
		price_per: 0,
		price_advance: 0,
		count_is_run: 0,
		date_start: '',
		date_end: '',
		description: '',
		status: -1,
	});

	const firstFilter = useRef(null);
	const secondFilter = useRef(null);
	const thirdFilter = useRef(null);
	const fourthFilter = useRef(null);
	const isFirstTime = useRef([defaultMode || MODE.FIRST_LIST]);
	const timingReload = useRef(null);

	function getFirstList({ filter, page }) {
		return async () => {
			if (!services.getFirstList) return [];
			setLoading(true);
			const fetchJobs = await services.getFirstList({ filter, page });

			setLoading(false);

			const jobs = fetchJobs?.data || [];

			if (jobs?.length < 10) {
				setPageFirstList(false); // has no more data
			}

			if (['/list-job'].includes(router.asPath)) {
				clearInterval(timingReload.current);

				const idTiming = timeWatch(`time-watch-${id}`, getFirstList({ filter, page }), translate);
				timingReload.current = idTiming;
			}

			return fetchJobs;
		};
	}

	const getSecondList = async ({ filter, page }) => {
		if (!services.getSecondList) return [];
		setLoading(true);

		const fetchJobs = await services.getSecondList({ filter, page });
		setLoading(false);

		const jobs = fetchJobs?.data || [];

		if (jobs?.length < 10) {
			setPageSecondList(false); // has no more data
		}

		return fetchJobs;
	};

	const getThirdList = async ({ filter, page }) => {
		if (!services.getThirdList) return [];
		setLoading(true);

		const fetchJobs = await services.getThirdList({ filter, page });
		setLoading(false);

		const jobs = fetchJobs?.data || [];

		if (jobs?.length < 10) {
			setPageThirdList(false); // has no more data
		}

		return fetchJobs;
	};

	const getFourthList = async ({ filter, page }) => {
		if (!services.getFourthList) return [];
		setLoading(true);

		const fetchJobs = await services.getFourthList({ filter, page });
		setLoading(false);

		const jobs = fetchJobs?.data || [];

		if (jobs?.length < 10) {
			setPageFourthList(false); // has no more data
		}

		return fetchJobs;
	};

	const handleWhenChangeFilter = async (asMode = mode) => {
		switch (asMode) {
			case MODE.FIRST_LIST: {
				if (pageFirstList !== 1) setPageFirstList(1);

				const fetchJobs = await getFirstList({ filter, page: 1 })();

				const jobs = fetchJobs?.data || [];

				setFirstList(jobs);
				setDetailJob(jobs[0] || {});

				break;
			}
			case MODE.SECOND_LIST: {
				if (pageSecondList !== 1) setPageSecondList(1);

				const fetchJobs = await getSecondList({ filter, page: 1 });

				const jobs = fetchJobs?.data || [];

				setSecondList(jobs);
				setDetailJob(jobs[0] || {});

				break;
			}
			case MODE.THIRD_LIST: {
				if (pageThirdList !== 1) setPageThirdList(1);

				const fetchJobs = await getThirdList({ filter, page: 1 });

				const jobs = fetchJobs?.data || [];

				setThirdList(jobs);
				setDetailJob(jobs[0] || {});

				break;
			}
			case MODE.FOURTH_LIST: {
				if (pageFourthList !== 1) setPageFourthList(1);

				const fetchJobs = await getFourthList({ filter, page: 1 });

				const jobs = fetchJobs?.data || [];

				setFourthList(jobs);
				setDetailJob(jobs[0] || {});

				break;
			}
			default: {
				break;
			}
		}
	};

	const onScrollListJob = (event) => {
		try {
			if (isLoading) return false;

			if (event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight < 1) {
				switch (mode) {
					case MODE.FIRST_LIST: {
						setPageFirstList((page) => page && (page as number) + 1);
						break;
					}
					case MODE.SECOND_LIST: {
						setPageSecondList((page) => page && (page as number) + 1);
						break;
					}
					case MODE.THIRD_LIST: {
						setPageThirdList((page) => page && (page as number) + 1);
						break;
					}
					case MODE.FOURTH_LIST: {
						setPageFourthList((page) => page && (page as number) + 1);
						break;
					}
					default: {
						break;
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	const onClickChangeTab = (tab) => {
		// Because when load data, only load one tab

		switch (tab) {
			case MODE.FIRST_LIST: {
				if (isLimitJob) {
					toastr.error(`${translate('Please complete the current job')}!`);

					return false;
				}

				setMode(MODE.FIRST_LIST);
				firstFilter.current = filter;

				if (isFirstTime.current.indexOf(MODE.FIRST_LIST) < 0) {
					isFirstTime.current.push(MODE.FIRST_LIST);
					handleWhenChangeFilter(MODE.FIRST_LIST);

					return false;
				}

				if (!isEqual(filter, firstFilter.current)) {
					handleWhenChangeFilter(MODE.FIRST_LIST);
				} else {
					setDetailJob(firstList[0] || {});
				}

				break;
			}
			case MODE.SECOND_LIST: {
				setMode(MODE.SECOND_LIST);
				secondFilter.current = filter;

				if (isFirstTime.current.indexOf(MODE.SECOND_LIST) < 0) {
					isFirstTime.current.push(MODE.SECOND_LIST);
					handleWhenChangeFilter(MODE.SECOND_LIST);

					return false;
				}

				if (!isEqual(filter, secondFilter.current)) {
					handleWhenChangeFilter(MODE.SECOND_LIST);
				} else {
					setDetailJob(secondList[0] || {});
				}

				break;
			}
			case MODE.THIRD_LIST: {
				setMode(MODE.THIRD_LIST);
				thirdFilter.current = filter;

				if (isFirstTime.current.indexOf(MODE.THIRD_LIST) < 0) {
					isFirstTime.current.push(MODE.THIRD_LIST);
					handleWhenChangeFilter(MODE.THIRD_LIST);

					return false;
				}

				if (!isEqual(filter, thirdFilter.current)) {
					handleWhenChangeFilter(MODE.THIRD_LIST);
				} else {
					setDetailJob(thirdList[0] || {});
				}

				break;
			}
			case MODE.FOURTH_LIST: {
				setMode(MODE.FOURTH_LIST);
				fourthFilter.current = filter;

				if (isFirstTime.current.indexOf(MODE.FOURTH_LIST) < 0) {
					isFirstTime.current.push(MODE.FOURTH_LIST);
					handleWhenChangeFilter(MODE.FOURTH_LIST);

					return false;
				}

				if (!isEqual(filter, fourthFilter.current)) {
					handleWhenChangeFilter(MODE.FOURTH_LIST);
				} else {
					setDetailJob(fourthList[0] || {});
				}

				break;
			}

			default: {
				break;
			}
		}
	};

	useLayoutEffect(() => {
		const { body } = document;

		if (body.offsetWidth < 1024) {
			setMobile(true);
		} else {
			setMobile(false);
		}
	}, []);

	useEffect(() => {
		(async () => {
			// Just special for /list-job: get second list, if it has value => lock change to first list
			if (['/list-job'].includes(router.asPath)) {
				const fetchJobs = await getSecondList({ filter: {}, page: 1 });

				const jobs = fetchJobs?.data || [];

				setSecondList(jobs);

				if (jobs?.length) {
					setLimitJob(true);
					onClickChangeTab(MODE.SECOND_LIST);

					if (!detailJob?.id) {
						setDetailJob(jobs[0]);
					}
				} else {
					const fetchJobs = await getFirstList({ filter: {}, page: 1 })();

					const jobs = fetchJobs?.data || [];

					setFirstList(jobs);

					if (!detailJob?.id) {
						setDetailJob(jobs[0]);
					}
				}

				return false;
			}

			handleWhenChangeFilter();
		})();
	}, []);

	useEffect(() => {
		if (typeof document !== undefined) {
			document.body.addEventListener('scroll', onScrollListJob);
			return () => document.body.removeEventListener('scroll', onScrollListJob);
		}
	}, [isLoading, mode]);

	useEffect(() => {
		(async () => {
			if (getSafely(() => Object.keys(filter).length)) {
				handleWhenChangeFilter();
			}
		})();
	}, [filter]);

	useEffect(() => {
		(async () => {
			if (pageFirstList > 1) {
				const fetchJobs = await getFirstList({ filter, page: pageFirstList })();

				const jobs = fetchJobs?.data || [];

				setFirstList((currList) => [...currList, ...jobs]);
			}
		})();
	}, [pageFirstList]);

	useEffect(() => {
		(async () => {
			if (pageSecondList > 1) {
				const fetchJobs = await getSecondList({ filter, page: pageSecondList });

				const jobs = fetchJobs?.data || [];

				setSecondList((currList) => [...currList, ...jobs]);
			}
		})();
	}, [pageSecondList]);

	useEffect(() => {
		(async () => {
			if (pageThirdList > 1) {
				const fetchJobs = await getThirdList({ filter, page: pageThirdList });

				const jobs = fetchJobs?.data || [];

				setThirdList((currList) => [...currList, ...jobs]);
			}
		})();
	}, [pageThirdList]);

	useEffect(() => {
		(async () => {
			if (pageFourthList > 1) {
				const fetchJobs = await getFourthList({ filter, page: pageFourthList });

				const jobs = fetchJobs?.data || [];

				setFourthList((currList) => [...currList, ...jobs]);
			}
		})();
	}, [pageFourthList]);

	const onClickApplyFilter = (filter) => {
		setFilter(filter);
	};

	const onCallbackJobDetail = async (action) => {
		switch (action.type) {
			case 'EDIT_JOB': {
				const id = action.payload;
				handleEditJob(id);
				// setMode(MODE.THIRD_LIST);

				break;
			}
			case 'REMOVE_JOB':
			case 'CANCEL_JOB': {
				const id = action.payload;

				switch (mode) {
					case MODE.FIRST_LIST: {
						const foundIndex = firstList.findIndex((item) => item.id === id);

						if (foundIndex < 0) {
							return false;
						}

						const listJob = firstList.filter((item) => item.id !== id);
						const newActive = listJob[foundIndex] || getSafely(() => listJob.slice(-1)[0]) || listJob[0];

						setFirstList(listJob);
						setDetailJob(newActive || {});

						break;
					}
					case MODE.SECOND_LIST: {
						const foundIndex = secondList.findIndex((item) => item.id === id);

						if (foundIndex < 0) {
							return false;
						}

						const listJob = secondList.filter((item) => item.id !== id);
						const newActive = listJob[foundIndex] || getSafely(() => listJob.slice(-1)[0]) || listJob[0];

						setSecondList(listJob);
						setDetailJob(newActive || {});

						if (!listJob?.length && ['/list-job'].includes(router.asPath)) {
							const fetchJobs = await getSecondList({ filter: {}, page: 1 });

							const jobs = fetchJobs?.data || [];

							if (jobs?.length) {
								setLimitJob(true);
							} else {
								setLimitJob(false);
							}
						}
						break;
					}
					case MODE.THIRD_LIST: {
						const foundIndex = thirdList.findIndex((item) => item.id === id);

						if (foundIndex < 0) {
							return false;
						}

						const listJob = thirdList.filter((item) => item.id !== id);
						const newActive = listJob[foundIndex] || getSafely(() => listJob.slice(-1)[0]) || listJob[0];

						setThirdList(listJob);
						setDetailJob(newActive || {});

						if (!listJob?.length && ['/list-job'].includes(router.asPath)) {
							const fetchJobs = await getThirdList({ filter: {}, page: 1 });

							const jobs = fetchJobs?.data || [];

							if (jobs?.length) {
								setLimitJob(true);
							} else {
								setLimitJob(false);
							}
						}
						break;
					}
					default: {
						break;
					}
				}

				setShowDetail(false);

				break;
			}
			default: {
				break;
			}
		}
	};

	const switchRenderDetail = () => {
		if (isMobile) {
			return (
				<Modal
					title={(() => (
						<h4 className="font-bold m-0">{translate('Job information')}</h4>
					))()}
					visible={isShowDetail}
					onOk={() => setShowDetail(false)}
					onCancel={() => setShowDetail(false)}
					width={600}
					centered
					footer={null}
					closeIcon={(() => (
						<i className={classnames('icon-mt-clear', styles['close-icon'])} />
					))()}
					className={styles['wrapper-job-detail-modal']}
				>
					<JobDetail
						mode={mode}
						isActive={
							!!firstList?.length || !!secondList?.length || !!thirdList?.length || !!fourthList?.length
						}
						callback={onCallbackJobDetail}
						translate={translate}
						{...detailJob}
					/>
				</Modal>
			);
		}

		return (
			<JobDetail
				mode={mode}
				isActive={!!firstList?.length || !!secondList?.length || !!thirdList?.length || !!fourthList?.length}
				callback={onCallbackJobDetail}
				translate={translate}
				{...detailJob}
			/>
		);
	};

	const onClickSelectJob = (job) => {
		setDetailJob(job);

		if (isMobile) {
			setShowDetail(true);
		}
	};

	const renderListJob = () => {
		switch (mode) {
			case MODE.FIRST_LIST: {
				return firstList?.length ? (
					firstList.map((job) => (
						<JobItem
							key={job?.id}
							mode={mode}
							isActive={+job?.id === +detailJob?.id}
							onClick={() => onClickSelectJob(job)}
							translate={translate}
							{...job}
						/>
					))
				) : (
					<div className={styles['job-list-empty']}>
						<SwitcherOutlined />
						{translate('No jobs yet')}!
					</div>
				);
			}
			case MODE.SECOND_LIST: {
				return secondList?.length ? (
					secondList.map((job) => (
						<JobItem
							key={job?.id}
							mode={mode}
							isActive={+job?.id === +detailJob?.id}
							onClick={() => onClickSelectJob(job)}
							translate={translate}
							{...job}
						/>
					))
				) : (
					<div className={styles['job-list-empty']}>
						<SwitcherOutlined />
						{translate('No jobs yet')}!
					</div>
				);
			}
			case MODE.THIRD_LIST: {
				return thirdList?.length ? (
					thirdList.map((job) => (
						<JobItem
							key={job?.id}
							mode={mode}
							isActive={+job?.id === +detailJob?.id}
							onClick={() => onClickSelectJob(job)}
							translate={translate}
							{...job}
						/>
					))
				) : (
					<div className={styles['job-list-empty']}>
						<SwitcherOutlined />
						{translate('No jobs yet')}!
					</div>
				);
			}
			case MODE.FOURTH_LIST: {
				return fourthList?.length ? (
					fourthList.map((job) => (
						<JobItem
							key={job?.id}
							mode={mode}
							isActive={+job?.id === +detailJob?.id}
							onClick={() => onClickSelectJob(job)}
							translate={translate}
							{...job}
						/>
					))
				) : (
					<div className={styles['job-list-empty']}>
						<SwitcherOutlined />
						{translate('No jobs yet')}!
					</div>
				);
			}
			default:
		}
	};

	return {
		mode,
		onClickApplyFilter,
		onClickChangeTab,
		onScrollListJob,
		renderListJob,
		switchRenderDetail,
		handleWhenChangeFilter,
	};
}
