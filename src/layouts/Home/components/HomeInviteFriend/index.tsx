import React from 'react';
import Image from 'next/image';
import classnames from 'classnames';
import Link from 'next/link';

// Constants
import Images from '@constants/image';
import { translateFunc, TranslateType } from '@utils';

import styles from './HomeInviteFriend.module.scss';

type HomeInviteProps = {
	translate: TranslateType;
};

const HomeInviteFriend = (props: HomeInviteProps) => {
	const { translate = translateFunc } = props;
	return (
		<div className={styles.bgInviteFriend}>
			<div className={styles.bgInviteFriend__title}>{translate('Invite friends to earn money')}</div>
			<div className={classnames(styles.bgInviteFriend__dlFlex, styles.bgInviteFriend__content)}>
				<div className={styles['bgInviteFriend__content-imgLeft']}>
					<Image src={Images.home_bg3} width="113.14" height="244" />
				</div>
				<div className={styles['bgInviteFriend__content-ctRight']}>
					<div className={styles.bgInviteFriend__dlFlex}>
						<Image src={Images.iconInvite1} height="45" width="45" />
						<div className={styles['bgInviteFriend__content-ctRight-text']}>
							<span className={styles['bgInviteFriend__content-ctRight-textBold']}>
								{translate('Get it now')} 5%
							</span>{' '}
							{translate('their revenue every month')}
						</div>
					</div>
					<div className={styles.bgInviteFriend__dlFlex}>
						<Image src={Images.iconInvite2} height="45" width="45" />
						<div className={styles['bgInviteFriend__content-ctRight-text']}>
							{translate('Ref will be added every first Monday of the month')}
						</div>
					</div>
					<div className={styles.bgInviteFriend__dlFlex}>
						<Image src={Images.iconInvite3} height="45" width="45" />
						<div className={styles['bgInviteFriend__content-ctRight-text']}>
							{translate('Account using Auto will not be compile Ref')}
						</div>
					</div>
					<div className={styles.bgInviteFriend__dlFlex}>
						<Image src={Images.iconInvite4} height="45" width="45" />
						<div className={styles['bgInviteFriend__content-ctRight-text']}>
							{translate('Share referral link now')}
						</div>
					</div>
				</div>
			</div>
			<Link href="/referral">
				<button type="button" className={styles.bgInviteFriend__btnFooter}>
					<div className={styles['bgInviteFriend__btnFooter-blBtn']}>
						<i className={classnames('icon-mt-send', styles['bgInviteFriend__btnFooter-icon'])} />
						<div className={styles['bgInviteFriend__btnFooter-text']}>{translate('Invite friends')}</div>
					</div>
				</button>
			</Link>
		</div>
	);
};

export default HomeInviteFriend;
