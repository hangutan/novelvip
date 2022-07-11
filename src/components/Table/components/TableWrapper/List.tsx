import React, { useContext } from 'react';

import TableContext from '@contexts/Table';

import Item from './Item';

type ListProps = {
	translate: (string: string, object?: { text: string }) => string;
};

const List = ({ translate }: ListProps) => {
	const tableCtx = useContext(TableContext);
	const { renderData } = tableCtx;
	return (
		<div>
			{renderData?.map((item) => (
				<Item
					translate={translate}
					key={item?.user?.id || item?.user?.username || Math.random() * 9999999999}
					row={item}
				/>
			))}
		</div>
	);
};

export default List;
