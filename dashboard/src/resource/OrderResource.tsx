import * as React from "react";
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
} from "react-admin";

export const OrderList = () => (
  <List>
    <Datagrid>
      <TextField source="id" label="Order ID" />
      <FunctionField
        label="User"
        render={(record) =>
          record.user_email || `User ${record.user_id.substring(0, 8)}...`
        }
      />
      <NumberField
        source="total_amount"
        options={{ style: "currency", currency: "EUR" }}
      />
      <TextField source="status_order" />
      <DateField source="created_at" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);

export const OrderShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="Order ID" />
      <FunctionField
        label="User"
        render={(record) => record.user_email || `User ${record.user_id}`}
      />
      <NumberField
        source="total_amount"
        options={{ style: "currency", currency: "EUR" }}
      />
      <TextField source="status_order" />
      <DateField source="created_at" showTime />

      <ArrayField source="items">
        <Datagrid>
          <TextField source="ticket_type" />
          <NumberField source="quantity" />
          <NumberField
            source="price"
            options={{ style: "currency", currency: "EUR" }}
          />
          <TextField source="event_title" />
          <DateField source="event_date" showTime />
          <TextField source="event_location" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
