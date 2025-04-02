import { useMediaQuery, Theme } from "@mui/material";
import * as React from "react";
import {
  Datagrid,
  List,
  Show,
  SimpleList,
  TextField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  CreateButton,
  DeleteButton,
  EmailField,
  DateField,
  SimpleShowLayout,
} from "react-admin";

export const UserList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.username}
          secondaryText={(record) => record.email}
          tertiaryText={(record) => record.role}
        />
      ) : (
        <Datagrid>
          <TextField source="username" />
          <EmailField source="email" />
          <TextField source="role" />
          <DateField source="created_at" />
          <EditButton />
          <DeleteButton />
        </Datagrid>
      )}
    </List>
  );
};

export const UserShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="username" />
        <EmailField source="email" />
        <TextField source="role" />
        <DateField source="created_at" />
      </SimpleShowLayout>
    </Show>
  );
};

export const UserEdit = () => {
  return (
    <Edit>
      <SimpleShowLayout>
        <TextField source="user_name" />
        <EmailField source="user_email" />
        <TextField source="role" />
        <DateField source="created_at" />
      </SimpleShowLayout>
    </Edit>
  );
};
