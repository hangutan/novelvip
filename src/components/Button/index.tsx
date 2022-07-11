import styles from './styles.module.scss';

type ButtonProps = {
	type?: 'info' | 'warning' | 'danger' | 'confirm';
	icon?: JSX.Element;
	iconSuffix?: JSX.Element;
	title: string;
	className?: string;
	styles?: object;
	onClick: (params) => void;
};

const defaultClass = {
	info: styles['button-info'],
	warning: styles['button-warning'],
	danger: styles['button-danger'],
	confirm: styles['button-confirm'],
};

const reverseClass = {
	info: styles['button-info-reverse'],
	warning: styles['button-warning-reverse'],
	danger: styles['button-danger-reverse'],
	confirm: styles['button-confirm-reverse'],
};

const Button = (props: ButtonProps) => {
	const { title, icon, iconSuffix, type = 'info', className, styles, onClick } = props;

	const classname = defaultClass[type];
	const reverse = reverseClass[type];

	return (
		<button
			type="button"
			className={className || (!iconSuffix ? classname : reverse)}
			style={styles}
			onClick={onClick}
		>
			{iconSuffix || icon}
			{title}
		</button>
	);
};

export default Button;
