import { TopToolbar } from 'react-admin';
import { ValidateButton } from '../components/customButton/validateButton';
import { CancelOrder } from '../components/customButton/cancelButton';

export const OrderOptionToolbar = () => (
  <TopToolbar>
    <ValidateButton />
    <CancelOrder />
  </TopToolbar>
);
