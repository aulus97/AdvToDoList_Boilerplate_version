import React, { useCallback } from 'react';
import { IDefaultContainerProps } from '/imports/typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import WelcomeListController from '/imports/modules/welcome/pages/welcomeList/welcomeListController';
import WelcomeDetailController from '/imports/modules/welcome/pages/welcomeDetail/welcomeDetailContoller';
import { hasValue } from '/imports/libs/hasValue';

export interface IWelcomeModuleContext {
	state?: 'create' | 'view' | 'edit';
	id?: string;
}

export const WelcomeModuleContext = React.createContext<IWelcomeModuleContext>({});

export default (props: IDefaultContainerProps) => {
	let { screenState, welcomeId } = useParams();
	const state = screenState ?? props.screenState;
	const id = welcomeId ?? props.id;

	const validState = ['view', 'edit', 'create'];
  const isValideState = hasValue(state) && validState.includes(state!);

	const renderPage = useCallback(() => {
    if (!isValideState) return <WelcomeListController />;
		return <WelcomeDetailController />;
	}, [isValideState]);

	const providerValue = {
		state: !isValideState ? undefined : state as 'create' | 'view' | 'edit' | undefined,
		id
	};
	return <WelcomeModuleContext.Provider value={providerValue}>{renderPage()}</WelcomeModuleContext.Provider>;
};
