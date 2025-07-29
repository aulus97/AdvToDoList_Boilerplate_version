import React, { createContext, useCallback, useContext, useMemo } from 'react';
import ToDosDetailView from './toDosDetailView';
import { useNavigate } from 'react-router-dom';
import { ToDosModuleContext } from '../../toDosContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { toDosApi } from '../../api/toDosApi';
import { IToDos } from '../../api/toDosSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

interface IToDosDetailContollerContext {
	onUpdateStatus(task: IToDos): unknown;
	closePage: () => void;
	document: IToDos;
	loading: boolean;
	schema: ISchema<IToDos>;
	onSubmit: (doc: IToDos) => void;
	changeToEdit: (id: string) => void;
}

export const ToDosDetailControllerContext = createContext<IToDosDetailContollerContext>(
	{} as IToDosDetailContollerContext
);

// Add props for modal handling
interface IToDosDetailControllerProps {
    isModal?: boolean;
    closeModal?: () => void;
}

const ToDosDetailController = (props: IToDosDetailControllerProps) => { // Accept props
	const navigate = useNavigate();
	// Get state and id from context, which will now be provided by the ToDosModuleContext.Provider in the modal
	const { id, state } = useContext(ToDosModuleContext);
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	// Fetch the document based on the 'id' from context
	const { document, loading } = useTracker(() => {
		// Only subscribe if ID is present
		const subHandle = !!id ? toDosApi.subscribe('toDosDetail', { _id: id }) : null;
		// Ensure document is an empty object or a new IToDos if no ID or not ready
		const doc = (id && subHandle?.ready() ? toDosApi.findOne({ _id: id }) : {}) as IToDos;
		return {
			document: doc,
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]); // Dependency on 'id' is correct

	const closePage = useCallback(() => {
        if (props.isModal && props.closeModal) {
            props.closeModal(); // If in modal, use the modal's close function
        } else {
            navigate(-1); // Otherwise, navigate back
        }
	}, [navigate, props.isModal, props.closeModal]); // Add modal props to dependencies

	const changeToEdit = useCallback((id: string) => {
		// If in modal, you might want to close the view modal and open an edit modal
		// For now, it will navigate to a new page for editing, which is usually fine
		if (props.isModal && props.closeModal) {
            props.closeModal(); // Close the current view modal
            navigate(`/toDos/edit/${id}`); // Then navigate to the edit page
        } else {
            navigate(`/toDos/edit/${id}`);
        }
	}, [navigate, props.isModal, props.closeModal]);

	const onSubmit = useCallback((doc: IToDos) => {
		const selectedAction = state === 'create' ? 'insert' : 'update';
		toDosApi[selectedAction](doc, (e: IMeteorError) => {
			if (!e) {
				showNotification({
					type: 'success',
					title: 'Operação realizada!',
					message: `O exemplo foi ${selectedAction === 'update' ? 'atualizado' : 'cadastrado'} com sucesso!`
				});
                if (props.isModal && props.closeModal) {
                    props.closeModal(); // Close modal on successful submit
                } else {
                    closePage(); // Use closePage logic for navigation
                }
			} else {
				showNotification({
					type: 'error',
					title: 'Operação não realizada!',
					message: `Erro ao realizar a operação: ${e.reason}`
				});
			}
		});
	}, [state, showNotification, closePage, props.isModal, props.closeModal]); // Add modal props to dependencies

	const providerValue: IToDosDetailContollerContext = useMemo(
		() => ({
			closePage,
			document: { ...document, _id: id }, // Ensure _id is always part of the document if needed
			loading,
			schema: toDosApi.getSchema(),
			onSubmit,
			changeToEdit,
			onUpdateStatus: (task: IToDos) => toDosApi.update(task)
		}),
		[closePage, document, id, loading, onSubmit, changeToEdit] // Add id to dependencies
	);

	return (
		<ToDosDetailControllerContext.Provider value={providerValue}>
			{/* Render ToDosDetailView, it will consume the context */}
			{<ToDosDetailView />}
		</ToDosDetailControllerContext.Provider>
	);
};

export default ToDosDetailController;
