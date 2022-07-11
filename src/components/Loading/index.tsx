import { useSelector } from 'react-redux';

import { RootState } from '@store/rootReducer';

import styles from './styles.module.scss';

const Loading = () => {
	const count = useSelector((state: RootState) => state.App.countLoading);

	return (
		<div className={styles['progress-loading']} style={{ display: +count > 0 ? 'block' : 'none' }}>
			<div className={styles['loading-bar']} />
		</div>
	);
};

export default Loading;
