package com.worldcup2030.backend.service;

import com.worldcup2030.backend.dto.HotelReservationDTO;
import com.worldcup2030.backend.model.Hotel;
import com.worldcup2030.backend.model.HotelReservation;
import com.worldcup2030.backend.model.PaymentStatus;
import com.worldcup2030.backend.model.User;
import com.worldcup2030.backend.repository.HotelReservationRepository;
import com.worldcup2030.backend.repository.HotelRepository;
import com.worldcup2030.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class HotelReservationService {

    private static final Logger logger = LoggerFactory.getLogger(HotelReservationService.class);
    private final HotelReservationRepository reservationRepository;
    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;

    public HotelReservationService(HotelReservationRepository reservationRepository,
                                   HotelRepository hotelRepository,
                                   UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.hotelRepository = hotelRepository;
        this.userRepository = userRepository;
    }

    public HotelReservationDTO createReservation(HotelReservationDTO dto) {
        logger.info("🚀 Creating reservation with DTO: {}", dto);

        try {
            // Validation détaillée des données d'entrée
            validateReservationDTO(dto);

            // Récupérer l'utilisateur avec gestion d'erreur détaillée
            logger.info("🔍 Looking for user with ID: {}", dto.getUserId());
            Optional<User> userOpt = userRepository.findById(dto.getUserId());
            if (userOpt.isEmpty()) {
                logger.error("❌ User not found with ID: {}", dto.getUserId());
                throw new RuntimeException("Utilisateur non trouvé avec l'ID: " + dto.getUserId());
            }
            User user = userOpt.get();
            logger.info("✅ User found: {} ({})", user.getEmail(), user.getId());

            // Récupérer l'hôtel avec gestion d'erreur détaillée
            logger.info("🔍 Looking for hotel with ID: {}", dto.getHotelId());
            Optional<Hotel> hotelOpt = hotelRepository.findById(dto.getHotelId());
            if (hotelOpt.isEmpty()) {
                logger.error("❌ Hotel not found with ID: {}", dto.getHotelId());
                throw new RuntimeException("Hôtel non trouvé avec l'ID: " + dto.getHotelId());
            }
            Hotel hotel = hotelOpt.get();
            logger.info("✅ Hotel found: {} in {}", hotel.getName(), hotel.getCity());

            // Calculer le prix total avec logging détaillé
            long numberOfNights = ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate());
            logger.info("📊 Calculating price: {} nights × {} rooms × 1000 MAD", numberOfNights, dto.getNumberOfRooms());

            if (numberOfNights <= 0) {
                throw new RuntimeException("Le nombre de nuits doit être positif. Dates: " + dto.getStartDate() + " à " + dto.getEndDate());
            }

            BigDecimal totalPrice = BigDecimal.valueOf(1000) // Prix de base par nuit
                    .multiply(BigDecimal.valueOf(numberOfNights))
                    .multiply(BigDecimal.valueOf(dto.getNumberOfRooms()));
            logger.info("💰 Total price calculated: {} MAD", totalPrice);

            // Créer la réservation
            logger.info("🏗️ Creating reservation entity...");
            HotelReservation reservation = new HotelReservation();
            reservation.setUser(user);
            reservation.setHotel(hotel);
            reservation.setStartDate(dto.getStartDate());
            reservation.setEndDate(dto.getEndDate());
            reservation.setNumberOfRooms(dto.getNumberOfRooms());
            reservation.setNumberOfGuests(dto.getNumberOfGuests());
            reservation.setTotalPrice(totalPrice);
            reservation.setPaymentStatus(PaymentStatus.PENDING);
            reservation.setCreatedAt(LocalDate.now());

            logger.info("💾 Saving reservation to database...");
            HotelReservation savedReservation = reservationRepository.save(reservation);
            logger.info("✅ Reservation saved with ID: {}", savedReservation.getId());

            HotelReservationDTO result = convertToDTO(savedReservation);
            logger.info("✅ Reservation creation completed successfully: {}", result);

            return result;

        } catch (RuntimeException e) {
            logger.error("❌ Business logic error in createReservation: {}", e.getMessage());
            throw e; // Re-throw runtime exceptions as-is

        } catch (Exception e) {
            logger.error("❌ Unexpected error in createReservation", e);
            throw new RuntimeException("Erreur inattendue lors de la création de la réservation: " + e.getMessage(), e);
        }
    }

    private void validateReservationDTO(HotelReservationDTO dto) {
        logger.info("🔍 Validating reservation DTO...");

        if (dto == null) {
            throw new IllegalArgumentException("Les données de réservation sont nulles");
        }

        if (dto.getUserId() == null) {
            throw new IllegalArgumentException("L'ID utilisateur est null");
        }

        if (dto.getUserId() <= 0) {
            throw new IllegalArgumentException("L'ID utilisateur doit être positif, reçu: " + dto.getUserId());
        }

        if (dto.getHotelId() == null) {
            throw new IllegalArgumentException("L'ID hôtel est null");
        }

        if (dto.getHotelId() <= 0) {
            throw new IllegalArgumentException("L'ID hôtel doit être positif, reçu: " + dto.getHotelId());
        }

        if (dto.getStartDate() == null) {
            throw new IllegalArgumentException("La date d'arrivée est null");
        }

        if (dto.getEndDate() == null) {
            throw new IllegalArgumentException("La date de départ est null");
        }

        if (dto.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("La date d'arrivée ne peut pas être dans le passé");
        }

        if (dto.getStartDate().isAfter(dto.getEndDate()) || dto.getStartDate().isEqual(dto.getEndDate())) {
            throw new IllegalArgumentException("La date de départ doit être postérieure à la date d'arrivée");
        }

        if (dto.getNumberOfRooms() == null || dto.getNumberOfRooms() <= 0) {
            throw new IllegalArgumentException("Le nombre de chambres doit être positif, reçu: " + dto.getNumberOfRooms());
        }

        if (dto.getNumberOfGuests() == null || dto.getNumberOfGuests() <= 0) {
            throw new IllegalArgumentException("Le nombre d'invités doit être positif, reçu: " + dto.getNumberOfGuests());
        }

        logger.info("✅ DTO validation completed successfully");
    }

    public List<HotelReservationDTO> getUserReservations(Long userId) {
        logger.info("📖 Getting reservations for user: {}", userId);

        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("ID utilisateur invalide: " + userId);
        }

        try {
            List<HotelReservation> reservations = reservationRepository.findByUserIdOrderByStartDateDesc(userId);
            logger.info("✅ Found {} reservations for user {}", reservations.size(), userId);

            return reservations.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            logger.error("❌ Error getting reservations for user {}", userId, e);
            throw new RuntimeException("Erreur lors de la récupération des réservations pour l'utilisateur: " + userId, e);
        }
    }

    public List<HotelReservationDTO> getAllReservations() {
        logger.info("📖 Getting all reservations");

        try {
            List<HotelReservation> reservations = reservationRepository.findAllByOrderByStartDateDesc();
            logger.info("✅ Found {} total reservations", reservations.size());

            return reservations.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            logger.error("❌ Error getting all reservations", e);
            throw new RuntimeException("Erreur lors de la récupération de toutes les réservations", e);
        }
    }

    public HotelReservationDTO getReservationById(Long id) {
        logger.info("📖 Getting reservation by ID: {}", id);

        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID de réservation invalide: " + id);
        }

        Optional<HotelReservation> reservationOpt = reservationRepository.findById(id);
        if (reservationOpt.isEmpty()) {
            logger.error("❌ Reservation not found with ID: {}", id);
            throw new RuntimeException("Réservation non trouvée avec l'ID: " + id);
        }

        HotelReservation reservation = reservationOpt.get();
        logger.info("✅ Reservation found: {}", reservation.getId());

        return convertToDTO(reservation);
    }

    public void cancelReservation(Long id) {
        logger.info("🚫 Canceling reservation: {}", id);

        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID de réservation invalide: " + id);
        }

        Optional<HotelReservation> reservationOpt = reservationRepository.findById(id);
        if (reservationOpt.isEmpty()) {
            logger.error("❌ Reservation not found for cancellation: {}", id);
            throw new RuntimeException("Réservation non trouvée avec l'ID: " + id);
        }

        HotelReservation reservation = reservationOpt.get();

        // Vérifier si la réservation peut être annulée (par exemple, au moins 24h avant)
        if (reservation.getStartDate().isBefore(LocalDate.now().plusDays(1))) {
            logger.error("❌ Cannot cancel reservation {} - too close to start date", id);
            throw new RuntimeException("Impossible d'annuler une réservation moins de 24h avant le début");
        }

        reservation.setPaymentStatus(PaymentStatus.CANCELLED);
        reservationRepository.save(reservation);
        logger.info("✅ Reservation {} canceled successfully", id);
    }

    public HotelReservationDTO updateReservationStatus(Long id, PaymentStatus status) {
        logger.info("🔄 Updating reservation {} status to: {}", id, status);

        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID de réservation invalide: " + id);
        }

        if (status == null) {
            throw new IllegalArgumentException("Le statut de paiement ne peut pas être null");
        }

        Optional<HotelReservation> reservationOpt = reservationRepository.findById(id);
        if (reservationOpt.isEmpty()) {
            logger.error("❌ Reservation not found for status update: {}", id);
            throw new RuntimeException("Réservation non trouvée avec l'ID: " + id);
        }

        HotelReservation reservation = reservationOpt.get();
        reservation.setPaymentStatus(status);

        HotelReservation updatedReservation = reservationRepository.save(reservation);
        logger.info("✅ Reservation status updated successfully: {} -> {}", id, status);

        return convertToDTO(updatedReservation);
    }

    private HotelReservationDTO convertToDTO(HotelReservation reservation) {
        logger.debug("🔄 Converting reservation to DTO: {}", reservation.getId());

        try {
            HotelReservationDTO dto = new HotelReservationDTO(
                    reservation.getId(),
                    reservation.getUser().getId(),
                    reservation.getUser().getEmail(),
                    reservation.getHotel().getId(),
                    reservation.getHotel().getName(),
                    reservation.getHotel().getCity(),
                    reservation.getStartDate(),
                    reservation.getEndDate(),
                    reservation.getNumberOfRooms(),
                    reservation.getNumberOfGuests(),
                    reservation.getTotalPrice(),
                    reservation.getPaymentStatus().toString()
            );

            logger.debug("✅ DTO conversion completed for reservation: {}", reservation.getId());
            return dto;

        } catch (Exception e) {
            logger.error("❌ Error converting reservation to DTO", e);
            throw new RuntimeException("Erreur lors de la conversion de la réservation en DTO", e);
        }
    }
}