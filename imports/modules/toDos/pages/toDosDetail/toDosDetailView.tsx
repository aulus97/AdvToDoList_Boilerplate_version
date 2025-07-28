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
import { Chip } from '@mui/material';

enum situationColors {
    NC='#29b6f6',//info color from MUI palette for dark themes
    CC='#66bb6a',//success color from MUI palette for dark themes
};

enum getStatusLabel {
    NC='Não Concluída',
    CC='Concluída',
};

const ToDosDetailView = () => {
	const controller = useContext(ToDosDetailControllerContext);
	const { state } = useContext(ToDosModuleContext);
	const isView = state === 'view';
	const isEdit = state === 'edit';
	const isCreate = state === 'create';
	const { Container, Body, Header, Footer, FormColumn } = ToDosDetailStyles;
	/*const statusKey = Array.isArray(controller.document.check)
	? controller.document.check[0]
	: controller.document.check;*/

	/* const getStatusLabel = (statusValue: string) => {
		switch(statusValue) {
			case 'NC': return 'Não Concluída';
			case 'CC': return 'Concluída';
			default: return 'Não Concluída';
		}
	};

	const getStatusColor = (statusValue: string) => {
		return statusValue === 'CC' ? situationColors.CC : situationColors.NC;
	};
 */
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
				onSubmit={controller.onSubmit}
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
					{(isEdit) && ( // Render SysSelectField in edit/create mode
						<SysSelectField name="check" placeholder="Selecionar status" />
					)}
					{isView && ( // Render Chip in view mode
						<FormColumn sx={{ marginTop: '16px' }}>
							<Typography sx={{ marginBottom: '8px' }}>
								Status:
							</Typography>
							<Chip
								label={controller.document.check == 'CC' ? getStatusLabel.CC : getStatusLabel.NC}
								variant="outlined"
								sx={{
									borderColor: controller.document.check == 'CC' ? situationColors.CC: situationColors.NC,
									color: controller.document.check == 'CC' ? situationColors.CC: situationColors.NC,
									backgroundColor: 'transparent'
								}}
							/>
						</FormColumn>
					)}
				</FormColumn>
				</Body>
				<Footer>
					{!isView && (
						<Button variant="outlined" startIcon={<SysIcon name={'close'} />} onClick={controller.closePage}>
							Cancelar
						</Button>
					)}
					<SysFormButton>Salvar</SysFormButton>
				</Footer>
			</SysForm>
			{JSON.stringify(controller.document)}
		</Container>
	);
};

export default ToDosDetailView;
