import { Button, useNotify, useRefresh, useUpdate, Confirm, useRecordContext } from 'react-admin';
import { useState } from 'react';
import { dataProvider } from '../../provider/CombinedProvider';

export const ValidateButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [open, setOpen] = useState(false);

  if (!record || record.status_order !== 'pending') return null;
  const handleValidate = async () => {
    await dataProvider.validate('orders', { id: record.id });
    notify('order validated', { type: 'info' });
    refresh();
    setOpen(false);
  };
  return (
    <>
      {' '}
      <Button
        style={{ fontWeight: 'bold' }}
        label="Validate"
        onClick={() => setOpen(true)}
        color="success"
      />
      <Confirm
        isOpen={open}
        title="Confirm Validation"
        content="Are you sure you want to validate this order?"
        onConfirm={handleValidate}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
