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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class HotelReservationService {

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
        // Récupérer l'utilisateur
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Récupérer l'hôtel
        Hotel hotel = hotelRepository.findById(dto.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hôtel non trouvé"));

        // Calculer le prix total (prix de base * nombre de nuits * nombre de chambres)
        long numberOfNights = ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate());
        BigDecimal totalPrice = BigDecimal.valueOf(1000) // Prix de base par nuit
                .multiply(BigDecimal.valueOf(numberOfNights))
                .multiply(BigDecimal.valueOf(dto.getNumberOfRooms()));

        // Créer la réservation
        HotelReservation reservation = new HotelReservation();
        reservation.setUser(user);
        reservation.setHotel(hotel);
        reservation.setStartDate(dto.getStartDate());
        reservation.setEndDate(dto.getEndDate());
        reservation.setNumberOfRooms(dto.getNumberOfRooms());
        reservation.setNumberOfGuests(dto.getNumberOfGuests());
        reservation.setTotalPrice(totalPrice);
        reservation.setPaymentStatus(PaymentStatus.PENDING);

        HotelReservation savedReservation = reservationRepository.save(reservation);
        return convertToDTO(savedReservation);
    }

    public List<HotelReservationDTO> getUserReservations(Long userId) {
        List<HotelReservation> reservations = reservationRepository.findByUserIdOrderByStartDateDesc(userId);
        return reservations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<HotelReservationDTO> getAllReservations() {
        List<HotelReservation> reservations = reservationRepository.findAllByOrderByStartDateDesc();
        return reservations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public HotelReservationDTO getReservationById(Long id) {
        HotelReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
        return convertToDTO(reservation);
    }

    public void cancelReservation(Long id) {
        HotelReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        // Vérifier si la réservation peut être annulée (par exemple, au moins 24h avant)
        if (reservation.getStartDate().isBefore(LocalDate.now().plusDays(1))) {
            throw new RuntimeException("Impossible d'annuler une réservation moins de 24h avant le début");
        }

        reservation.setPaymentStatus(PaymentStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    public HotelReservationDTO updateReservationStatus(Long id, PaymentStatus status) {
        HotelReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        reservation.setPaymentStatus(status);
        HotelReservation updatedReservation = reservationRepository.save(reservation);
        return convertToDTO(updatedReservation);
    }

    private HotelReservationDTO convertToDTO(HotelReservation reservation) {
        return new HotelReservationDTO(
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
    }
}