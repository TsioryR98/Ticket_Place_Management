import { useMediaQuery, Theme } from "@mui/material";
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

export const userList = () => {
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
          <DateField source="created" />
          <EditButton />
          <DeleteButton />
        </Datagrid>
      )}
    </List>
  );
};
