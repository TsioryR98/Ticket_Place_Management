import { Button, useNotify, useRefresh, useUpdate, useRecordContext } from 'react-admin';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';

export const ValidateButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [open, setOpen] = useState(false);

  if (!record || record.status_order !== 'pending') return null;
};
