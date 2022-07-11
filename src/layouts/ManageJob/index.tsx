import classnames from 'classnames';
import { useRouter } from 'next/router';

import jobService from '@services/jobs';
import { MODE_JOB } from '@constants';
import Filter from '@components/Filter';
import useListJob from '@hooks/useListJob';
import styles from '@layouts/ListJob/styles.module.scss';

const MODE = {
	FIRST_LIST: MODE_JOB.JOB_COMPLETED,
	SECOND_LIST: MODE_JOB.JOB_APPROVED,
};

type ManageJobProps = {
	translate: (str: string, obj?: { text: string | void }) => string;
};

const ManageJob = (props: ManageJobProps) => {
	const router = useRouter();
	const { status } = router.query;

	const { translate } = props;

	const defaultMode = status === 'approved' ? MODE_JOB.JOB_APPROVED : MODE_JOB.JOB_COMPLETED;

	const getFirstList = async ({ filter, page }) => {
		const fetchData = await jobService.getYourJob(
			{
				limit: 10,
				status: 'completed',
				page,
				search: filter?.search,
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
				status: 'approved',
				page,
				search: filter?.search,
				provider_id: filter?.platform?.id,
				provider_service_id: filter?.service?.id,
				package_id: filter?.package?.id,
			},
			{ setAppLoading: true },
		);

		return fetchData;
	};

	const { mode, onClickApplyFilter, onClickChangeTab, onScrollListJob, renderListJob, switchRenderDetail } =
		useListJob({ MODE, defaultMode, styles, services: { getFirstList, getSecondList }, translate });

	return (
		<>
			<main className={styles['wrapper-list-job']}>
				<div className={styles['filter-control']}>
					<Filter onClick={onClickApplyFilter} translate={translate} />
				</div>

				<div className={styles['job-information']}>
					<div className={styles['wrapper-job-list']}>
						<div className={styles['job-header-time']}>
							<div className={styles['job-name']}>{translate('List job')}</div>
						</div>
						<div className={styles['job-header']}>
							<button
								type="button"
								className={classnames(styles['first-button'], {
									[styles.active]: mode === MODE.FIRST_LIST,
								})}
								onClick={() => onClickChangeTab(MODE.FIRST_LIST)}
							>
								{translate('Completed')}
							</button>
							<button
								type="button"
								className={classnames(styles['second-button'], {
									[styles.active]: mode === MODE.SECOND_LIST,
								})}
								onClick={() => onClickChangeTab(MODE.SECOND_LIST)}
							>
								{translate('Approved')}
							</button>
						</div>

						<div className={styles['job-list']} onScroll={onScrollListJob}>
							{renderListJob()}
						</div>
					</div>

					{switchRenderDetail()}
				</div>
			</main>
		</>
	);
};

export default ManageJob;
