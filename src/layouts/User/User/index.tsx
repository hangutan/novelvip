import React, { useState } from 'react';

import { MODE_JOB } from '@constants';
import { translateFunc, TranslateType } from '@utils';
import Tabs from '@components/Tabs';

import Tab1 from './components/Tab1';
import Tab2 from './components/Tab2';

const MODE = {
	FIRST_LIST: MODE_JOB.JOB_CURRENT,
	SECOND_LIST: MODE_JOB.JOB_PROCESSING,
	THIRD_LIST: MODE_JOB.JOB_COMPLETED,
};

type UserProps = {
	translate: TranslateType;
};

const User = (props: UserProps) => {
	const [mode, setMode] = useState(MODE.FIRST_LIST);
	const { translate = translateFunc } = props;

	const onClickChangeTab = (tab) => {
		setMode(tab);
	};

	const listTabs = [
		{ id: MODE.FIRST_LIST, label: translate('Personal information') },
		// { id: MODE.SECOND_LIST, label: translate('Bank account link') },
		{ id: MODE.THIRD_LIST, label: translate('Your wallet') },
	];

	return (
		<>
			<Tabs mode={mode} listTab={listTabs} handleOnChange={onClickChangeTab} />
			{mode === MODE.FIRST_LIST ? <Tab1 translate={translate} /> : <Tab2 translate={translate} />}
		</>
	);
};

export default User;
