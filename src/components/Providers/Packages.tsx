import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setChosenProviderPackage } from '@store/providers/reducer';
import styles from '@layouts/CreateJob/styles.module.scss';

const Packages = ({ register, errors }) => {
	const dispatch = useDispatch();
	// find object service từ store
	const chosenService = useSelector((state) => state?.Providers?.chosenProviderService || {});
	// list các packages của service từ store
	const [packages, setPackages] = useState([]);
	useEffect(() => {
		if (chosenService && chosenService.packages?.length > 0) {
			setPackages(chosenService?.packages || []);
		} else {
			setPackages([]);
		}
	}, [chosenService]);
	// object package đang được chonj
	const [chosenPackage, setChosenPackage] = useState({});
	const [packageId, setPackageId] = useState('');
	// tìm object đang select
	const findPackage = (id) => {
		const matched = packages.find((obj) => obj.id == id);
		if (!matched) {
			setChosenPackage({});
		} else {
			setChosenPackage(matched);
		}
	};
	useEffect(() => {
		findPackage(packageId);
	}, [packageId, packages]);
	// lưu object package đang chọn vào store
	const dispatchChosenPackage = (packages) => {
		dispatch(setChosenProviderPackage({ packages }));
	};
	useEffect(() => {
		dispatchChosenPackage(chosenPackage);
	}, [chosenPackage]);
	// reset package id đang chọn list services thay đổi
	useEffect(() => {
		setPackageId('');
	}, [packages]);
	// reset lại state trước khi unmount
	useEffect(
		() => () => {
			setChosenPackage([]);
			setPackageId('');
		},
		[],
	);
	return (
		<div className="lg:flex lg:items-center">
			<div className="lg:w-1/3">
				<label className={styles['create-job__container-form-container-body-label']}>Gói/ loại:</label>
			</div>
			<div className="lg:w-2/3 relative">
				<select
					{...register('package_id', { required: true })}
					name="package_id"
					id="package_id"
					value={packageId}
					onChange={(e) => setPackageId(e.target.value)}
					className={styles['create-job__container-form-container-body-input-tag']}
				>
					<option value="">Gói / loại</option>
					{packages.map((item) => (
						<option key={item?.id} value={item?.id}>
							{item?.name}
						</option>
					))}
				</select>
				{errors?.package_id && (
					<div className={styles['create-job__container-form-error']}>Vui lòng chọn gói/ loại</div>
				)}
			</div>
		</div>
	);
};

export default Packages;
