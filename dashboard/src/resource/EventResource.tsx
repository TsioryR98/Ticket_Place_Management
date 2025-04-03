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
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  TimeInput,
  DateInput,
  SelectInput,
  ImageInput,
  ImageField,
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

export const EventEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="title" fullWidth />
        <TextInput source="description" multiline fullWidth />

        {/* Date and Time separated */}
        <DateInput source="date" />
        <TimeInput source="time" />

        <TextInput source="location" fullWidth />
        <TextInput source="organizer" fullWidth />

        {/* Image handling */}
        <ImageField source="imagePath" title="Current Image" />
        <ImageInput source="newImage" label="Replace Image">
          <ImageField source="src" title="New Image Preview" />
        </ImageInput>
      </SimpleForm>
    </Edit>
  );
};
