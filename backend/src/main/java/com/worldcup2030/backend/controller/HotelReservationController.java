package com.worldcup2030.backend.controller;

import com.worldcup2030.backend.dto.HotelReservationDTO;
import com.worldcup2030.backend.model.PaymentStatus;
import com.worldcup2030.backend.service.HotelReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hotel-reservations")
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class HotelReservationController {

    private static final Logger logger = LoggerFactory.getLogger(HotelReservationController.class);
    private final HotelReservationService reservationService;

    public HotelReservationController(HotelReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@Valid @RequestBody HotelReservationDTO reservationDTO) {
        logger.info("🚀 Received reservation request: {}", reservationDTO);

        try {
            // Validation détaillée des données
            validateReservationData(reservationDTO);

            logger.info("✅ Validation passed, creating reservation...");
            HotelReservationDTO createdReservation = reservationService.createReservation(reservationDTO);
            logger.info("✅ Reservation created successfully: {}", createdReservation);

            return new ResponseEntity<>(createdReservation, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            logger.error("❌ Validation error: {}", e.getMessage());
            return createErrorResponse("Erreur de validation: " + e.getMessage(), HttpStatus.BAD_REQUEST);

        } catch (RuntimeException e) {
            logger.error("❌ Business logic error: {}", e.getMessage());
            return createErrorResponse("Erreur métier: " + e.getMessage(), HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            logger.error("❌ Unexpected error during reservation creation", e);
            return createErrorResponse("Erreur interne du serveur: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void validateReservationData(HotelReservationDTO dto) {
        logger.info("🔍 Validating reservation data...");

        if (dto == null) {
            throw new IllegalArgumentException("Les données de réservation sont manquantes");
        }

        if (dto.getUserId() == null || dto.getUserId() <= 0) {
            logger.error("❌ Invalid userId: {}", dto.getUserId());
            throw new IllegalArgumentException("L'ID utilisateur est invalide: " + dto.getUserId());
        }

        if (dto.getHotelId() == null || dto.getHotelId() <= 0) {
            logger.error("❌ Invalid hotelId: {}", dto.getHotelId());
            throw new IllegalArgumentException("L'ID hôtel est invalide: " + dto.getHotelId());
        }

        if (dto.getStartDate() == null) {
            throw new IllegalArgumentException("La date d'arrivée est obligatoire");
        }

        if (dto.getEndDate() == null) {
            throw new IllegalArgumentException("La date de départ est obligatoire");
        }

        if (dto.getStartDate().isAfter(dto.getEndDate()) || dto.getStartDate().isEqual(dto.getEndDate())) {
            throw new IllegalArgumentException("La date de départ doit être postérieure à la date d'arrivée");
        }

        if (dto.getNumberOfRooms() == null || dto.getNumberOfRooms() <= 0) {
            throw new IllegalArgumentException("Le nombre de chambres doit être supérieur à 0");
        }

        if (dto.getNumberOfGuests() == null || dto.getNumberOfGuests() <= 0) {
            throw new IllegalArgumentException("Le nombre d'invités doit être supérieur à 0");
        }

        logger.info("✅ Validation completed successfully");
    }

    private ResponseEntity<?> createErrorResponse(String message, HttpStatus status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        errorResponse.put("status", status.value());
        errorResponse.put("timestamp", System.currentTimeMillis());

        logger.error("📤 Sending error response: {}", errorResponse);
        return new ResponseEntity<>(errorResponse, status);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserReservations(@PathVariable Long userId) {
        logger.info("📖 Getting reservations for user: {}", userId);

        try {
            if (userId == null || userId <= 0) {
                return createErrorResponse("ID utilisateur invalide", HttpStatus.BAD_REQUEST);
            }

            List<HotelReservationDTO> reservations = reservationService.getUserReservations(userId);
            logger.info("✅ Found {} reservations for user {}", reservations.size(), userId);

            return new ResponseEntity<>(reservations, HttpStatus.OK);

        } catch (Exception e) {
            logger.error("❌ Error getting user reservations", e);
            return createErrorResponse("Erreur lors de la récupération des réservations: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllReservations() {
        logger.info("📖 Getting all reservations");

        try {
            List<HotelReservationDTO> reservations = reservationService.getAllReservations();
            logger.info("✅ Found {} total reservations", reservations.size());

            return new ResponseEntity<>(reservations, HttpStatus.OK);

        } catch (Exception e) {
            logger.error("❌ Error getting all reservations", e);
            return createErrorResponse("Erreur lors de la récupération des réservations: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(@PathVariable Long id) {
        logger.info("📖 Getting reservation by id: {}", id);

        try {
            if (id == null || id <= 0) {
                return createErrorResponse("ID de réservation invalide", HttpStatus.BAD_REQUEST);
            }

            HotelReservationDTO reservation = reservationService.getReservationById(id);
            logger.info("✅ Found reservation: {}", reservation);

            return new ResponseEntity<>(reservation, HttpStatus.OK);

        } catch (RuntimeException e) {
            logger.error("❌ Reservation not found: {}", id);
            return createErrorResponse("Réservation non trouvée: " + e.getMessage(), HttpStatus.NOT_FOUND);

        } catch (Exception e) {
            logger.error("❌ Error getting reservation by id", e);
            return createErrorResponse("Erreur lors de la récupération de la réservation: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        logger.info("🚫 Canceling reservation: {}", id);

        try {
            if (id == null || id <= 0) {
                return createErrorResponse("ID de réservation invalide", HttpStatus.BAD_REQUEST);
            }

            reservationService.cancelReservation(id);
            logger.info("✅ Reservation {} canceled successfully", id);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Réservation annulée avec succès");
            response.put("reservationId", id);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (RuntimeException e) {
            logger.error("❌ Error canceling reservation: {}", e.getMessage());
            return createErrorResponse("Erreur lors de l'annulation: " + e.getMessage(), HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            logger.error("❌ Unexpected error canceling reservation", e);
            return createErrorResponse("Erreur interne: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateReservationStatus(@PathVariable Long id, @RequestParam String status) {
        logger.info("🔄 Updating reservation {} status to: {}", id, status);

        try {
            if (id == null || id <= 0) {
                return createErrorResponse("ID de réservation invalide", HttpStatus.BAD_REQUEST);
            }

            if (status == null || status.trim().isEmpty()) {
                return createErrorResponse("Statut de paiement manquant", HttpStatus.BAD_REQUEST);
            }

            PaymentStatus paymentStatus;
            try {
                paymentStatus = PaymentStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return createErrorResponse("Statut de paiement invalide: " + status, HttpStatus.BAD_REQUEST);
            }

            HotelReservationDTO updatedReservation = reservationService.updateReservationStatus(id, paymentStatus);
            logger.info("✅ Reservation status updated successfully: {}", updatedReservation);

            return new ResponseEntity<>(updatedReservation, HttpStatus.OK);

        } catch (RuntimeException e) {
            logger.error("❌ Error updating reservation status: {}", e.getMessage());
            return createErrorResponse("Erreur lors de la mise à jour: " + e.getMessage(), HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            logger.error("❌ Unexpected error updating reservation status", e);
            return createErrorResponse("Erreur interne: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        logger.info("🗑️ Deleting reservation: {}", id);

        try {
            if (id == null || id <= 0) {
                return createErrorResponse("ID de réservation invalide", HttpStatus.BAD_REQUEST);
            }

            reservationService.cancelReservation(id); // Utilise la même logique que cancel
            logger.info("✅ Reservation {} deleted successfully", id);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Réservation supprimée avec succès");
            response.put("reservationId", id);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (RuntimeException e) {
            logger.error("❌ Error deleting reservation: {}", e.getMessage());
            return createErrorResponse("Erreur lors de la suppression: " + e.getMessage(), HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            logger.error("❌ Unexpected error deleting reservation", e);
            return createErrorResponse("Erreur interne: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}