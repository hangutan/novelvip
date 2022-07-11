import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setChosenProviderService } from '@store/providers/reducer';
import { ServiceItem } from 'src/types/provider';
import styles from '@layouts/CreateJob/styles.module.scss';

interface State {
	Providers: any;
}

const Services = ({ register, errors }) => {
	const dispatch = useDispatch();
	// find provider từ store: {}
	const chosenProvider = useSelector((state: State) => state?.Providers?.chosenProvider || {});
	// find list các services tương ứng với provider từ store
	const [services, setServices] = useState([]);
	useEffect(() => {
		if (chosenProvider && chosenProvider?.services?.length > 0) {
			setServices(chosenProvider?.services || []);
		} else {
			setServices([]);
		}
	}, [chosenProvider]);
	// service đang được chọn
	const [chosenService, setChosenService] = useState({});
	const [serviceId, setServiceId] = useState('');
	// tìm object service tương ứng với id đang select
	const findService = (id) => {
		const matched = services.find((obj) => obj.id == id);
		if (!matched) {
			setChosenService({});
		} else {
			setChosenService(matched);
		}
	};
	useEffect(() => {
		findService(serviceId);
	}, [serviceId, services]);
	// reset service id khi list services thay đổi
	useEffect(() => {
		setServiceId('');
	}, [services]);
	// lưu object service được chọn vào store
	const dispatchChosenService = (service) => {
		dispatch(setChosenProviderService({ service }));
	};
	useEffect(() => {
		dispatchChosenService(chosenService);
	}, [chosenService]);
	// reset lại state khi unmount
	useEffect(
		() => () => {
			setServices([]);
			setServiceId('');
		},
		[],
	);
	return (
		<div className="lg:flex lg:items-center">
			<div className="lg:w-1/3">
				<label className={styles['create-job__container-form-container-body-label']}>Dịch vụ:</label>
			</div>
			<div className="lg:w-2/3 relative">
				<select
					{...register('provider_service_id', { required: true })}
					name="provider_service_id"
					id="provider_service_id"
					value={serviceId}
					onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setServiceId(e.target.value)}
					className={styles['create-job__container-form-container-body-input-tag']}
				>
					<option value="">Dịch vụ</option>
					{services.map((item: ServiceItem) => (
						<option key={item?.id} value={item?.id}>
							{item?.name}
						</option>
					))}
				</select>
				{errors?.provider_service_id && (
					<div className={styles['create-job__container-form-error']}>Vui lòng chọn dịch vụ</div>
				)}
			</div>
		</div>
	);
};

export default Services;
