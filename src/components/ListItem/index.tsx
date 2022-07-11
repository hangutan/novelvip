import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@store/rootReducer';

import Item from './Item';
import Pagination from './Pagination';
import styles from './styles.module.scss';

type ListProps = {
	title?: string;
	config?: {
		useTop?: boolean;
		[key: string]: string | number | boolean;
	};
	isTime?: boolean;
	styleList?: object;
	styleItem?: object;
	setParentPage?: (n: number) => void;
	stylePagination?: object;
	parentPage?: number;
	originalData?: Array<{
		avatar: string;
		coin: number;
		name: string;
	}>;
};

const List = (props: ListProps) => {
	const { styleList, styleItem, title, config, parentPage, setParentPage, originalData, stylePagination, isTime } =
		props;

	const language = useSelector((state: RootState) => state?.App?.lang || []);

	return (
		<div className={styles.list} style={styleList}>
			{title ? <div className={styles.list__title}>{title}</div> : ''}

			{originalData?.length > 0 &&
				originalData?.map((item, index) => (
					<Item
						key={index}
						index={index}
						isTime={isTime}
						data={item}
						styleItem={styleItem}
						parentPage={parentPage}
						useTop={config?.useTop}
						language={(language as 'vi' | 'en') || 'vi'}
					/>
				))}

			{originalData?.length === 0 && <div className={styles.list__empty}>Danh sách rỗng</div>}

			{(originalData?.length !== 0 || parentPage !== 1) && (
				<Pagination
					config={config}
					data={originalData}
					parentPage={parentPage}
					setParentPage={setParentPage}
					stylePagination={stylePagination}
				/>
			)}
		</div>
	);
};

export default List;
