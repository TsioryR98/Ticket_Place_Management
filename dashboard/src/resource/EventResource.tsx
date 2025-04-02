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
  DateField,
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
          <EditButton />
          <DeleteButton />
        </Datagrid>
      )}
    </List>
  );
};
