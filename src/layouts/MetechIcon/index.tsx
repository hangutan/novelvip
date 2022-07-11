// Libraries
import classnames from 'classnames';

// Utils
import { copyTextToClipboard } from '@utils';
import toast from '@utils/toastr';

// Styles
import styles from './index.module.scss';
import iconMetech from './icon';

const MetechIcon = () => {
	const onClickCopy = (text) => {
		const result = copyTextToClipboard(`<i class="${text}"></i>`);
		if (result) toast.success('Copied');
		else toast.error('Failed');
	};

	return (
		<>
			<main className={styles.icon}>
				<div className={styles.icon__container}>
					{iconMetech.map((item) => (
						<div>
							<div className={styles.icon__item} aria-hidden onClick={() => onClickCopy(item)} key={item}>
								<i className={classnames(styles.icon__icon, item)} />
								<span>{item.replace(/icon-mt-/g, '')}</span>
							</div>
						</div>
					))}
				</div>
			</main>
		</>
	);
};

export default MetechIcon;
