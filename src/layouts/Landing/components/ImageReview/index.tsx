// Libraries
import React from 'react';
import Image from 'next/image';

// Constants
import Images from '@constants/image';

const ImageReview = () => (
	<section className="main__intro2">
		<div className="container">
			<div className="row align-items-center">
				<div className="col-lg-4 text-center">
					<div className="img__artboard">
						<Image src={Images.ART_BOARD1} layout="responsive" alt="review go vip" />
					</div>
				</div>
				<div className="col-lg-4 text-center">
					<div className="img__artboard">
						<Image src={Images.ART_BOARD2} layout="responsive" alt="review go vip" />
					</div>
				</div>
				<div className="col-lg-4 text-center">
					<div className="img__artboard">
						<Image src={Images.ART_BOARD3} layout="responsive" alt="review go vip" />
					</div>
				</div>
			</div>
		</div>
	</section>
);

export default ImageReview;
