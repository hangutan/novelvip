// Libraries
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Images from '@constants/image';

import styles from './styles.module.scss';

type Props = {
	isSection?: boolean;
	statusCode: number;
};

const NotFound = (props: Props) => {
	const router = useRouter();
	const { isSection = false, statusCode } = props;

	const title = {
		'404': 'Page Not Found',
		'502': 'Bad Gateway',
	};

	const renderError = () => {
		switch (statusCode) {
			case 502:
				return (
					<>
						<div className={styles.main__header}>
							<span>5</span>
							<div className={styles['main__header-icon']}>
								<Image src={Images.WOW_ICON} width={160} height={160} alt="Create job" />
							</div>
							<span>2</span>
						</div>
						<div className={styles.main__body}>Bad Gateway</div>
					</>
				);
			case 404:
				return (
					<>
						<div className={styles.main__header}>
							<span>4</span>
							<div className={styles['main__header-icon']}>
								<Image src={Images.WOW_ICON} width={160} height={160} alt="Create job" />
							</div>
							<span>4</span>
						</div>
						<div className={styles.main__body}>
							{router.locale === 'vi'
								? 'Trang bạn tìm kiếm hiện không tồn tại hoặc đã thay đổi đường dẫn'
								: 'The page you were looking for was moved or doesn&apos;t exist'}
						</div>
					</>
				);
			default:
				return (
					<>
						<div className={styles.main__header}>
							<span>5</span>
							<div className={styles['main__header-icon']}>
								<Image src={Images.SAD_ICON} width={160} height={160} alt="Create job" />
							</div>
							<div className={styles['main__header-icon']}>
								<Image src={Images.SAD_ICON} width={160} height={160} alt="Create job" />
							</div>
						</div>
						<div className={styles.main__body}>
							{router.locale === 'vi'
								? 'Đã có lỗi xảy ra. Chúng tôi sẽ khắc phục sớm nhất có thể'
								: 'Sorry, something went wrong. We are working on it and we&apos;ll get it fixed as soon as we can'}
						</div>
					</>
				);
		}
	};

	return (
		<>
			<Head>
				<title>{title[statusCode] || 'Something went wrong'}</title>
				{!isSection && (
					<>
						<meta
							name="description"
							content="GoVip - Nền tảng kiếm tiền online tốt nhất dựa trên seeding thật"
						/>
						<meta
							name="robots"
							content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large"
						/>
						<meta property="og:locale" content="vi_VN" />
						<meta property="og:type" content="website" />
						<meta property="og:title" content="Ứng dụng GoVip - Cộng đồng seeding freelancer" />
						<meta
							property="og:description"
							content="GoVip - Nền tảng kiếm tiền online tốt nhất dựa trên seeding thật"
						/>
						<meta property="og:url" content="https://govip.online/" />
						<meta property="og:site_name" content="Ứng dụng GoVip - Cộng đồng seeding freelancer" />
						<meta property="og:updated_time" content="2022-02-14T07:28:39+00:00" />

						<meta name="twitter:card" content="summary_large_image" />
						<meta name="twitter:title" content="Ứng dụng GoVip - Cộng đồng seeding freelancer" />
						<meta
							name="twitter:description"
							content="GoVip - Nền tảng kiếm tiền online tốt nhất dựa trên seeding thật"
						/>

						<link rel="icon" href="/favicon.png" />
					</>
				)}
			</Head>
			<main className={styles.main}>
				{renderError()}
				<div className={styles.main__footer}>
					<button type="button" onClick={() => router.push('/home')}>
						{router.locale === 'vi' ? 'TRỞ VỀ TRANG CHỦ' : 'BACK TO HOME'}
					</button>
				</div>
				<span style={{ display: 'none' }}>{statusCode}</span>
			</main>
		</>
	);
};

export default NotFound;
