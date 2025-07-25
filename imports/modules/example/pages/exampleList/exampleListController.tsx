import React, { useCallback, useMemo } from 'react';
import ExampleListView from './exampleListView';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { ISchema } from '../../../../typings/ISchema';
import { IExample } from '../../api/exampleSch';
import { exampleApi } from '../../api/exampleApi';

interface IInitialConfig {
	sortProperties: { field: string; sortAscending: boolean };
	filter: Object;
	searchBy: string | null;
	viewComplexTable: boolean;
	limit: number;
}

interface IExampleListContollerContext {
	onAddButtonClick: () => void;
	onDeleteButtonClick: (row: any) => void;
	onMyTasksButtonClick?: () => void;
	todoList: IExample[];
	schema: ISchema<any>;
	loading: boolean;
	onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onChangeCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ExampleListControllerContext = React.createContext<IExampleListContollerContext>(
	{} as IExampleListContollerContext
);

const initialConfig: IInitialConfig = {
	sortProperties: { field: 'createdAt', sortAscending: false },
	filter: {},
	searchBy: null,
	viewComplexTable: false,
	limit: 5
};

const ExampleListController = () => {
	const [config, setConfig] = React.useState<IInitialConfig>(initialConfig);

	const { title, type, typeMulti } = exampleApi.getSchema();
	const exampleSchReduzido = { title, type, typeMulti, createdAt: { type: Date, label: 'Criado em' } };
	const navigate = useNavigate();

	const { sortProperties, filter, limit } = config;
	const sort = {
		[sortProperties.field]: sortProperties.sortAscending ? 1 : -1
	};

	const { loading, examples } = useTracker(() => {
		const subHandle = exampleApi.subscribe('exampleList', filter, {
			sort,
			limit
		});

		const examples = subHandle?.ready() ? exampleApi.find(filter, { sort, limit }).fetch() : [];
		return {
			examples,
			loading: !!subHandle && !subHandle.ready(),
			total: subHandle ? subHandle.total : examples.length
		};
	}, [config]);

	const onAddButtonClick = useCallback(() => {
		const newDocumentId = nanoid();
		navigate(`/example/create/${newDocumentId}`);
	}, []);

	const onDeleteButtonClick = useCallback((row: any) => {
		exampleApi.remove(row);
	}, []);

	const onMyTasksButtonClick = useCallback(() => {
		navigate('/sysFormTests/');
	}, []);

	const onChangeTextField = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		const delayedSearch = setTimeout(() => {
			setConfig((prev) => ({
				...prev,
				filter: { ...prev.filter, title: { $regex: value.trim(), $options: 'i' } }
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

	const providerValues: IExampleListContollerContext = useMemo(
		() => ({
			onAddButtonClick,
			onDeleteButtonClick,
			todoList: examples,
			schema: exampleSchReduzido,
			loading,
			onChangeTextField,
			onChangeCategory: onSelectedCategory
		}),
		[examples, loading]
	);

	return (
		<ExampleListControllerContext.Provider value={providerValues}>
			<ExampleListView />
		</ExampleListControllerContext.Provider>
	);
};

export default ExampleListController;
