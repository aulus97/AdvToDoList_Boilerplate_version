import React, { useContext } from 'react';
import { ToDosDetailControllerContext } from './toDosDetailContoller';
import { ToDosModuleContext } from '../../toDosContainer';
import ToDosDetailStyles from './toDosDetailStyles';
import SysForm from '../../../../ui/components/sysForm/sysForm';
import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { SysSelectField } from '../../../../ui/components/sysFormFields/sysSelectField/sysSelectField';
import { SysRadioButton } from '../../../../ui/components/sysFormFields/sysRadioButton/sysRadioButton';
import { SysCheckBox } from '../../../../ui/components/sysFormFields/sysCheckBoxField/sysCheckBoxField';
import SysFormButton from '../../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import { SysUploadFile } from '../../../../ui/components/sysFormFields/sysUploadFile/sysUploadFile';
import SysSlider from '../../../../ui/components/sysFormFields/sysSlider/sysSliderField';
import { SysLocationField } from '../../../../ui/components/sysFormFields/sysLocationField/sysLocationField';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import { json } from 'body-parser';
import { Chip, Switch } from '@mui/material';
import SysSwitch from '/imports/ui/components/sysFormFields/sysSwitch/sysSwitch';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';

enum situationColors {
    NC='#29b6f6',//info color from MUI palette for dark themes
    CC='#66bb6a',//success color from MUI palette for dark themes
};

enum getStatusLabel {
    NC='Não Concluída',
    CC='Concluída',
};

enum privacyColors {
    PRIVATE='#c62828',//error color from MUI palette for dark themes
	PUBLIC='#66bb6a',//success color from MUI palette for dark themes
};

enum getPrivacyLabel {
    PRIVATE='Privado',
    PUBLIC='Público',
};


const ToDosDetailView = () => {
	const controller = useContext(ToDosDetailControllerContext);
	const { state } = useContext(ToDosModuleContext);
	const isView = state === 'view';
	const isEdit = state === 'edit';
	const isCreate = state === 'create';
	const { Container, Body, Header, Footer, FormColumn } = ToDosDetailStyles;
	const { userId } = useContext(AppLayoutContext);
	const isOwner = controller.document?.createdBy === userId;
	
	const documentTitle = controller.document?.title || 'Carregando...';
	const documentDescription = controller.document?.description || 'Carregando...';

	return (
		<Container>
			<Header>
				{isView && (
					<IconButton onClick={controller.closePage}>
						<SysIcon name={'arrowBack'} />
					</IconButton>
				)}
				<Typography variant="h5" sx={{ flexGrow: 1 }}>
					{isCreate ? 'Adicionar Item' : isEdit ? 'Editar Item' : controller.document.title}
				</Typography>
				<IconButton
					onClick={!isView ? controller.closePage : () => controller.changeToEdit(controller.document._id || '')}>
					{!isView ? <SysIcon name={'close'} /> : <SysIcon name={'edit'} />}
				</IconButton>
			</Header>
			<SysForm
				mode={state as 'create' | 'view' | 'edit'}
				schema={controller.schema}
				doc={controller.document}
				//onSubmit={controller.onSubmit}
				onSubmit={(data) => {
					console.log('Final form data:', data);
					controller.onSubmit(data);
				}}
				loading={controller.loading}>
				<Body>
				<FormColumn>
					<SysTextField name="title" placeholder="Ex.: Item XX" />
					<SysTextField
						name="description"
						placeholder="Acrescente informações sobre o item (3 linhas)"
						multiline
						rows={3}
						showNumberCharactersTyped
						max={200}
					/>
					<FormColumn>
						<Typography variant="subtitle1">Privacidade</Typography>
						<SysSwitch
						name="privacy"
						label="Privacidade"
						checkedValue="PRIVATE"
						uncheckedValue="PUBLIC"
						value={controller.document?.privacy /* === 'PRIVATE' ? getPrivacyLabel.PRIVATE : getPrivacyLabel.PUBLIC */}
						//defaultValue={controller.document?.privacy === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC'}
						onChange={(e) => {
							const newPrivacy = e.target.checked ? 'PRIVATE' : 'PUBLIC';
							controller.onUpdatePrivacy({ ...controller.document, privacy: newPrivacy });
						}} // Handle change directly
						valueLabel={controller.document?.privacy === 'PRIVATE' ? getPrivacyLabel.PRIVATE : getPrivacyLabel.PUBLIC}
						sxMap={{
							switch: {
								// Track (path of the switch)
								'& .MuiSwitch-track': {
									backgroundColor:
									controller.document?.privacy === 'PRIVATE'
										? privacyColors.PRIVATE
										: privacyColors.PUBLIC,
								},
								'& .Mui-checked + .MuiSwitch-track': {
									backgroundColor: privacyColors.PRIVATE,
								},
							}}}
						/>
					</FormColumn>
					{(isView || isEdit) && isOwner && controller.document && ( 
						<FormColumn sx={{ marginTop: '16px' }}>
							<Typography variant="subtitle1">Situação do Item</Typography>
							<Chip
								label={controller.document.check == 'CC' ? getStatusLabel.CC : getStatusLabel.NC}
								variant="outlined"
								sx={{
									borderColor: controller.document.check == 'CC' ? situationColors.CC: situationColors.NC,
									color: controller.document.check == 'CC' ? situationColors.CC: situationColors.NC,
									backgroundColor: 'transparent'
								}}
								onClick={(e) => {
									e.stopPropagation();
									const updatedTask = { ...controller.document, 
										check: controller.document.check === 'CC' ? 'NC' : 'CC' };
									controller.onUpdateStatus(updatedTask);} }
							/>
						</FormColumn>
					)}
				</FormColumn>
				</Body>
				<Footer>
					{isView && (
						<Button variant="outlined" startIcon={<SysIcon name={'close'} />} onClick={controller.closePage}>
							Cancelar
						</Button>
					)}
					{(isEdit || isCreate) && isOwner && (<SysFormButton>Salvar</SysFormButton>)}
				</Footer>
			</SysForm>
			{/* JSON.stringify(controller.document) */}
		</Container>
	);
};

export default ToDosDetailView;
