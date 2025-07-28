import React, { useCallback, useMemo } from 'react';
import WelcomeListView from './welcomeListView';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { ISchema } from '../../../../typings/ISchema';
import { IWelcome } from '../../api/welcomeSch';
import { welcomeApi } from '../../api/welcomeApi';
import { IToDos } from '/imports/modules/toDos/api/toDosSch';
import { toDosApi } from '/imports/modules/toDos/api/toDosApi';

interface IInitialConfig {
	sortProperties: { field: string; sortAscending: boolean };
	filter: Object;
	searchBy: string | null;
	viewComplexTable: boolean;
	limit: number;
}

interface IWelcomeListContollerContext {
	onMyTasksButtonClick: () => void;
	welcomeList: IToDos[];
	schema: ISchema<any>;
	loading: boolean;
}

export const WelcomeListControllerContext = React.createContext<IWelcomeListContollerContext>(
	{} as IWelcomeListContollerContext
);

const initialConfig = {
	sortProperties: { field: 'createdAt', sortAscending: false },
	filter: {},
	searchBy: null,
	viewComplexTable: false,
	limit: 5
};

const WelcomeListController = () => {
	const [config, setConfig] = React.useState<IInitialConfig>(initialConfig);

	const { title, description, createdAt, check } = toDosApi.getSchema();
	const welcomeSchReduzido = { 
		title, 
		description, 
		createdAt: { type: Date, label: 'Criado em' }, 
		check: { type: String, label: 'Situação' } 
	};
	const navigate = useNavigate();

	const { sortProperties, filter, limit } = config;
	const sort = {
		[sortProperties.field]: sortProperties.sortAscending ? 1 : -1
	};

	const { loading, welcomeTasks } = useTracker(() => {
		const subHandle = toDosApi.subscribe('welcomeList', filter, {
			sort,
			limit
		});

		const welcomeTasks = subHandle?.ready() ? toDosApi.find(filter, { sort, limit }).fetch() : [];
		return {
			welcomeTasks,
			loading: !!subHandle && !subHandle.ready(),
			total: subHandle ? subHandle.total : welcomeTasks.length
		};
	}, [config]);

	/* 
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
	*/
	
	const onMyTasksButtonClick = useCallback(() => {
			navigate('/toDos');
	}, []);//Acrescentar navigate aqui nas dependências se necessário (instabilidade de renderização, por exemplo)
	
	const providerValues: IWelcomeListContollerContext = useMemo(
		() => ({
			onMyTasksButtonClick,
			welcomeList: welcomeTasks,
			schema: welcomeSchReduzido,
			loading,
			//onChangeCategory: onSelectedCategory,
		}),
		[welcomeTasks, loading, onMyTasksButtonClick] // Acrescentar onSelectedCategory e welcomeSchReduzido se necessário	
	);

	return (
		<WelcomeListControllerContext.Provider value={providerValues}>
			<WelcomeListView />
		</WelcomeListControllerContext.Provider>
	);
};

export default WelcomeListController;
