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
          primaryText={(record) => record.user_name}
          secondaryText={(record) => record.user_email}
          tertiaryText={(record) => record.role}
        />
      ) : (
        <Datagrid>
          <TextField source="user_name" />
          <EmailField source="user_email" />
          <TextField source="role" />
          <DateField source="created_at" />
          <EditButton />
          <DeleteButton />
        </Datagrid>
      )}
    </List>
  );
};
