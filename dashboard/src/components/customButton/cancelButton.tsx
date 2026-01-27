import { Button, useNotify, useRefresh, useUpdate, Confirm, useRecordContext } from 'react-admin';
import { useState } from 'react';
import { dataProvider } from '../../provider/CombinedProvider';

export const CancelOrder = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [open, setOpen] = useState(false);

  if (!record || record.status_order !== 'pending') return null;
  const handleCancel = async () => {
    await dataProvider.cancel('orders', { id: record.id });
    notify('order cancelled', { type: 'info' });
    refresh();
    setOpen(false);
  };
  return (
    <>
      <Button
        style={{ fontWeight: 'bold' }}
        label="Cancel"
        onClick={() => setOpen(true)}
        color="error"
      />
      <Confirm
        isOpen={open}
        title="Confirm Cancellation"
        content="Are you sure you want to cancel this order?"
        onConfirm={handleCancel}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
