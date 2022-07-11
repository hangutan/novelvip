import React, { FC } from 'react';
import { Radio } from 'antd';
import classnames from 'classnames';
import { Controller } from 'react-hook-form';

import styles from './index.module.scss';

interface RadioProps {
	children?: FC;
	title?: string;
	name: string;
	className?: string;
	type?: 'default' | 'button';
	options: any;
	disabled?: boolean;
	rules?: {
		required?: string | boolean;
	};
	errors?: object;
	control: any;
}

const RadioComp = (props: RadioProps) => {
	const {
		children,
		title = '',
		name,
		className,
		type = 'default',
		options,
		disabled = false,
		rules = {},
		errors = {},
		control,
	} = props;

	const renderOptions = () =>
		options?.map((item) => {
			const TypeRender = type === 'default' ? Radio : Radio.Button;
			return (
				<TypeRender key={item.id} value={item.id}>
					{item.label || item.name || item.id}
				</TypeRender>
			);
		});

	return (
		<div className={classnames(styles.radio, className)}>
			<div className={type === 'default' ? styles.default : styles.button}>
				<Controller
					render={({ field: { onChange, value: defaultValue } }) => (
						<>
							<Radio.Group
								id={name}
								className={classnames(styles.body, errors[name] && styles.error)}
								value={defaultValue?.id}
								onChange={(e) => {
									const [result] = options?.filter((item) => item.id === e.target.value);
									onChange(result);
								}}
								disabled={disabled}
							>
								{renderOptions()}
							</Radio.Group>
							{children && <div className={styles.child}>{children}</div>}
						</>
					)}
					rules={rules}
					name={name}
					control={control}
				/>
				{!!title && (
					<label
						htmlFor={name}
						className={classnames(styles.title, control?._formValues[name] && styles.active)}
					>
						{title}
						{!!rules?.required && <sup style={{ color: '#F1002B' }}> *</sup>}
					</label>
				)}
				{errors[name] && <span className={styles['text-error']}>{errors[name].message}</span>}
			</div>
		</div>
	);
};

export default RadioComp;
