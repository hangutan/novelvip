import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import classnames from 'classnames';

import Images from '@constants/image';
import { random } from '@utils';

import styles from './styles.module.scss';

const features = [
	{
		date: '15/3/2022',
		key: random(8),
		name: 'Hà Ngủ Tân',
		image: Images.AVT2,
		description:
			'Govip là 1 trang kiếm tiền rất uy tín, buổi tối rãnh không có gì làm thì ngồi làm govip cũng vui mà còn có thêm thu nhập',
	},
	{
		date: '08/3/2022',
		key: random(8),
		name: 'Nguyễn Văn Minh',
		image: Images.AVT1,
		description:
			'Trang web này có thể giúp mình kiếm thêm thu nhập để có tiền trang trải cuộc sống cho mình bạn sinh viên như mình',
	},
	{
		date: '01/4/2022',
		key: random(8),
		name: 'Hiệp Hoàng',
		image: Images.AVT4,
		description:
			'Trang web rút tiền rất nhanh và làm việc cũng dễ, tháng này mình kiếm hơn 7tr từ nó rồi, thấy vui hẵn',
	},
	{
		date: '01/3/2022',
		key: random(8),
		name: 'Hồng Vân',
		image: Images.AVT6,
		description:
			'Cảm ơn govip đã giúp cho mình kiếm thêm thu nhập trong khi còn đi học, trang trải cho cuộc sống của mình',
	},
	{
		date: '24/2/2022',
		key: random(8),
		name: 'Nguyễn Quang Minh',
		image: Images.AVT3,
		description:
			'Có ngày mình làm được 1 job hơn 500k mà cũng chỉ mất hơn 1 tiếng, thấy vui hẵn ra, có tiền ăn chơi cả tuần',
	},
	{
		date: '16/01/2022',
		key: random(8),
		name: 'Trường Khỉ',
		image: Images.AVT5,
		description:
			'Cảm ơn govip đã tạo thêm thu nhập cho mình trong những lúc rãnh rỗi, giờ không còn lo tối rãnh không có gì làm rồi',
	},
];

const ReviewQuestion = () => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					infinite: true,
					dots: true,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	return (
		<section id="features" className={classnames(styles['screenshots-area'], 'ptb_100')}>
			<div className="container">
				<div className="row">
					<div className={styles.bl_btn}>
						<button type="submit" className={classnames(styles.btn1, styles.active)}>
							Đánh giá
						</button>
						{/* <button type="submit" className={styles.btn1}>
							Câu hỏi thường gặp
						</button> */}
					</div>
				</div>
				<div className={styles.bl_slide}>
					<div className={styles['app-screenshots']}>
						<Slider {...settings}>
							{features.map((feature) => (
								<div key={feature.key} className={styles['item-slide']}>
									<div className={styles['item-slide__header']}>
										<div className={styles['item-slide__display-flex']}>
											<i className={classnames(styles['item-slide__public'], 'icon-mt-public')} />
											<span className={styles['item-slide__ml5']}>{feature.date}</span>
										</div>
										<div className={styles['item-slide__display-flex']}>
											<i className={classnames(styles['item-slide__star'], 'icon-mt-star')} />
											<i className={classnames(styles['item-slide__star'], 'icon-mt-star')} />
											<i className={classnames(styles['item-slide__star'], 'icon-mt-star')} />
											<i className={classnames(styles['item-slide__star'], 'icon-mt-star')} />
											<i
												className={classnames(
													styles['item-slide__star'],
													'icon-mt-star_border',
												)}
											/>
										</div>
									</div>
									<Image
										src={feature.image}
										width="135"
										height="135"
										className={classnames(styles.avt, styles['item-slide__mt10'])}
										alt="avatar"
									/>
									<div className={classnames(styles['item-slide__name'], styles['item-slide__mt10'])}>
										{feature.name}
									</div>
									<div
										className={classnames(styles['item-slide__decri'], styles['item-slide__mt10'])}
									>
										{feature.description}
									</div>
								</div>
							))}
						</Slider>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ReviewQuestion;
