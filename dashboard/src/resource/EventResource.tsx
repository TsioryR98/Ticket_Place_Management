import { useMediaQuery, Theme } from "@mui/material";
import * as React from "react";
import {
  Datagrid,
  List,
  SimpleList,
  TextField,
  EditButton,
  DeleteButton,
  EmailField,
  SimpleShowLayout,
  Show,
  DateField,
  UrlField,
} from "react-admin";

export const EventList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.title}
          secondaryText={(record) => record.description}
          tertiaryText={(record) => record.date}
        />
      ) : (
        <Datagrid>
          <TextField source="title" />
          <TextField source="description" />
          <DateField source="date" />
          <TextField source="location" />
          <TextField source="organizer" />
          <TextField source="category" />
          {/*<UrlField source="image" />{" "}}
          {/* image as source is from  image: event.image,*/}
          <EditButton />
          <DeleteButton />
        </Datagrid>
      )}
    </List>
  );
};

export const EventShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="title" />
        <TextField source="description" />
        <DateField source="date" />
        <TextField source="location" />
        <TextField source="organizer" />
        <TextField source="category" />
        <UrlField source="image" />
      </SimpleShowLayout>
    </Show>
  );
};
