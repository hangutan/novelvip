// Libraries
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Constants
import Images from '@constants/image';

const Review = () => (
	<section className="main__intro">
		<div className="container relative">
			<div className="main__intro-bg">
				<Image src={Images.bg1} priority layout="responsive" alt="introduce govip" sizes="60vw" />
			</div>
			<div className="row">
				<div className="col-lg-7 col-md-12 col-sm-12">
					<div className="title_main__intro">
						GOVIP - NỀN TẢNG <span className="title_main__color">KIẾM TIỀN ONLINE TỐT NHẤT</span> DỰA TRÊN
						SEEDING THẬT
					</div>
					<div className="list_intro">
						<div className="d-flex item-intro">
							<i className="icon-mt-star" />
							<span className="text-item">Thu nhập đa dạng</span>
						</div>
						<div className="d-flex item-intro">
							<i className="icon-mt-star" />
							<span className="text-item">Bộ lọc thông minh</span>
						</div>
						<div className="d-flex item-intro">
							<i className="icon-mt-star" />
							<span className="text-item">
								Trang trí cho trang cá nhân thật ấn
								<br />
								tượng với bộ theme có sẵn
							</span>
						</div>
						<div className="d-flex item-intro">
							<i className="icon-mt-star" />
							<span className="text-item">Hơn 3000 job được tạo ra mỗi ngày</span>
						</div>
						<div className="d-flex item-intro">
							<i className="icon-mt-star" />
							<span className="text-item">Rút tiền nhanh chóng</span>
						</div>
					</div>
					<Link href="/account/login" prefetch={false}>
						<button
							type="submit"
							className="button-item"
							// onClick="gotoGovip()"
						>
							TRẢI NGHIỆM NGAY
						</button>
					</Link>
				</div>
				<div className="col-md-12 bg_intro">
					<Image src={Images.bg1} priority layout="responsive" alt="introduce govip" />
				</div>
			</div>
		</div>
	</section>
);

export default Review;
