import React, { useState } from 'react';
import { Modal } from 'antd';
import Image from 'next/image';
import classnames from 'classnames';

import Images from '@constants/image';
import { translateFunc, TranslateType } from '@utils';

import styles from './ModalSelectType.module.scss';

type ModalSelectProps = {
	isShow: boolean;
	toggle: () => void;
	translate: TranslateType;
	handleSelectType?: (v: string) => void;
};

const ModalSelectType = (props: ModalSelectProps) => {
	const { isShow, toggle, translate = translateFunc, handleSelectType } = props;
	const [typeState, setTypeState] = useState(null);

	const onChooseType = () => {
		if (typeState) {
			handleSelectType(typeState);
		}
	};

	const chooseType = (value) => {
		setTypeState(value);
	};

	return (
		<>
			<Modal
				centered
				keyboard={false}
				visible={isShow}
				onCancel={toggle}
				footer={null}
				closeIcon={<i className={classnames('icon-mt-clear', styles['close-icon'])} />}
				width="400px"
				className={styles['wrapper-select']}
			>
				<div className={styles.select}>
					<button
						type="button"
						className={classnames(styles['select__btn-bank'], typeState === 'bank' && styles.active)}
						onClick={() => chooseType('bank')}
					>
						<Image src={Images.vcb} width="130" height="130" />
					</button>
					<button
						type="button"
						className={classnames(styles['select__btn-momo'], typeState === 'momo' && styles.active)}
						onClick={() => chooseType('momo')}
					>
						<Image src={Images.momo} width="130" height="130" />
					</button>
				</div>
				<button type="button" className={styles.select__continue} onClick={onChooseType}>
					{translate('Continue')}
				</button>
			</Modal>
		</>
	);
};

export default ModalSelectType;
