/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import TableContext from '@contexts/Table';
import { translateFunc } from '@utils';

import TableWrapper from './components/TableWrapper';
import { dataItem } from './types';

const TableComponent = ({ originalData, tableTitle, config, parentPage, setParentPage, translate = translateFunc }) => {
	const [tablePage, setTablePage] = useState(1);
	const { fetchByPage, fetchLimit, tableLimit } = config;
	// data mapped thêm rank & page number
	const data = originalData.map((item: dataItem, index: number) => {
		if (index === 0) {
			item.first = true;
		} else if (index === 1) {
			item.second = true;
		} else if (index === 2) {
			item.third = true;
		} else {
			item.normal = true;
		}
		const renderLimit = fetchByPage ? fetchLimit : tableLimit;
		const pageNumber = Math.ceil((index + 1) / renderLimit);
		item.pageNumber = pageNumber;
		return item;
	});
	// data tương ứng với page
	let renderData = [];
	if (fetchByPage) {
		renderData = [...originalData];
	} else {
		renderData = data?.filter((item: dataItem) => item?.pageNumber === tablePage);
	}
	return (
		<>
			<TableContext.Provider
				value={{ data, renderData, tableTitle, config, tablePage, setTablePage, parentPage, setParentPage }}
			>
				<TableWrapper translate={translate} />
			</TableContext.Provider>
		</>
	);
};

TableComponent.propTypes = {
	originalData: PropTypes.instanceOf(Array),
	tableTitle: PropTypes.string,
	config: PropTypes.instanceOf(Object),
	parentPage: PropTypes.number,
	setParentPage: PropTypes.func,
	translate: PropTypes.func,
};

export default TableComponent;
