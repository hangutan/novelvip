import React from 'react';
import { Select } from 'antd';
import classnames from 'classnames';
import { Controller } from 'react-hook-form';

import { getSafely } from '@utils';

import styles from './index.module.scss';

const { Option } = Select;

interface Props {
	config?: {
		isShowQuantity: boolean;
	};
	title?: string | JSX.Element;
	name: string;
	placeholder?: string;
	className?: string;
	options: {
		id: string | number;
		label: string;
		name: string;
		total: number;
	}[];
	disabled?: boolean;
	rules?: any;
	errors?: object;
	control: any;
}

const SelectMultipleComp = (props: Props) => {
	const {
		config = {
			isShowQuantity: false,
		},
		title,
		name,
		placeholder,
		className,
		options,
		disabled = false,
		rules = {},
		errors = {},
		control,
	} = props;

	const { isShowQuantity } = config;

	return (
		<div className={classnames(styles.select, className)} id={`${name}__select`}>
			{!!title && (
				<label htmlFor={name} className={styles.title}>
					{title}
				</label>
			)}
			<Controller
				render={({ field: { onChange, value: defaultValue } }) => (
					<Select
						id={name}
						style={{ width: '100%' }}
						mode="multiple"
						allowClear
						showSearch
						className={classnames(styles.select__select, errors[name] && styles.error)}
						value={Array.isArray(defaultValue) ? defaultValue?.map((item) => item?.id) : []}
						optionFilterProp="children"
						filterOption={(input, option) =>
							option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
						suffixIcon={
							<>
								<i className={classnames(styles.search, 'icon-mt-search')} />
								<i className={classnames(styles.expand_more, 'icon-mt-expand_more')} />
							</>
						}
						clearIcon={<i className="icon-mt-clear" />}
						menuItemSelectedIcon={<i className="icon-mt-done" />}
						disabled={disabled}
						getPopupContainer={() => document.getElementById(`${name}__select`)}
						placeholder={placeholder}
						bordered={false}
						showArrow
						onChange={(e) => {
							const result = e.map((item) => options?.find((option) => option.id === item));

							onChange(result);
						}}
					>
						{options?.map((item) => (
							<Option key={item.id} value={item.id}>
								{item.label || item.name || item.id}{' '}
								{isShowQuantity &&
									!!item.id &&
									(typeof item?.total === 'undefined' ? '' : `(${item?.total})`)}
							</Option>
						))}
					</Select>
				)}
				rules={rules}
				name={name}
				control={control}
			/>
			{errors[name] && <span className={styles['text-error']}>{errors[name].message}</span>}
		</div>
	);
};

export default SelectMultipleComp;
