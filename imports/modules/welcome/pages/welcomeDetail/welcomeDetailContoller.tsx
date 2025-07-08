import React, { createContext, useCallback, useContext } from 'react';
import WelcomeDetailView from './welcomeDetailView';
import { useNavigate } from 'react-router-dom';
import { WelcomeModuleContext } from '../../welcomeContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { welcomeApi } from '../../api/welcomeApi';
import { IWelcome } from '../../api/welcomeSch';
import { ISchema } from '/imports/typings/ISchema';
import { IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

interface IWelcomeDetailContollerContext {
	closePage: () => void;
	document: IWelcome;
	loading: boolean;
	schema: ISchema<IWelcome>;
	onSubmit: (doc: IWelcome) => void;
	changeToEdit: (id: string) => void;
}

export const WelcomeDetailControllerContext = createContext<IWelcomeDetailContollerContext>(
	{} as IWelcomeDetailContollerContext
);

const WelcomeDetailController = () => {
	const navigate = useNavigate();
	const { id, state } = useContext(WelcomeModuleContext);
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const { document, loading } = useTracker(() => {
		const subHandle = !!id ? welcomeApi.subscribe('welcomeDetail', { _id: id }) : null;
		const document = id && subHandle?.ready() ? welcomeApi.findOne({ _id: id }) : {};
		return {
			document: (document as IWelcome) ?? ({ _id: id } as IWelcome),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const closePage = useCallback(() => navigate(-1), []);
	const changeToEdit = useCallback((id: string) => navigate(`/welcome/edit/${id}`),[]);

	const onSubmit = useCallback((doc: IWelcome) => {
		const selectedAction = state === 'create' ? 'insert' : 'update';
		welcomeApi[selectedAction](doc, (e: IMeteorError) => {
      if(e) return showNotification({
        type: 'error',
        title: 'Operação não realizada!',
        message: `Erro ao realizar a operação: ${e.reason}`
      });
      closePage();
      showNotification({
        type: 'success',
        title: 'Operação realizada!',
        message: `O exemplo foi ${selectedAction === 'update' ? 'atualizado' : 'cadastrado'} com sucesso!`
      });
		});
	}, []);

	return (
		<WelcomeDetailControllerContext.Provider
			value={{
				closePage,
				document: { ...document, _id: id },
				loading,
				schema: welcomeApi.getSchema(),
				onSubmit,
				changeToEdit
			}}>
			{<WelcomeDetailView />}
		</WelcomeDetailControllerContext.Provider>
	);
};

export default WelcomeDetailController;
