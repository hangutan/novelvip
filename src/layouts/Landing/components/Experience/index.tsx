// Libraries
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Constants
import Images from '@constants/image';

const Experience = () => (
	<section className="main__intro7">
		<div className="container">
			<div className="row">
				<div className="col-lg-12 bgImg_intro7">
					<div className="img-intro7">
						<Image src={Images.BACKGROUND3} layout="responsive" alt="background" />
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-lg-12 text-center">
					<Link href="/account/login" prefetch={false}>
						<button type="submit" className="btn1-intro7">
							TẢI APP VỀ ĐIỆN THOẠI
						</button>
					</Link>
					<Link href="/account/login" prefetch={false}>
						<button type="submit" className="btn2-intro7">
							TRẢI NGHIỆM NGAY
						</button>
					</Link>
				</div>
			</div>
		</div>
	</section>
);

export default Experience;
