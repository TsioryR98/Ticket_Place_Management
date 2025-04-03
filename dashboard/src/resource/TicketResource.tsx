import React from 'react';
import { 
  List, 
  Datagrid, 
  TextField, 
  NumberField, 
  Edit, 
  Create, 
  SimpleForm, 
  TextInput, 
  NumberInput, 
  required, 
  ReferenceInput, 
  SelectInput 
} from 'react-admin';

export const ticketList = (props) => (
  <List {...props} filters={[
    <ReferenceInput key="event-filter" source="eventId" reference="events" label="Événement">
      <SelectInput optionText="title" />
    </ReferenceInput>
  ]}>
    <Datagrid rowClick="edit">
      <TextField source="types" label="Type" />
      <NumberField source="price" label="Prix" />
      <NumberField source="available" label="Disponibles" />
      <NumberField source="limit_per_person" label="Limite/personne" />
    </Datagrid>
  </List>
);

export const ticketEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="types" label="Type" validate={required()} />
      <NumberInput source="price" label="Prix" validate={required()} />
      <NumberInput source="available" label="Disponibles" validate={required()} />
      <NumberInput source="limit_per_person" label="Limite/personne" validate={required()} />
    </SimpleForm>
  </Edit>
);

export const ticketCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="eventId" reference="events" label="Événement">
        <SelectInput optionText="title" validate={required()} />
      </ReferenceInput>
      <TextInput source="types" label="Type" validate={required()} />
      <NumberInput source="price" label="Prix" validate={required()} />
      <NumberInput source="available" label="Disponibles" validate={required()} />
      <NumberInput source="limit_per_person" label="Limite/personne" validate={required()} />
    </SimpleForm>
  </Create>
);