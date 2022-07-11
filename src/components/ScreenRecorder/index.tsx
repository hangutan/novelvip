import { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import Webcam from 'react-webcam';

import styles from './styles.module.scss';

const ScreenRecorder = () => {
	const [talkingHead, setTalkingHead] = useState(false);

	const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
		audio: true,
		screen: true,
	});

	return (
		<>
			{mediaBlobUrl && status === 'stopped' && (
				<a href={mediaBlobUrl} download="video.mp4" className={`${styles.button} ${styles.downloadButton}`}>
					Download Video
				</a>
			)}

			{(status === 'idle' || status === 'stopped') && (
				<button type="button" onClick={startRecording} className={styles.button}>
					Start
				</button>
			)}
			{status === 'recording' && (
				<button type="button" onClick={stopRecording} className={styles.button}>
					Stop
				</button>
			)}

			<button type="button" onClick={() => setTalkingHead(!talkingHead)} className={styles.button}>
				{(talkingHead && 'Tạm dừng webcam') || 'Mở webcam'}
			</button>

			{talkingHead && (
				<Webcam
					className={styles.camera}
					audio={false}
					width={300}
					height={300}
					videoConstraints={{
						width: 300,
						height: 300,
						facingMode: 'user',
					}}
				/>
			)}
		</>
	);
};

export default ScreenRecorder;
