import styles from './styles.module.scss';

type Props = {
	data?: Array<{
		avatar: string;
		coin: number;
		name: string;
	}>;
	config?: {
		[key: string]: string | number | boolean;
	};
	setParentPage?: (n: number) => void;
	parentPage?: number;
	stylePagination: object;
};

const Pagination = (props: Props) => {
	const { parentPage, setParentPage, data, config, stylePagination } = props;

	const moveToPreviousPage = () => {
		if (parentPage > 1) {
			setParentPage(+parentPage - 1);
		} else {
			setParentPage(1);
		}
	};

	const moveToNextPage = () => {
		if (data?.length >= config?.fetchLimit) {
			setParentPage(+parentPage + 1);
		} else {
			setParentPage(parentPage);
		}
	};

	return (
		<div className={styles.pagination}>
			<ul>
				<li>
					<a
						className={styles['pagination__a-left']}
						aria-hidden
						onClick={moveToPreviousPage}
						style={stylePagination}
					>
						&lt;
					</a>
					{data?.length < config?.fetchLimit && parentPage > 1 && (
						<a
							style={stylePagination}
							aria-hidden
							onClick={moveToPreviousPage}
							className={styles.pagination__a}
						>
							{+parentPage - 1}
						</a>
					)}
					<a className={styles['pagination__a-active']} style={stylePagination}>
						{parentPage}
					</a>
					{data?.length >= config?.fetchLimit && (
						<a style={stylePagination} aria-hidden onClick={moveToNextPage}>
							{+parentPage + 1}
						</a>
					)}
					<a
						className={styles['pagination__a-right']}
						aria-hidden
						onClick={moveToNextPage}
						style={stylePagination}
					>
						&gt;
					</a>
				</li>
			</ul>
		</div>
	);
};

export default Pagination;
