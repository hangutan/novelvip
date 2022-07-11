export interface dataItem {
	name: string;
	id: number;
	first: boolean;
	second: boolean;
	third: boolean;
	normal: boolean;
	pageNumber: number;
}

export interface TableConfig {
	name: string;
	avatar: string;
	coin: boolean;
	limit: number;
	useTop: boolean;
	usePageLoading: boolean; // default false
}
