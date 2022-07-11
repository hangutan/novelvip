import React from 'react';
import { useRouter } from 'next/router';

const StepItem = ({ step, currentStepSort, setCurrentStepSort }) => {
	const router = useRouter();
	const moveNext = () => {
		setCurrentStepSort(currentStepSort + 1);
	};
	const moveBack = () => {
		setCurrentStepSort(currentStepSort - 1);
	};
	const moveToReport = () => {
		router.push('/report-job');
	};

	return (
		<div className="border-2 border-gray-500">
			<p>Name: {step?.name || ''}</p>
			<p>Sort: {step?.sort || ''}</p>
			<p>Description: {step?.description || ''}</p>
			<p>Hình ảnh:</p>
			<p>Video:</p>
			<div>
				{(step?.middle || (step?.end && currentStepSort > 1)) && (
					<button
						onClick={moveBack}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
					>
						Quay lại
					</button>
				)}
				{!step?.end && (
					<button
						onClick={moveNext}
						className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
					>
						Tiếp theo
					</button>
				)}
				{step?.end && (
					<button
						onClick={moveToReport}
						className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
					>
						Hoàn thành
					</button>
				)}
			</div>
		</div>
	);
};

export default StepItem;
