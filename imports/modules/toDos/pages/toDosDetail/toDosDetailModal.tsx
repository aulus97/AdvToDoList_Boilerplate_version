import React from 'react';
import { ToDosModuleContext } from '../../toDosContainer';
import ToDosDetailController from './toDosDetailContoller';
import { MemoryRouter } from 'react-router-dom';

interface IToDosDetailModalProps {
	taskId: string | undefined;
	closeModal?: () => void;
}

const ToDosDetailModal: React.FC<IToDosDetailModalProps> = ({ taskId, closeModal }) => {
	return (
		<MemoryRouter initialEntries={[`/toDos/view/${taskId}`]} initialIndex={0}> {/* Provide Router context */}
            <ToDosModuleContext.Provider value={{ id: taskId, state: 'view' }}>
                {/* Pass isModal and closeModal to the controller */}
                <ToDosDetailController isModal={true} closeModal={closeModal} />
            </ToDosModuleContext.Provider>
        </MemoryRouter>
	);
};

export default ToDosDetailModal;