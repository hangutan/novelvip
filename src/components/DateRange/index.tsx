import React from 'react';
import { DatePicker } from 'antd';
import { Controller } from 'react-hook-form';
import classnames from 'classnames';
import moment, { Moment } from 'moment';

import styles from './index.module.scss';

const dateFormat = 'DD/MM/YYYY';

interface Props {
	startTitle?: string | JSX.Element;
	endTitle?: string | JSX.Element;
	name: string;
	className?: string;
	rules?: {
		start: {
			required?: string | boolean;
		};
		end: {
			required?: string | boolean;
		};
	};
	errors?: object;
	setValue?: any;
	watch?: any;
	control: any;
}

const DateRange = (props: Props) => {
	const {
		startTitle = '',
		endTitle = '',
		name,
		className,
		rules = { start: {}, end: {} },
		errors = {},
		setValue,
		watch,
		control,
	} = props;

	const begin = watch(`${name}.start`);
	const end = watch(`${name}.end`);

	return (
		<div className={classnames(styles['date-range'], className)} id="date-range">
			<div className={styles.body}>
				{!!startTitle && (
					<label
						htmlFor={`${name}-start`}
						className={classnames(styles.label, control?._formValues[name]?.start && styles.active)}
					>
						{startTitle}
					</label>
				)}
				<div>
					<i className="icon-mt-calendar" />
					<Controller
						render={({ field: { onChange, value: defaultValue } }) => (
							<DatePicker
								id={`${name}-start`}
								className={styles['date-picker']}
								value={defaultValue as unknown as Moment}
								dropdownClassName={styles['date-picker-dropdown']}
								format={dateFormat}
								allowClear={false}
								onChange={(e) => {
									onChange(moment(e).startOf('day'));
									if (e > end) {
										setValue(`${name}.end`, moment(e).add(6, 'days').endOf('day'));
									}
								}}
								disabledDate={(curr) => curr < moment().startOf('day')}
								suffixIcon={null}
								bordered={false}
								placeholder=""
								getPopupContainer={() => document.getElementById('date-range')}
							/>
						)}
						rules={rules.start}
						name={`${name}.start`}
						control={control}
					/>
				</div>
				{errors[name]?.start && <span className={styles['text-error']}>{errors[name]?.start.message}</span>}
			</div>

			<div className={styles.body}>
				{!!endTitle && (
					<label
						htmlFor={`${name}-end`}
						className={classnames(styles.label, control?._formValues[name]?.end && styles.active)}
					>
						{endTitle}
					</label>
				)}
				<div>
					<i className="icon-mt-calendar" />
					<Controller
						render={({ field: { onChange, value: defaultValue } }) => (
							<DatePicker
								id={`${name}-end`}
								className={styles['date-picker']}
								value={defaultValue as unknown as Moment}
								dropdownClassName={styles['range-picker-dropdown']}
								format={dateFormat}
								allowClear={false}
								onChange={(e) => {
									onChange(moment(e).endOf('day'));
								}}
								disabledDate={(curr) => curr < begin}
								suffixIcon={null}
								bordered={false}
								placeholder=""
								getPopupContainer={() => document.getElementById('date-range')}
							/>
						)}
						rules={rules.end}
						name={`${name}.end`}
						control={control}
					/>
				</div>
				{errors[name]?.end && <span className={styles['text-error']}>{errors[name]?.end.message}</span>}
			</div>
		</div>
	);
};

export default DateRange;
