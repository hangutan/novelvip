import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setChosenProvider } from '@store/providers/reducer';
import styles from '@layouts/CreateJob/styles.module.scss';

const Providers = ({ register, errors }) => {
	const dispatch = useDispatch();
	const providers = useSelector((state) => state?.Providers?.listProviders || []);
	const [provider, setProvider] = useState({}); // provider được chọn : {}
	const [providerId, setProviderId] = useState(''); // id của provider được chọn: String
	const findProvider = (id) => {
		// tìm ra provider được chọn dựa trên id
		const matched = providers.find((obj) => obj.id == id);
		if (!matched) {
			setProvider({});
		} else {
			setProvider(matched);
		}
	};
	useEffect(() => {
		findProvider(providerId);
	}, [providerId]);
	const dispatchChosenProvider = (provider) => {
		dispatch(setChosenProvider({ provider }));
	};
	useEffect(() => {
		// lưu provider được chọn lên store sau mỗi lần chọn
		dispatchChosenProvider(provider);
	}, [provider]);

	return (
		<div className="lg:flex lg:items-center">
			<div className="lg:w-1/3">
				<label className={styles['create-job__container-form-container-body-label']}>Nền tảng:</label>
			</div>
			<div className="lg:w-2/3 relative">
				<select
					{...register('provider_id', { required: true })}
					name="provider_id"
					id="provider_id"
					value={providerId}
					onChange={(e) => setProviderId(e.target.value)}
					className={styles['create-job__container-form-container-body-input-tag']}
				>
					<option value="">Nền tảng</option>
					{providers.map((provider) => (
						<option key={provider.id} value={provider.id}>
							{provider.name}
						</option>
					))}
				</select>
				{errors?.provider_id && (
					<div className={styles['create-job__container-form-error']}>Vui lòng chọn nền tảng</div>
				)}
			</div>
		</div>
	);
};

export default Providers;
