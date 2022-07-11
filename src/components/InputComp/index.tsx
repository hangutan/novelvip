import React from 'react';
import { Input } from 'antd';

import { formatNumber } from '@utils';

import importStyle from './index.module.scss';

const { TextArea } = Input;

interface InputProps {
	title?: string;
	subTitle?: string;
	placeholder?: string;
	name: string;
	type: string;
	min?: number;
	max?: number;
	prefix?: string | JSX.Element;
	suffix?: string | JSX.Element;
	value: string | number;
	styles?: {
		[key: string]: string;
	};
	handleOnChange: (key: string, value: string | number) => void;
}

export const InputComp = (props: InputProps) => {
	const {
		title = '',
		subTitle = '',
		placeholder,
		name,
		type = 'text',
		min = 0,
		max,
		prefix,
		suffix,
		value = '',
		styles = {},
		handleOnChange,
	} = props;

	const onChangeNumber = (e) => {
		const num = Number(e.target.value.replace(/(,*)/g, ''));
		if (Number.isNaN(num)) {
			handleOnChange(name, 0);
		} else if (num < min) {
			handleOnChange(name, min);
		} else if (max && num > max) {
			handleOnChange(name, max);
		} else {
			handleOnChange(name, num);
		}
	};

	const renderInput = (str) => {
		switch (str) {
			case 'textarea': {
				return (
					<TextArea
						id={name}
						style={{ maxHeight: '300px' }}
						autoSize
						value={value}
						placeholder={placeholder}
						spellCheck="false"
						onChange={(e) => handleOnChange(name, e.target.value)}
					/>
				);
			}
			case 'number': {
				return (
					<Input
						id={name}
						value={formatNumber(value)}
						min={min}
						max={max}
						prefix={prefix}
						suffix={suffix}
						placeholder={placeholder}
						spellCheck="false"
						onChange={onChangeNumber}
					/>
				);
			}
			default: {
				return (
					<Input
						id={name}
						value={value}
						prefix={prefix}
						suffix={suffix}
						placeholder={placeholder}
						spellCheck="false"
						onChange={(e) => handleOnChange(name, e.target.value)}
					/>
				);
			}
		}
	};

	return (
		<div className={styles.input}>
			<div className={styles.input__header}>
				{title && (
					<label htmlFor={name} className={styles.input__title}>
						{title}
					</label>
				)}
				{subTitle && <p className={styles.input__subtitle}>{subTitle}</p>}
			</div>

			<div className={styles.input__wrapper}>{renderInput(type)}</div>
		</div>
	);
};

const InputComponent = (props) => <InputComp styles={importStyle} {...props} />;

export default InputComponent;
