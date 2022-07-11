import React from 'react';
import { useSelector } from 'react-redux';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { RootState } from '@store/rootReducer';
import { translateFunc, TranslateType } from '@utils';

import styles from './BlockChart.module.scss';

Chart.register(ArcElement, Tooltip, Legend);

type BlockProps = {
	translate: TranslateType;
};

const BlockChart = (props: BlockProps) => {
	const { translate = translateFunc } = props;
	const language = useSelector((state: RootState) => state?.App?.lang);

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'right' as const,
				labels: {
					font: {
						family: 'Quicksand, sans-serif',
						size: 14,
						weight: '500',
					},
					color: '#000',
					boxWidth: 30,
					boxHeight: 20,
				},
			},
		},
	};

	const data = {
		labels: [
			translate('Review'),
			translate('Register an account'),
			translate('Subscribe channel'),
			translate('Other'),
		],
		datasets: [
			{
				data: [120, 50, 100, 60],
				backgroundColor: ['#EAE4F2', '#C60BCC', '#FFE00C', '#7815FF'],
				hoverBackgroundColor: ['#EAE4F2', '#C60BCC', '#FFE00C', '#7815FF'],
				borderWidth: 0,
				cutout: 60,
			},
		],
	};

	const plugins = [
		{
			id: 'renderCircle',
			beforeDatasetDraw(chart) {
				const { chartArea, config } = chart;
				const cutoutDefault = {
					doughnut: 50,
					pie: 0,
				};
				const x = (chartArea.right + chartArea.left) / 2;
				const y = (chartArea.bottom + chartArea.top) / 2;
				const radius = x > y ? y : x;
				const { ctx } = chart;
				if (!['doughnut', 'pie'].includes(config.type)) return;

				const configCutout = config?.data?.datasets[0]?.cutout;

				ctx.beginPath();
				if (
					typeof configCutout === 'undefined' ||
					(typeof configCutout === 'string' && configCutout.includes('%'))
				) {
					const cutout = +`${configCutout}`.replace('%', '') || cutoutDefault[config.type];

					// Draw background circle
					ctx.arc(x, y, radius * 0.5 * (1 + cutout / 100), 0, 2 * Math.PI);
					ctx.strokeStyle = '#dfdfdf';
					ctx.lineWidth = radius * (1 - cutout / 100);
					ctx.stroke();
				}

				if (typeof configCutout === 'number') {
					const cutout = configCutout;

					// Draw background circle
					ctx.arc(x, y, (radius + cutout) * 0.5, 0, 2 * Math.PI);
					ctx.strokeStyle = '#dfdfdf';
					ctx.lineWidth = radius - cutout;
					ctx.stroke();
				}

				// Draw center text
				ctx.font = 'bold 16px Quicksand, sans-serif';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'top';

				const text = language !== 'en' ? 'Công việc \n đã làm' : 'Completed \n jobs';
				const lineHeight = 20;
				const arr = text.split('\n');
				arr.forEach((item, index) => {
					ctx.fillText(item.trim(), x, y + (index - 0.5 * arr.length) * lineHeight);
				});
			},
		},
	];

	return (
		<div className={styles.wrapper}>
			<Doughnut data={data} options={options} plugins={plugins} className={styles.chart} />
		</div>
	);
};

export default BlockChart;
