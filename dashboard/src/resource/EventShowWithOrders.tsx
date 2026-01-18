import * as React from 'react';
import {
  Datagrid,
  DateField,
  FunctionField,
  NumberField,
  ReferenceManyField,
  Show,
  SimpleShowLayout,
  TextField,
  useRecordContext,
} from 'react-admin';
import { EventShow } from './EventResource'; // Réutilisez votre composant existant

export const EventShowWithOrders = () => {
  const record = useRecordContext();

  return (
    <Show>
      <SimpleShowLayout>
        {/* Réutilise le contenu existant de EventShow */}
        <EventShow />

        {/* Section ajoutée pour les commandes */}
        {record && (
          <ReferenceManyField reference="orders" target="eventId" label="Commandes associées">
            <Datagrid>
              <TextField source="id" label="N° Commande" />
              <FunctionField
                label="Client"
                render={(order) => order.user_email || `User ${order.user_id?.substring(0, 8)}...`}
              />
              <NumberField source="total_amount" options={{ style: 'currency', currency: 'EUR' }} />
              <TextField source="status_order" label="Statut" />
              <DateField source="created_at" label="Date" showTime />
            </Datagrid>
          </ReferenceManyField>
        )}
      </SimpleShowLayout>
    </Show>
  );
};
