// Libraries
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import { Moment } from 'moment';
import { Dropdown } from 'antd';
// import socketIOClient from 'socket.io-client';

// Components
import Loading from '@components/Loading';
// Constants
import Images from '@constants/image';
import { menu } from '@constants/headerMenu';
import { appConfigs } from '@constants';
// Stores
import { actionTypes } from '@store/user/middleware';
import { RootState } from '@store/rootReducer';
import { setLanguage } from '@store/app/reducer';
// Utils
import SwalNotification from '@utils/swal';
import { formatNumber } from '@utils';

// Styles
import styles from './index.module.scss';

// const socket = socketIOClient('SOCKET_URL', {
// 	transports: ['websocket'],
// 	secure: true,
// });

type Props = {
	translate: (str: string, obj?: { text: string }) => string;
};

type UserInfoProps = {
	username: string;
	avatar: string;
	name: string;
	birthday: Moment | string | number;
	phone: string;
	education: string;
	email: string;
	home_town: string | number;
	gender: string | number;
	level: string | number;
	career: string;
	facebook: string;
	coin: number;
};

const Header = (props: Props) => {
	const { translate: prevTranslate = (v, t) => (t ? v.replace(/{{text}}/gi, t.text) : v) } = props;
	const dispatch = useDispatch();
	const router = useRouter();

	const userInfo = useSelector((state: RootState) => state?.User?.userInfo) as UserInfoProps;
	const token = useSelector((state: RootState) => state?.User?.token);
	const language = useSelector((state: RootState) => state?.App?.lang);

	const translate = (str, obj?) => prevTranslate(str, { ...obj, ns: 'common' });

	useEffect(() => {
		if (token) {
			dispatch({ type: actionTypes.GET_ME });
		}
	}, [token]);

	useEffect(() => {
		if (language && router.locale !== language) {
			router.push(router?.asPath, router?.asPath, {
				locale: language,
			});
		}
	}, [language]);

	useEffect(() => {
		(async () => {
			if (userInfo && userInfo?.username) {
				const { name, birthday, gender } = userInfo;
				if (router.asPath === '/list-job') {
					if (name && birthday && gender) {
						router.push('/list-job');
					} else {
						const accept = await SwalNotification({
							icon: 'warning',
							title: translate('Please fill out all information before doing the job'),
							html: '',
							showCloseButton: false,
							cancelButton: false,
							confirmButton: true,
							outsideClick: false,
						});
						if (accept) {
							router.push('/user');
						}
					}
				}
			}
		})();
		// socket.on('DEMO', async (socketIndex) => console.log(socketIndex));
		// socket.emit('DEMO', {});
	}, [userInfo]);

	const handleLogout = () => {
		dispatch({
			type: actionTypes.HANDLE_LOGOUT,
		});
	};

	const renderMenu = () =>
		menu.map((item) => (
			<div key={item.to} className={classnames(styles['header__menu-item'], item.showOnMobile && styles.mobile)}>
				<Link href={item.to === '/home' && !token ? '/' : item.to} prefetch={token ? undefined : false}>
					<a
						className={classnames(
							styles['header__menu-link'],
							item.activePath.some((val) => router?.pathname.includes(val)) && styles.active,
						)}
					>
						{typeof item.icon === 'object' && (
							<Image src={item.icon} height={24} width={24} alt="GoVip Logo" />
						)}
						{typeof item.icon === 'string' && <i className={`icon-mt-${item.icon}`} />}
						<span>{translate(item.name)}</span>
					</a>
				</Link>
			</div>
		));

	const renderUserMenu = () => (
		<div className={styles['user-menu']}>
			<div className={styles['user-menu__info']}>
				<div className={styles['user-menu__avatar']}>
					<Image src={userInfo.avatar || Images.AVATAR_USER} layout="fill" objectFit="cover" />
				</div>
				<span className={styles['user-menu__name']}>{userInfo.name}</span>
				<span className={styles['user-menu__email']}>{userInfo.email}</span>
				<span className={styles['user-menu__coin']}>{`${formatNumber(userInfo.coin)} ${
					appConfigs.CURRENCY
				}`}</span>
			</div>
			<div className={styles['user-menu__separate']} />
			<div className={styles['user-menu__nav']}>
				<div className={styles['user-menu__item']}>
					<Link href="/user" prefetch={token ? undefined : false}>
						<a className={styles['user-menu__link']}>
							<i className="icon-mt-person" />
							<span>{translate('Account information')}</span>
						</a>
					</Link>
				</div>
				{/* <div className={styles['user-menu__item']}>
					<Link href="/change-password" prefetch={token ? undefined : false}>
						<a className={styles['user-menu__link']}>
							<i className="icon-mt-password" />
							<span>{translate('Change password')}</span>
						</a>
					</Link>
				</div> */}
				<div className={styles['user-menu__item']}>
					<a
						className={styles['user-menu__link']}
						aria-hidden
						onClick={() => {
							dispatch(setLanguage({ lang: language === 'vi' ? 'en' : 'vi' }));
							router.push(router?.asPath, router?.asPath, {
								locale: language === 'vi' ? 'en' : 'vi',
							});
						}}
					>
						<i className="icon-mt-language" />
						<span>{`${translate('Language')}: ${language === 'vi' ? 'Tiếng Việt' : 'English'}`}</span>
					</a>
				</div>
				{/* <div className={styles['user-menu__item']}>
					<Link href="/settings">
						<a className={styles['user-menu__link']}>
							<i className="icon-mt-settings_suggest" />
							<span>{translate('Settings')}</span>
						</a>
					</Link>
				</div> */}
				<div className={styles['user-menu__separate']} />
				<div className={styles['user-menu__item']}>
					<a className={styles['user-menu__link']} aria-hidden onClick={handleLogout}>
						<i className="icon-mt-logout" />
						<span>{translate('Sign out')}</span>
					</a>
				</div>
			</div>
		</div>
	);

	return (
		<>
			<header className={styles.header}>
				<div className={styles.header__container}>
					<Link href={token ? '/home' : '/'} prefetch={token ? undefined : false}>
						<a className={styles.header__brand} aria-label="GoVip">
							<Image src={Images.GOVIP} height={44} width={44} alt="GoVip Logo" />
						</a>
					</Link>

					<div className={styles.header__menu}>{renderMenu()}</div>

					{token ? (
						<>
							<div className={styles.header__user} id="header__user">
								<button
									type="button"
									className={styles['header__user-notify']}
									onClick={(e) => console.log(e)}
									aria-label="notify"
								>
									<i className="icon-mt-bell" />
								</button>
								<Dropdown
									overlay={renderUserMenu()}
									trigger={['click']}
									getPopupContainer={() => document.getElementById('header__user')}
								>
									<div className={styles['header__user-avatar']}>
										<Image
											src={userInfo.avatar || Images.AVATAR_USER}
											layout="fill"
											objectFit="cover"
											alt="user avatar"
										/>
									</div>
								</Dropdown>
							</div>
						</>
					) : (
						<>
							<div className={styles['header__btn-group']}>
								{/* <button
									type="button"
									className={classnames(styles.header__btn, styles.signup)}
									onClick={() =>
										router.asPath !== '/account/register' && router.push('/account/register')
									}
								>
									{translate('Sign up')}
								</button> */}
								<button
									type="button"
									className={classnames(styles.header__btn, styles.signin)}
									onClick={() => router.asPath !== '/account/login' && router.push('/account/login')}
								>
									{translate('Sign in')}
								</button>
							</div>
						</>
					)}
				</div>
				<Loading />
			</header>
		</>
	);
};

export default Header;
