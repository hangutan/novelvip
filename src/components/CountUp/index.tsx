// Libraries
import { useRef } from 'react';
import { useCountUp } from 'react-countup';

import { formatNumber } from '@utils';
import usePrevious from '@hooks/usePrevious';

interface CountUpProps {
	start?: string | number;
	end: string | number;
}

const CountUp = (props: CountUpProps) => {
	const countUpRef = useRef(null);

	const { start: startNumber, end: endNumber } = props;
	const prevEnd = usePrevious(endNumber);

	const {
		start,
		pauseResume: onPauseResume,
		reset,
		update,
	} = useCountUp({
		ref: countUpRef,
		start: (prevEnd as number) || 0,
		end: endNumber as number,
		duration: 1,
		formattingFn: (text) => formatNumber(text),
		delay: 0,
		onReset: () => {
			// console.log('Resetted!');
		},
		onUpdate: () => {
			// console.log('Updated!')
		},
		onPauseResume: () => {
			// console.log('Paused or resumed!')
		},
		onStart: ({ pauseResume }) => {
			// console.log(pauseResume)
		},
		onEnd: ({ pauseResume }) => {
			// console.log(pauseResume)
		},
	});

	return <span ref={countUpRef} />;
};

export default CountUp;
