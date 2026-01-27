import * as React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  ShowButton,
  EditButton,
  Show,
  SimpleShowLayout,
  FunctionField,
  ArrayField,
} from 'react-admin';
import { OrderOptionToolbar } from '../components/orderOptionToolbar';

export const OrderList = () => (
  <List>
    <Datagrid>
      <TextField source="id" label="Order ID" />
      <FunctionField
        label="User"
        render={(record) => record.user_email || `User ${record.user_id.substring(0, 8)}...`}
      />
      <NumberField source="total_amount" options={{ style: 'currency', currency: 'EUR' }} />
      <TextField source="status_order" />
      <DateField source="created_at" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);

export const OrderShow = () => (
  <Show actions={<OrderOptionToolbar />}>
    <SimpleShowLayout>
      <TextField source="id" label="Order ID" />
      <FunctionField
        label="User"
        render={(record) => record.user_email || `User ${record.user_id}`}
      />
      <NumberField source="total_amount" options={{ style: 'currency', currency: 'EUR' }} />
      <TextField source="status_order" />
      <DateField source="created_at" showTime />

      <hr />
      <h3>Order Items</h3>
      <ArrayField source="items">
        <Datagrid bulkActionButtons={false}>
          <TextField source="ticket_type" label="Type" />
          <TextField source="event_title" label="Event" />
          <DateField source="event_date" label="Date Event" showTime />
          <TextField source="event_location" label="Location" />
          <TextField source="ticket_type" label="Category" />
          <NumberField source="quantity" />
          <NumberField
            source="price"
            label="Unit Price"
            options={{ style: 'currency', currency: 'EUR' }}
          />
          <FunctionField
            label="Subtotal"
            render={(record: any) => `${(record.price * record.quantity).toFixed(2)} €`}
          />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
