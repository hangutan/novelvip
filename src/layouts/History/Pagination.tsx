import React from 'react';

import styles from './History.module.scss';

type ListProps = {
	data?: Array<string>;
	setParentPage?: (n: number) => void;
	parentPage?: number;
	stylePagination: object;
};

const Pagination = (props: ListProps) => {
	const { parentPage, setParentPage, data, stylePagination } = props;

	const moveToPreviousPage = () => {
		if (parentPage > 1) {
			setParentPage(+parentPage - 1);
		} else {
			setParentPage(1);
		}
	};

	const moveToNextPage = () => {
		if (data?.length >= 20) {
			setParentPage(+parentPage + 1);
		} else {
			setParentPage(parentPage);
		}
	};

	return (
		<div className={styles.pagination}>
			<ul>
				<li>
					<a
						aria-hidden
						className={styles['pagination__a-left']}
						onClick={moveToPreviousPage}
						style={stylePagination}
					>
						&lt;
					</a>
					{data?.length < 20 && parentPage > 1 && (
						<a
							aria-hidden
							style={stylePagination}
							onClick={moveToPreviousPage}
							className={styles.pagination__a}
						>
							{+parentPage - 1}
						</a>
					)}
					<a className={styles['pagination__a-active']} style={stylePagination}>
						{parentPage}
					</a>
					{data?.length >= 20 && (
						<a aria-hidden style={stylePagination} onClick={moveToNextPage}>
							{+parentPage + 1}
						</a>
					)}
					<a
						aria-hidden
						className={styles['pagination__a-right']}
						onClick={moveToNextPage}
						style={stylePagination}
					>
						&gt;
					</a>
				</li>
			</ul>
		</div>
	);
};

export default Pagination;
