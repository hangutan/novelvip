import React, { useContext } from 'react';

import TableContext from '@contexts/Table';

import List from './List';
import Pagination from './Pagination';
import styles from './TableWrapper.module.scss';

type TableWrapperProps = {
	translate: (string: string, object?: { text: string }) => string;
};

const TableWrapper = ({ translate }: TableWrapperProps) => {
	const tableCtx = useContext(TableContext);
	const { tableTitle } = tableCtx;
	return (
		<div className={styles.wrapper}>
			<h3 className="font-bold mb-3">{tableTitle}</h3>
			<List translate={translate} />
			<Pagination />
		</div>
	);
};

export default TableWrapper;
