import React from 'react';
import { Input } from 'antd';
import classnames from 'classnames';
import { Controller, Control } from 'react-hook-form';

import { formatNumber } from '@utils';

import styles from './index.module.scss';

const { TextArea } = Input;

interface InputProps {
	title?: string | JSX.Element;
	name: string;
	className?: string;
	type: 'text' | 'number' | 'textarea';
	placeholder?: string;
	row?: number;
	prefix?: string | JSX.Element;
	suffix?: string | JSX.Element;
	disabled?: boolean;
	rules?: {
		required?: string | boolean;
		min?: number | { value: number; message: string };
		max?: number | { value: number; message: string };
	};
	errors?: object;
	control: unknown;
}

const InputComp = (props: InputProps) => {
	const {
		title = '',
		name,
		className,
		type,
		row = 3,
		placeholder,
		prefix,
		suffix,
		disabled = false,
		rules = {},
		errors = {},
		control,
	} = props;

	const renderInput = (str, onChange, defaultValue) => {
		switch (str) {
			case 'textarea': {
				return (
					<>
						{!!title && (
							<label htmlFor={name} className={styles.label}>
								{title}
							</label>
						)}
						<TextArea
							id={name}
							// rows={1}
							autoSize={{ minRows: row, maxRows: 9999 }}
							className={styles.input}
							value={defaultValue}
							placeholder={placeholder}
							spellCheck="false"
							disabled={disabled}
							bordered={false}
							onChange={onChange}
						/>
					</>
				);
			}
			case 'number': {
				return (
					<>
						{!!title && (
							<label htmlFor={name} className={styles.label}>
								{title}
							</label>
						)}
						<Input
							id={name}
							className={styles.input}
							value={formatNumber(defaultValue) === '0' ? '' : formatNumber(defaultValue)}
							prefix={prefix}
							suffix={suffix}
							placeholder={placeholder}
							spellCheck="false"
							disabled={disabled}
							bordered={false}
							onChange={(e) => {
								const num = Number(e.target.value.replace(/(,*)/g, ''));
								if (Number.isNaN(num) || num === 0) {
									onChange('');
								} else {
									onChange(num);
								}
							}}
						/>
					</>
				);
			}
			default: {
				return (
					<>
						{!!title && (
							<label htmlFor={name} className={styles.label}>
								{title}
							</label>
						)}
						<Input
							id={name}
							className={styles.input}
							value={defaultValue}
							prefix={prefix}
							suffix={suffix}
							placeholder={placeholder}
							spellCheck="false"
							disabled={disabled}
							bordered={false}
							onChange={onChange}
						/>
					</>
				);
			}
		}
	};

	return (
		<div className={classnames(styles.wrapper, className)}>
			<Controller
				render={({ field: { onChange, value: defaultValue } }) => renderInput(type, onChange, defaultValue)}
				rules={rules}
				name={name}
				control={control as Control}
			/>
			{errors[name] && <span className={styles['text-error']}>{errors[name].message}</span>}
		</div>
	);
};

export default InputComp;
