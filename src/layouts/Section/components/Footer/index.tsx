// Libraries
import Image from 'next/image';
import Link from 'next/link';

// Constants
import Images from '@constants/image';
import menu from '@constants/footerMenu';

// Styles
import styles from './index.module.scss';

type Props = {
	translate: (str: string, obj?: { text: string }) => string;
};

const Footer = (props: Props) => {
	const { translate: prevTranslate = (v, t) => (t ? v.replace(/{{text}}/gi, t.text) : v) } = props;
	const translate = (str, obj?) => prevTranslate(str, { ...obj, ns: 'common' });

	const socialList = [
		{ name: 'FACEBOOK', img: Images.FACEBOOK_SQUARE, to: 'https://facebook.com', alt: 'Facebook' },
		{ name: 'TWITTER', img: Images.TWITTER_SQUARE, to: 'https://twitter.com', alt: 'Twitter' },
		{ name: 'GOOGLE', img: Images.GOOGLE_SQUARE, to: 'https://google.com', alt: 'Google' },
		{ name: 'VIMEO', img: Images.VIMEO_SQUARE, to: 'https://vimeo.com', alt: 'Vimeo' },
	];

	const renderMenu = () =>
		menu.length > 0 &&
		menu.map((item) => (
			<div className={styles.footer__menu} key={item.name}>
				<p className={styles.footer__title}>{translate(item.name)}</p>
				<ul className={styles.footer__list}>
					{item?.sub?.map((child) => (
						<li className={styles.footer__item} key={child.name}>
							<Link href={child.to}>
								<a className={styles['footer__item-link']}>{translate(child.name)}</a>
							</Link>
						</li>
					))}
				</ul>
			</div>
		));

	return (
		<footer className={styles.footer}>
			<div className={styles.footer__wrapper}>
				<div className={styles.footer__container}>
					<div className={styles.footer__des}>
						<Image src={Images.GOVIP} height={44} width={44} alt="GoVip Logo" />
						<p>
							{translate(
								'The largest cross-platform Seeding Freelancer community in Vietnam. Free for users.',
							)}
						</p>
						<div className={styles.footer__social}>
							{socialList.length > 0 &&
								socialList.map((item) => (
									<a
										key={item.name}
										href={item.to}
										target="_blank"
										rel="noreferrer"
										aria-label={item.name}
									>
										<Image src={item.img} height={44} width={44} alt={item.alt} />
									</a>
								))}
						</div>
					</div>
					{renderMenu()}
					<div className={styles.footer__download}>
						<p className={styles.footer__title}>{translate('Download')}</p>
						<a
							href="https://play.google.com/store"
							target="_blank"
							rel="noreferrer"
							aria-label="CH Play download link"
						>
							<Image src={Images.GOOGLE_PLAY} layout="responsive" alt="CH Play download link" />
						</a>
						<a
							href="https://www.apple.com/app-store/"
							target="_blank"
							rel="noreferrer"
							aria-label="Appstore download link"
						>
							<Image src={Images.APP_STORE} layout="responsive" alt="Appstore download link" />
						</a>
					</div>
				</div>
			</div>
			<div className={styles.footer__copyright}>
				Copyright <span>©</span> 2022 Đã đăng ký bản quyền
			</div>
		</footer>
	);
};

export default Footer;
