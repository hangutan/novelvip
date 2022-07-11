import React, { useContext } from 'react';

import TableContext from '@contexts/Table';

import styles from './Pagination.module.scss';

const Pagination = () => {
	const tableCtx = useContext(TableContext);
	const { tablePage, setTablePage, parentPage, setParentPage, renderData, config } = tableCtx;
	const { fetchByPage } = config;
	const moveToNextPage = () => {
		if (renderData.length > 0) {
			if (fetchByPage && +renderData.length === +config.fetchLimit) {
				setParentPage(parentPage + 1);
			} else if (+renderData.length === +config.tableLimit) {
				setTablePage(tablePage + 1);
			}
		}
	};
	const moveToPreviousPage = () => {
		if (fetchByPage) {
			if (parentPage > 1) setParentPage(parentPage - 1);
		} else if (tablePage > 1) setTablePage(tablePage - 1);
	};
	const moveToFirstPage = () => {
		if (fetchByPage) {
			setParentPage(1);
		} else setTablePage(1);
	};
	const currentPage = fetchByPage ? parentPage : tablePage;
	return (
		<div className={styles.wrapper}>
			<button type="button" title="Trang đầu tiên" onClick={moveToFirstPage}>
				<i className="icon-mt-first_page" />
			</button>
			<button type="button" onClick={moveToPreviousPage} title="Trang trước">
				<i className="icon-mt-chevron_left" />
			</button>
			<button type="button" className={styles.number}>
				{currentPage}
			</button>
			<button type="button" onClick={moveToNextPage} title="Trang tiếp theo">
				<i className="icon-mt-chevron_right" />
			</button>
			<button type="button" title="Trang cuối cùng" onClick={moveToNextPage}>
				<i className="icon-mt-last_page" />
			</button>
		</div>
	);
};

export default Pagination;
