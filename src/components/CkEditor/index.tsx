/* eslint-disable global-require */
import { useEffect, useState } from 'react';

import { base64UploadAdapter as UpdateAdapter } from '@utils/ckeditor-uploader';

type CkEditorProps = {
	data: string;
	setData: (params: string) => void;
};

const CkEditor = ({ data, setData }: CkEditorProps) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const renderCKEditor = () => {
		const { CKEditor } = require('@ckeditor/ckeditor5-react');
		const ClassicEditor = require('@ckeditor/ckeditor5-build-classic');

		const MyCustomUploadAdapterPlugin = (editor) => {
			editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new UpdateAdapter(loader);
		};

		const editorConfiguration = {
			heading: {
				options: [
					{ model: 'paragraph', title: 'Chữ vừa', class: 'ck-heading_paragraph' },
					{
						model: 'heading1',
						view: 'h1',
						title: 'Heading 1',
						class: 'ck-heading_heading1',
					},
					{
						model: 'heading2',
						view: 'h2',
						title: 'Heading 2',
						class: 'ck-heading_heading2',
					},
					{
						model: 'heading3',
						view: 'h3',
						title: 'Heading 3',
						class: 'ck-heading_heading3',
					},
					{
						model: 'heading4',
						view: 'h4',
						title: 'Heading 4',
						class: 'ck-heading_heading4',
					},
					{
						model: 'heading5',
						view: 'h5',
						title: 'Heading 5',
						class: 'ck-heading_heading5',
					},
					{
						model: 'heading6',
						view: 'h6',
						title: 'Heading 6',
						class: 'ck-heading_heading6',
					},
				],
			},
			extraPlugins: [MyCustomUploadAdapterPlugin],
		};
		return (
			<>
				<CKEditor
					editor={ClassicEditor}
					config={editorConfiguration}
					data={data}
					onChange={(event, editor) => {
						const data = editor.getData();

						if (typeof setData === 'function') {
							setData(data);
						}
					}}
				/>
			</>
		);
	};

	return <>{mounted ? renderCKEditor() : <div>Loading Editor</div>}</>;
};

export default CkEditor;
