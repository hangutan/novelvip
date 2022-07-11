import { Tooltip } from 'antd';
import classnames from 'classnames';

import styles from './index.module.scss';

interface Props {
	title: string | JSX.Element;
	children: string | JSX.Element;
	placement?:
		| 'top'
		| 'topLeft'
		| 'topRight'
		| 'left'
		| 'leftTop'
		| 'leftBottom'
		| 'bottom'
		| 'bottomLeft'
		| 'bottomRight'
		| 'right'
		| 'rightTop'
		| 'rightBottom';
	trigger?: 'hover' | 'focus' | 'click';
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
	getPopupContainer?: () => HTMLElement;
}

const TooltipComp = (props: Props) => {
	const {
		title,
		children,
		placement = 'top',
		trigger = 'hover',
		size = 'xs',
		getPopupContainer = () => document.getElementById('section__body'),
	} = props;

	return (
		<Tooltip
			title={title}
			overlayClassName={classnames(styles.tooltip, styles[`tooltip__${size}`])}
			placement={placement}
			trigger={trigger}
			getPopupContainer={getPopupContainer}
		>
			{children}
		</Tooltip>
	);
};

export default TooltipComp;
