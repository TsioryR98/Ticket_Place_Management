import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ShowButton,
  EditButton,
  DeleteButton,
  useRecordContext,
  SimpleList,
} from "react-admin";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Theme, useMediaQuery } from "@mui/material";

// Composant bouton corrigé
const ShowOrdersButton = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Button
      component={Link}
      to={`/events/${record.id}/show-with-orders`}
      startIcon={<ShoppingCartIcon />}
      sx={{
        color: "primary.main",
        "&:hover": {
          textDecoration: "none", // Enlève le soulignement rouge
        },
      }}
    >
      Commandes
    </Button>
  );
};

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
          {/* Champs existants */}
          <TextField source="title" />
          <TextField source="description" />
          <DateField source="date" />

          {/* Boutons */}
          <ShowButton label="Détails" />
          <ShowOrdersButton />
          <EditButton />
          <DeleteButton />
        </Datagrid>
      )}
    </List>
  );
};
