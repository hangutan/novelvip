import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { RootState } from '@store/rootReducer';
import jobService from '@services/jobs';
import { MODE_JOB } from '@constants';
import Filter from '@components/Filter';
import Tabs from '@components/Tabs';
import useListJob from '@hooks/useListJob';

import styles from './styles.module.scss';

const MODE = {
	FIRST_LIST: MODE_JOB.JOB_CURRENT,
	SECOND_LIST: MODE_JOB.JOB_PROCESSING,
	THIRD_LIST: MODE_JOB.JOB_COMPLETED,
	FOURTH_LIST: MODE_JOB.JOB_APPROVED,
};

type ListJobProps = {
	translate: (str: string, obj?: { text: string | void }) => string;
};

const ListJob = (props: ListJobProps) => {
	const router = useRouter();
	const { status } = router.query;

	const { translate } = props;

	const listTabs = [
		{ id: MODE.FIRST_LIST, label: translate('Available Job') },
		{ id: MODE.SECOND_LIST, label: translate('Received Job') },
		{ id: MODE.THIRD_LIST, label: translate('Completed Job') },
		{ id: MODE.FOURTH_LIST, label: translate('Approved Job') },
	];

	const defaultMode = () => {
		switch (status) {
			case 'received':
				return MODE_JOB.JOB_PROCESSING;
			case 'completed':
				return MODE_JOB.JOB_COMPLETED;
			case 'approved':
				return MODE_JOB.JOB_APPROVED;
			default:
				return MODE_JOB.JOB_CURRENT;
		}
	};

	const language = useSelector((state: RootState) => state?.App?.lang);

	const getFirstList = async ({ filter, page }) => {
		const fetchData = await jobService.getListJob(
			{
				limit: 10,
				page,
				search: filter?.search,
				price_per: filter?.price,
				area: filter?.area?.id,
				career: filter?.career?.id,
				provider_id: filter?.platform?.id,
				provider_service_id: filter?.service?.id,
				package_id: filter?.package?.id,
			},
			{ setAppLoading: true },
		);

		return fetchData;
	};

	const getSecondList = async ({ filter, page }) => {
		const fetchData = await jobService.getYourJob(
			{
				limit: 10,
				status: 'processing',
				page,
				search: filter?.search,
				price_per: filter?.price,
				area: filter?.area?.id,
				career: filter?.career?.id,
				provider_id: filter?.platform?.id,
				provider_service_id: filter?.service?.id,
				package_id: filter?.package?.id,
			},
			{ setAppLoading: true },
		);

		return fetchData;
	};

	const getThirdList = async ({ filter, page }) => {
		const fetchData = await jobService.getYourJob(
			{
				limit: 10,
				status: 'completed',
				page,
				search: filter?.search,
				price_per: filter?.price,
				area: filter?.area?.id,
				career: filter?.career?.id,
				provider_id: filter?.platform?.id,
				provider_service_id: filter?.service?.id,
				package_id: filter?.package?.id,
			},
			{ setAppLoading: true },
		);

		return fetchData;
	};

	const getFourthList = async ({ filter, page }) => {
		const fetchData = await jobService.getYourJob(
			{
				limit: 10,
				status: 'approved',
				page,
				search: filter?.search,
				price_per: filter?.price,
				area: filter?.area?.id,
				career: filter?.career?.id,
				provider_id: filter?.platform?.id,
				provider_service_id: filter?.service?.id,
				package_id: filter?.package?.id,
			},
			{ setAppLoading: true },
		);

		return fetchData;
	};

	const { mode, onClickApplyFilter, onClickChangeTab, renderListJob, switchRenderDetail } = useListJob({
		id: language,
		MODE,
		defaultMode: defaultMode(),
		styles,
		services: { getFirstList, getSecondList, getThirdList, getFourthList },
		translate,
	});

	return (
		<>
			<Tabs mode={mode} listTab={listTabs} handleOnChange={onClickChangeTab} />
			<main className={styles['wrapper-list-job']}>
				<div className={styles['job-container']}>
					<Filter onClick={onClickApplyFilter} translate={translate} />

					<div className={styles['job-information']}>
						{/* <div className={styles['wrapper-job-list']}>
							<div className={styles['job-header-time']}>
								<div className={styles['job-name']}>{translate('List job')}</div>
								<div
									id={`time-watch-${language}`}
									className={styles['job-time']}
									style={{ display: mode === MODE.FIRST_LIST ? 'block' : 'none' }}
								>
									{translate('Looking for jobs')}...
								</div>
							</div>
							<div className={styles['job-header']}>
								<button
									type="button"
									className={classnames(styles['first-button'], {
										[styles.active]: mode === MODE.FIRST_LIST,
									})}
									onClick={onClickChangeTab(MODE.FIRST_LIST)}
								>
									{translate('Available')}
								</button>
								<button
									type="button"
									className={classnames(styles['second-button'], {
										[styles.active]: mode === MODE.SECOND_LIST,
									})}
									onClick={onClickChangeTab(MODE.SECOND_LIST)}
								>
									{translate('Received')}
								</button>
							</div>

							<div className={styles['job-list']} onScroll={onScrollListJob}>
								{renderListJob()}
							</div>
						</div> */}

						<div className={styles['job-list']}>{renderListJob()}</div>

						<div className={styles['wrapper-job-detail']}>{switchRenderDetail()}</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default ListJob;
