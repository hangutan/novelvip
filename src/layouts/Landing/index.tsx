// Libraries
import React, { useEffect } from 'react';
import Head from 'next/head';

// Components
import Header from '@layouts/Section/components/Header';
import Footer from '@layouts/Section/components/Footer';
import ReviewQuestion from '@layouts/Landing/components/ReviewQuestion';
import Review from '@layouts/Landing/components/Review';
import IntroProduct from '@layouts/Landing/components/IntroProduct';
import ImageReview from '@layouts/Landing/components/ImageReview';
import ServiceArea from '@layouts/Landing/components/ServiceArea';
import IntroGovip from '@layouts/Landing/components/IntroGovip';
import Experience from '@layouts/Landing/components/Experience';

type Props = {
	translate: (str: string, obj?: { text: string }) => string;
};

const LandingPage = (props: Props) => {
	const { translate } = props;

	useEffect(() => {
		document.querySelector('body').classList.add('landing-page');

		return () => {
			document.querySelector('body').classList.remove('landing-page');
		};
	}, []);

	return (
		<>
			<Head>
				<title>Ứng dụng GoVip - Cộng đồng seeding freelancer</title>
				<meta name="description" content="GoVip - Nền tảng kiếm tiền online tốt nhất dựa trên seeding thật" />
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

				<script src="/landing1/assets/js/jquery.slim.min.js" />
				<script src="/landing1/assets/js/popper.min.js" />
				<script defer src="/landing1/assets/js/bootstrap.min.js" />

				<script async src="https://www.googletagmanager.com/gtag/js?id=UA-67849035-19" />
				<script
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{
						__html: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'UA-67849035-19', { page_path: window.location.pathname });
						`,
					}}
				/>

				<link
					rel="preload"
					as="style"
					onLoad="this.onload=null;this.rel='stylesheet'"
					type="text/css"
					href="/landing1/assets/css/bootstrap.css"
				/>
				<link
					rel="preload"
					as="style"
					onLoad="this.onload=null;this.rel='stylesheet'"
					type="text/css"
					href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
				/>
				<link
					rel="preload"
					as="style"
					onLoad="this.onload=null;this.rel='stylesheet'"
					type="text/css"
					href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
				/>

				{/* <link rel="stylesheet" type="text/css" href="/landing1/assets/css/bootstrap.css"  />
				<link
					rel="stylesheet"
					type="text/css"
					href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
				/>
				<link
					rel="stylesheet"
					type="text/css"
					href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
				/> */}

				<link rel="icon" href="/favicon.png" />
			</Head>
			<div className="main_page">
				<Header translate={translate} />

				<Review />
				<IntroProduct />
				<ImageReview />
				<ServiceArea />
				<IntroGovip />
				<ReviewQuestion />
				<Experience />
				<Footer translate={translate} />
			</div>
		</>
	);
};

export default LandingPage;
