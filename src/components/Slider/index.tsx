import React from 'react';
import { Slider, Switch } from 'antd';
import classnames from 'classnames';
import { Controller } from 'react-hook-form';

import { translateFunc } from '@utils';

import styles from './index.module.scss';

interface Props {
	checked?: boolean;
	setChecked?: (boolean) => void;
	title?: string | JSX.Element;
	name: string;
	className?: string;
	min: number;
	max: number;
	rules?: any;
	translate:
		| ((str: string, obj?: { text: string | void }) => string)
		| ((v: string, t?: { text?: string; ns?: string }) => string);
	errors?: object;
	control: any;
}

const SelectComp = (props: Props) => {
	const {
		checked,
		setChecked,
		title,
		name,
		className,
		min = 0,
		max = 200,
		rules = {},
		translate = translateFunc,
		errors = {},
		control,
	} = props;

	return (
		<div className={classnames(styles.slider, className)}>
			{!!title && (
				<>
					<label htmlFor={name} className={styles.title}>
						{title}
					</label>
					<div className={styles.switch}>
						<Switch size="small" checked={checked} onChange={setChecked} />
						{translate('Not required')}
					</div>
				</>
			)}
			<Controller
				render={({ field: { onChange, value: defaultValue } }) => (
					<div className={classnames(styles.content, { [styles.disable]: checked })}>
						<span>{defaultValue[0]}</span>
						<Slider range min={min} max={max} value={defaultValue} onChange={onChange} />
						<span>{defaultValue[1]}</span>
					</div>
				)}
				rules={rules}
				name={name}
				control={control}
			/>

			{errors[name] && <span className={styles['text-error']}>{errors[name].message}</span>}
		</div>
	);
};

export default SelectComp;
