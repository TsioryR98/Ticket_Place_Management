import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Chip,
  Stack,
  Divider,
  Avatar,
  Box,
} from "@mui/material";
import { Event } from "../../type/Event";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { lightBlue, green, red } from "@mui/material/colors";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card
      sx={{
        width: "30vw",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        border: "1px solid rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Zone image avec badge */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="180"
          image={event.image}
          alt={event.title}
          sx={{
            objectFit: "cover",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            width: "100%",
          }}
        />
        <Chip
          label={event.category}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            fontWeight: "bold",
            backgroundColor: lightBlue[600],
            color: "white",
            borderRadius: "8px",
            fontSize: "0.75rem",
          }}
        />
      </Box>

      {/* Contenu de la carte */}
      <CardContent
        sx={{
          flexGrow: 1,
          p: 2.5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            lineHeight: 1.3,
            minHeight: "3.5em", // Pour les titres longs
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {event.title}
        </Typography>

        {/* Informations événement */}
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <EventIcon
              fontSize="small"
              sx={{ mr: 1.5, color: lightBlue[600] }}
            />
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.875rem" }}
            >
              {new Date(event.date).toLocaleDateString("fr-FR", {
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocationOnIcon
              fontSize="small"
              sx={{ mr: 1.5, color: lightBlue[600] }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: "0.875rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {event.location}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 1, borderColor: "rgba(0, 0, 0, 0.08)" }} />

        {/* Pied de carte */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "auto", // Pousse vers le bas
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: lightBlue[100],
                color: lightBlue[800],
                mr: 1,
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              {event.organizer.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.875rem" }}
            >
              {event.organizer}
            </Typography>
          </Box>

          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: lightBlue[800] }}
          >
            {event.price?.toFixed(2)} €
          </Typography>
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions
        sx={{
          p: 2,
          pt: 0,
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderRadius: "8px",
            px: 2,
            fontWeight: 500,
            borderWidth: "1.5px",
            "&:hover": {
              borderWidth: "1.5px",
            },
          }}
        >
          Supprimer
        </Button>
        <Button
          variant="contained"
          size="small"
          disabled={event.availableTickets <= 0}
          sx={{
            borderRadius: "8px",
            px: 2,
            fontWeight: 600,
            backgroundColor:
              event.availableTickets > 0 ? lightBlue[600] : "grey.500",
            "&:hover": {
              backgroundColor:
                event.availableTickets > 0 ? lightBlue[700] : "grey.500",
            },
          }}
        >
          {event.availableTickets > 0 ? "Editer" : "Complet"}
        </Button>
      </CardActions>
    </Card>
  );
};
