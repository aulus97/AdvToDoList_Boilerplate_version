import React, { useCallback, useMemo } from 'react';
import WelcomeListView from './welcomeListView';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { ISchema } from '/imports/typings/ISchema';
import { IWelcome } from '../../api/welcomeSch';
import { welcomeApi } from '../../api/welcomeApi';

interface IInitialConfig {
	sortProperties: { field: string; sortAscending: boolean };
	filter: Object;
	searchBy: string | null;
	viewComplexTable: boolean;
}

interface IWelcomeListContollerContext {
	onAddButtonClick: () => void;
	onDeleteButtonClick: (row: any) => void;
	welcomeList: IWelcome[];
	schema: ISchema<any>;
	loading: boolean;
	onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onChangeCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const WelcomeListControllerContext = React.createContext<IWelcomeListContollerContext>(
	{} as IWelcomeListContollerContext
);

const initialConfig = {
	sortProperties: { field: 'createdAt', sortAscending: true },
	filter: {},
	searchBy: null,
	viewComplexTable: false
};

const WelcomeListController = () => {
	const [config, setConfig] = React.useState<IInitialConfig>(initialConfig);

	const { name, birthday, delivery } = welcomeApi.getSchema();
	const aniversarioSchReduzido = { birthday, name, delivery };
	const navigate = useNavigate();

	const { sortProperties, filter } = config;
	const sort = {
		[sortProperties.field]: sortProperties.sortAscending ? 1 : -1
	};

	const { loading, aniversarios } = useTracker(() => {
		const subHandle = welcomeApi.subscribe('welcomeList', filter, {
			sort
		});
		const aniversarios = subHandle?.ready() ? welcomeApi.find(filter, { sort }).fetch() : [];
		return {
			aniversarios,
			loading: !!subHandle && !subHandle.ready(),
			total: subHandle ? subHandle.total : aniversarios.length
		};
	}, [config]);

	const onAddButtonClick = useCallback(() => {
		const newDocumentId = nanoid();
		navigate(`/welcome/create/${newDocumentId}`);
	}, []);

	const onDeleteButtonClick = useCallback((row: any) => {
		welcomeApi.remove(row);
	}, []);

	const onChangeTextField = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		const delayedSearch = setTimeout(() => {
			setConfig((prev) => ({
				...prev,
				filter: { ...prev.filter, name: { $regex: value.trim(), $options: 'i' } }
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

	const providerValues: IWelcomeListContollerContext = useMemo(
		() => ({
			onAddButtonClick,
			onDeleteButtonClick,
			welcomeList: aniversarios,
			schema: aniversarioSchReduzido,
			loading,
			onChangeTextField,
			onChangeCategory: onSelectedCategory
		}),
		[aniversarios, loading]
	);

	return (
		<WelcomeListControllerContext.Provider value={providerValues}>
			<WelcomeListView />
		</WelcomeListControllerContext.Provider>
	);
};

export default WelcomeListController;
