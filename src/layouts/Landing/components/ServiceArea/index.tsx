// Libraries
import React from 'react';
import Image from 'next/image';

// Constants
import Images from '@constants/image';

const ServiceArea = () => (
	<>
		<section className="main__intro3">
			<div className="container">
				<div className="row">
					<div className="col-lg-12">
						<div className="text-center title-intro3">HỆ SINH THÁI CỦA GOVIP</div>
					</div>
				</div>
			</div>
		</section>

		<section className="main__intro4">
			<div className="container">
				<div className="row">
					<div className="col-lg-3 item-intro4">
						<div className="img__project">
							<Image src={Images.LOGO_GO_LIKE} layout="responsive" alt="LOGO GO LIKE" />
						</div>
						<div className="name-project">GoLike</div>
						<div className="title-intro4">Kiếm Tiền Online Từ mạng xã hội an toàn, hiệu quả</div>
						<div className="content-intro4">
							Đây là nơi cung cấp rất nhiều dịch vụ mạng xã hội với đại đa số là người dùng thật cho khách
							hàng đang kinh doanh online trên mạng xã hội
						</div>
						<a href="https://golike.net/" className="button-intro4" target="_blank" rel="noreferrer">
							<span className="text-button-intro4">TÌM HIỂU THÊM</span>
						</a>
					</div>
					<div className="col-lg-3 item-intro4">
						<div className="img__project">
							<Image src={Images.LOGO_GO_SUB} layout="responsive" alt="LOGO GO SUB" />
						</div>
						<div className="name-project">GoSub</div>
						<div className="title-intro4">Tăng tương tác thực trên Facebook, Tiktok, Youtube...</div>
						<div className="content-intro4">
							Ứng dụng kiếm tiền từ mạng xã hội. GoSub cung cấp công việc mà người dùng chỉ cần làm theo
							hướng dẫn gồm các thao tác đơn giản
						</div>
						<a
							className="button-intro4"
							href="https://play.google.com/store/apps/details?id=com.gosub.reborn"
							target="_blank"
							rel="noreferrer"
						>
							<span className="text-button-intro4">TÌM HIỂU THÊM</span>
						</a>
					</div>
					<div className="col-lg-3 item-intro4">
						<div className="img__project">
							<Image src={Images.LOGO_GO_VIEW} layout="responsive" alt="LOGO GO VIEW" />
						</div>
						<div className="name-project">GoView</div>
						<div className="title-intro4">Ứng Dụng Trao Đổi Lượt Xem Mạng Xã Hội</div>
						<div className="content-intro4">
							Ứng dụng trao đổi view chéo trên các mạng xã hội Facebook, Tiktok, Youtube. Bạn có thể thêm
							video trên ứng dụng để tăng tương tác cho video
						</div>
						<a
							className="button-intro4"
							href="https://play.google.com/store/apps/details?id=com.metech.goviews&hl=vi&gl=US"
							target="_blank"
							rel="noreferrer"
						>
							<span className="text-button-intro4">TÌM HIỂU THÊM</span>
						</a>
					</div>
					<div className="col-lg-3 item-intro4">
						<div className="img__project">
							<Image src={Images.LOGO_GO_NEWS} layout="responsive" alt="LOGO GO NEWS" />
						</div>
						<div className="name-project">GoNews</div>
						<div className="title-intro4">Ứng Dụng tổng hợp tin tức, đọc báo hay, kiếm tiền ngay</div>
						<div className="content-intro4">
							Ứng dụng đọc tin tức hot trên các trang mạng xã hội, vừa có thể đọc tin tức hay, vừa có thể
							kiếm tiền thông qua tương tác trên app
						</div>
						<a className="button-intro4" href="https://mmoviet.net/" target="_blank" rel="noreferrer">
							<span className="text-button-intro4">TÌM HIỂU THÊM</span>
						</a>
					</div>
				</div>
			</div>
		</section>

		<div id="carouselExampleIndicators" className="carousel slide main__intro4-slide" data-ride="carousel">
			<ol className="carousel-indicators">
				<li data-target="#carouselExampleIndicators" data-slide-to="0" className="active" />
				<li data-target="#carouselExampleIndicators" data-slide-to="1" />
				<li data-target="#carouselExampleIndicators" data-slide-to="2" />
				<li data-target="#carouselExampleIndicators" data-slide-to="3" />
			</ol>
			<div className="carousel-inner">
				<div className="carousel-item active">
					<div className="col-lg-12 item-intro4">
						<div className="img__project">
							<Image src={Images.LOGO_GO_LIKE} layout="responsive" alt="LOGO GO LIKE" />
						</div>
						<div className="name-project">GoLike</div>
						<div className="title-intro4">Kiếm Tiền Online Từ mạng xã hội an toàn, hiệu quả</div>
						<div className="content-intro4">
							Đây là nơi cung cấp rất nhiều dịch vụ mạng xã hội với đại đa số là người dùng thật cho khách
							hàng đang kinh doanh online trên mạng xã hội
						</div>
						<button type="submit" className="button-intro4">
							<span className="text-button-intro4">TÌM HIỂU THÊM</span>
						</button>
					</div>
				</div>
				<div className="carousel-item">
					<div className="col-lg-12 item-intro4">
						<div className="img__project">
							<Image src={Images.LOGO_GO_SUB} layout="responsive" alt="LOGO GO SUB" />
						</div>
						<div className="name-project">GoSub</div>
						<div className="title-intro4">Tăng tương tác thực trên Facebook, Tiktok, Youtube...</div>
						<div className="content-intro4">
							Ứng dụng kiếm tiền từ mạng xã hội. GoSub cung cấp công việc mà người dùng chỉ cần làm theo
							hướng dẫn gồm các thao tác đơn giản
						</div>
						<button type="submit" className="button-intro4">
							<span className="text-button-intro4">TÌM HIỂU THÊM</span>
						</button>
					</div>
				</div>
				<div className="carousel-item">
					<div className="col-lg-12 item-intro4">
						<div className="img__project">
							<Image src={Images.LOGO_GO_VIEW} layout="responsive" alt="LOGO GO VIEW" />
						</div>
						<div className="name-project">GoView</div>
						<div className="title-intro4">Ứng Dụng Trao Đổi Lượt Xem Mạng Xã Hội</div>
						<div className="content-intro4">
							Ứng dụng trao đổi view chéo trên các mạng xã hội Facebook, Tiktok, Youtube. Bạn có thể thêm
							video trên ứng dụng để tăng tương tác cho video
						</div>
						<button type="submit" className="button-intro4">
							<span className="text-button-intro4">TÌM HIỂU THÊM</span>
						</button>
					</div>
				</div>
				<div className="carousel-item">
					<div className="col-lg-12 item-intro4">
						<div className="img__project">
							<Image src={Images.LOGO_GO_NEWS} layout="responsive" alt="LOGO GO NEWS" />
						</div>
						<div className="name-project">GoNews</div>
						<div className="title-intro4">Ứng Dụng tổng hợp tin tức, đọc báo hay, kiếm tiền ngay</div>
						<div className="content-intro4">
							Ứng dụng đọc tin tức hot trên các trang mạng xã hội, vừa có thể đọc tin tức hay, vừa có thể
							kiếm tiền thông qua tương tác trên app
						</div>
						<button type="submit" className="button-intro4">
							<span className="text-button-intro4">TÌM HIỂU THÊM</span>
						</button>
					</div>
				</div>
			</div>
			<button
				className="carousel-control-prev"
				type="button"
				data-target="#carouselExampleIndicators"
				data-slide="prev"
			>
				<span className="carousel-control-prev-icon" aria-hidden="true" />
				<span className="sr-only">Previous</span>
			</button>
			<button
				className="carousel-control-next"
				type="button"
				data-target="#carouselExampleIndicators"
				data-slide="next"
			>
				<span className="carousel-control-next-icon" aria-hidden="true" />
				<span className="sr-only">Next</span>
			</button>
		</div>
	</>
);

export default ServiceArea;
