import React from 'react';
import { IDefaultContainerProps } from '../../typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import WelcomeListController from '../../modules/welcome/pages/welcomeList/welcomeListController';
import WelcomeDetailController from '../../modules/welcome/pages/welcomeDetail/welcomeDetailContoller';

export interface IWelcomeModuleContext {
	state?: string;
	id?: string;
}

export const WelcomeModuleContext = React.createContext<IWelcomeModuleContext>({});

export default (props: IDefaultContainerProps) => {
	let { screenState, welcomeId } = useParams();
	const state = screenState ?? props.screenState;
	const id = welcomeId ?? props.id;

	const validState = ['view', 'edit', 'create'];

	const renderPage = () => {
		if (!state || !validState.includes(state)) return <WelcomeListController />;
		return <WelcomeDetailController />;
	};

	const providerValue = {
		state,
		id
	};
	return <WelcomeModuleContext.Provider value={providerValue}>{renderPage()}</WelcomeModuleContext.Provider>;
};
