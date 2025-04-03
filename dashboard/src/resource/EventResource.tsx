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
  useRecordContext,
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
  //fromat to be insert in database
  const record = useRecordContext(); //
  const transform = (data: any) => ({
    ...data,
    time: data.time.includes(":") ? data.time.substring(0, 5) : data.time,
  });

  return (
    <Edit transform={transform}>
      <SimpleForm>
        <TextInput source="title" fullWidth />
        <TextInput source="description" multiline fullWidth />
        <DateInput
          source="date"
          defaultValue={new Date().toISOString().split("T")[0]} //datein database
        />
        <TimeInput source="time" defaultValue="12:00" />
        <TextInput source="location" fullWidth />
        <TextInput source="organizer" fullWidth />
        <TextInput
          source="category"
          label="Actual category"
          disabled
          fullWidth
        />{" "}
        <SelectInput
          source="category"
          choices={[
            { id: "musique", name: "Musique" },
            { id: "jeunepublic", name: "Jeune Public" },
            { id: "humour", name: "Humour" },
            { id: "theatre", name: "Théâtre" },
            { id: "classique", name: "Classique" },
          ]}
          defaultValue={record?.category}
        />
        <ImageField
          source="imagePath"
          title="Current Image"
          sx={{ "& img": { maxWidth: 400, maxHeight: 400 } }}
        />
        <ImageInput source="newImage" label="Replace Image">
          <ImageField source="src" title="New Image Preview" />
        </ImageInput>
      </SimpleForm>
    </Edit>
  );
};
