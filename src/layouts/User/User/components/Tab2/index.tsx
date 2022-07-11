import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Moment } from 'moment';
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { RootState } from '@store/rootReducer';
import Button from '@components/Button';
import { formatNumber, translateFunc, TranslateType } from '@utils';
import withdrawApi from '@services/withdraw';

import ListUser from '../ListUser';
import ModalRecharge from '../ModalRecharge';
import ModalWithdraw from '../ModalWithdraw';
import ModalSelectType from '../ModalSelectType';

// Services

import styles from './Tab2.module.scss';

Chart.register(CategoryScale, LinearScale, BarElement);

const { getWithdrawHistory } = withdrawApi;

type Tab2Props = {
	translate: TranslateType;
};

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
};

const Tab2 = (props: Tab2Props) => {
	const { translate = translateFunc } = props;
	const route = useRouter();
	const [type, setType] = useState('recharge');
	const [typeChoose, setTypeChoose] = useState('bank');

	const [isShow, setShow] = useState(false);
	const toggle = () => setShow(!isShow);
	const [isShow1, setShow1] = useState(false);
	const toggle1 = () => setShow1(!isShow1);
	const [isShow2, setShow2] = useState(false);
	const toggle2 = () => setShow2(!isShow2);

	const [dataHis, setDataHis] = useState([]);

	const userInfo = useSelector((state: RootState) => state?.User?.userInfo) as UserInfoProps;

	const getHistory = async () => {
		const res = await getWithdrawHistory({ limit: 6 }, { setAppLoading: true });
		if (res.success) {
			setDataHis(res?.data);
		}
	};

	useEffect(() => {
		getHistory();
	}, []);

	const setModalMoney = (data) => {
		setShow2(false);
		setTypeChoose(data);
		if (type === 'recharge') {
			setShow(true);
		} else {
			setShow1(true);
		}
	};

	const openModalSelect = (data) => {
		setType(data);
		setShow2(true);
	};

	const onChangeHistory = () => {
		route.push('/history');
	};

	const data = {
		labels: [
			'Tháng 1',
			'Tháng 2',
			'Tháng 3',
			'Tháng 4',
			'Tháng 5',
			'Tháng 6',
			'Tháng 7',
			'Tháng 8',
			'Tháng 9',
			'Tháng 10',
			'Tháng 11',
			'Tháng 12',
		],
		datasets: [
			{
				label: '# of Votes',
				data: [12, 19, 3, 5, 2, 3, 7, 9, 14, 4, 9, 13],
				backgroundColor: '#FFF298',
				borderColor: '#FFF298',
				borderWidth: 1,
				borderRadius: 10,
			},
		],
		scales: {
			xAxes: [
				{
					type: 'category',
					stacked: true,
					ticks: { mirror: true, stepSize: 1 },
				},
			],
			yAxes: [
				{
					stacked: true,
					ticks: { mirror: true },
					gridLines: {
						drawBorder: false,
					},
				},
			],
		},
	};

	return (
		<>
			<main className={styles.bg_tab2}>
				<div className={classnames('container', styles.tab2)}>
					<div className={classnames('lg:flex', styles.tab2__main)}>
						<div
							className={classnames('lg:w-2/3 relative md:w-full sm:w-full', styles['tab2__main-blLeft'])}
						>
							<div className={styles['tab2__main-blLeft-bl1']}>
								<div className={styles['tab2__main-blLeft-bl1-blHeader']}>
									<div className={styles['tab2__main-blLeft-bl1-blHeader-title']}>
										{translate('Your wallet')}
									</div>
									<div className={styles['tab2__main-blLeft-bl1-blButtonRight']}>
										<Button
											title={translate('Recharge')}
											icon={<i className="icon-mt-plus-square mr-1" />}
											className={classnames(
												'flex',
												styles['tab2__main-blLeft-bl1-blButtonRight-button'],
												styles['tab2__main-blLeft-bl1-blButtonRight-button-mr2'],
											)}
											onClick={() => openModalSelect('recharge')}
										/>
										<Button
											title={translate('Withdraw')}
											icon={<i className="icon-mt-credit_card mr-1" />}
											className={classnames(
												'flex',
												styles['tab2__main-blLeft-bl1-blButtonRight-button'],
												styles['tab2__main-blLeft-bl1-blButtonRight-button-bgYellow'],
											)}
											onClick={() => openModalSelect('withdraw')}
										/>
									</div>
								</div>
								<div className={styles['tab2__main-blLeft-bl1-blText']}>
									<span className={styles['tab2__main-blLeft-bl1-blText-iconMoney']}>$ </span>
									<span className={styles['tab2__main-blLeft-bl1-blText-money']}>
										{formatNumber(userInfo?.coin)}
									</span>{' '}
									VNĐ
								</div>
							</div>
							<div className={styles['tab2__main-blLeft-bl2']}>
								<Bar
									data={data}
									width={400}
									height={300}
									options={{
										maintainAspectRatio: false,
									}}
								/>
							</div>
						</div>
						<div
							className={classnames(
								'lg:w-1/3 relative md:w-full sm:w-full',
								styles['tab2__main-blRight'],
							)}
						>
							<div className={styles['tab2__main-blRight-blButton']}>
								<div className={styles['tab2__main-blRight-blButton-textLeft']}>
									{translate('Transaction history')}
								</div>
								<div
									aria-hidden
									className={styles['tab2__main-blRight-blButton-textRight']}
									onClick={onChangeHistory}
								>
									{translate('View all')}
								</div>
							</div>
							<ListUser dataList={dataHis} translate={translate} />
						</div>
					</div>
				</div>
			</main>
			<ModalRecharge isShow={isShow} toggle={toggle} translate={translate} type={typeChoose} />
			<ModalWithdraw isShow={isShow1} toggle={toggle1} translate={translate} type={typeChoose} />
			<ModalSelectType isShow={isShow2} toggle={toggle2} translate={translate} handleSelectType={setModalMoney} />
		</>
	);
};

export default Tab2;
