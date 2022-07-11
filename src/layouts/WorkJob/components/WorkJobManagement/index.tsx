import React, { useState, useEffect } from 'react';

import StepItem from '../StepItem';

const WorkJobManagement = ({ steps }) => {
	const [currentStepSort, setCurrentStepSort] = useState(1);
	const [currentStep, setCurrentStep] = useState();
	const findCurrentStepObject = (sortIndex) => {
		if (steps) {
			const matchedObj = steps.find((obj) => obj.sort == sortIndex);
			setCurrentStep(matchedObj);
		}
	};
	useEffect(() => {
		findCurrentStepObject(currentStepSort);
	}, [currentStepSort, steps]);

	return (
		<div>
			<StepItem step={currentStep} setCurrentStepSort={setCurrentStepSort} currentStepSort={currentStepSort} />
		</div>
	);
};

export default WorkJobManagement;
