import React, { useCallback, useMemo } from 'react';
import ToDosListView from './toDosListView';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { ISchema } from '../../../../typings/ISchema';
import { IToDos } from '../../api/toDosSch';
import { toDosApi } from '../../api/toDosApi';

interface IInitialConfig {
	pageProperties: {
		currentPage: number;
		pageSize: number;
	};
	sortProperties: { field: string; sortAscending: boolean };
	filter: Object;
	searchBy: string | null;
	viewComplexTable: boolean;
}

interface IToDosListContollerContext {
	onUpdateStatus(task: IToDos): unknown;
	onAddButtonClick: () => void;
	onDeleteButtonClick: (row: any) => void;
	todoList: IToDos[];
	schema: ISchema<any>;
	loading: boolean;
	onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
	//onChangeCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
	totalCount: number;
	pageSize: number;
	currentPage: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export const ToDosListControllerContext = React.createContext<IToDosListContollerContext>(
	{} as IToDosListContollerContext
);

const initialConfig = {
	pageProperties: {
		currentPage: 1,
		pageSize: 4
	},
	sortProperties: { field: 'createdAt', sortAscending: true },
	filter: {},
	searchBy: null,
	viewComplexTable: false
};

const ToDosListController = () => {
	const [config, setConfig] = React.useState<IInitialConfig>(initialConfig);

	const { title, description, createdAt, check } = toDosApi.getSchema();
	const toDosSchReduzido = { title, description, createdAt: { type: Date, label: 'Criado em' }, check: { type: String, label: 'Situação' } };
	const navigate = useNavigate();

	const { sortProperties, filter, pageProperties } = config;
	const sort = {
		[sortProperties.field]: sortProperties.sortAscending ? 1 : -1
	};

	const limit = pageProperties.pageSize;
	const skip = (pageProperties.currentPage - 1) * pageProperties.pageSize;


	const {
		loading,
		toDosTasks,
		total
	}: {
		loading: boolean;
		toDosTasks: IToDos[];
		total: number;
	} = useTracker(() => {
		const subHandle = toDosApi.subscribe('toDosList', filter, {
			sort,
			limit,
			skip
		});

		const ready = subHandle?.ready?.() ?? false;
		const tasks = ready ? toDosApi.find(filter, { sort, limit, skip }).fetch() : [];
		const totalCount = ready ? toDosApi.find(filter).count() : tasks.length;

		return {
			toDosTasks: tasks,
			loading: !ready,
			total: totalCount
		};
	}, [config]);

	const onAddButtonClick = useCallback(() => {
		const newDocumentId = nanoid();
		navigate(`/toDos/create/${newDocumentId}`);
	}, []);

	const onDeleteButtonClick = useCallback((row: any) => {
		toDosApi.remove(row);
	}, []);

	const onUpdateStatus = useCallback((task: IToDos) => {
		toDosApi.update(task);
	}, []);


	const onChangeTextField = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		const delayedSearch = setTimeout(() => {
			setConfig((prev) => ({
				...prev,
				filter: { ...prev.filter, description: { $regex: value.trim(), $options: 'i' } }
			}));
		}, 1000);
		return () => clearTimeout(delayedSearch);
	}, []);

	const onSelectedCategory = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		if (!value) {
			setConfig((prev) => ({
				...prev,
				filter: {
					...prev.filter,
					type: { $ne: null }
				}
			}));
			return;
		}
		setConfig((prev) => ({ ...prev, filter: { ...prev.filter, type: value } }));
	}, []);

	const onPageChange = useCallback((newPage: number) => {
		setConfig((prev) => ({
		...prev,
		pageProperties: {
			...prev.pageProperties,
			currentPage: newPage
		}
		}));
	}, []);
	
	const onPageSizeChange = useCallback((newSize: number) => {
		setConfig((prev) => ({
		...prev,
		pageProperties: {
			currentPage: 1,
			pageSize: newSize
		}
		}));
	}, []);

	const providerValues: IToDosListContollerContext = useMemo(
		() => ({
			todoList: toDosTasks,
			onAddButtonClick,
			onDeleteButtonClick,
			schema: toDosSchReduzido,
			loading,
			onChangeTextField,
			//onChangeCategory: onSelectedCategory,
			onUpdateStatus,
			totalCount: total,
			currentPage: pageProperties.currentPage,
			pageSize: pageProperties.pageSize,
			onPageChange,
			onPageSizeChange
		}),
		[toDosTasks, loading, total, pageProperties, onAddButtonClick, onDeleteButtonClick, onChangeTextField, onUpdateStatus, onPageChange, onPageSizeChange ] //boa prática do ESLint-disable-line react-hooks/exhaustive-deps
	);

	return (
		<ToDosListControllerContext.Provider value={providerValues}>
			<ToDosListView />
		</ToDosListControllerContext.Provider>
	);
};

export default ToDosListController;
