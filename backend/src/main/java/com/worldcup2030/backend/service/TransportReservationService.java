package com.worldcup2030.backend.service;

import com.worldcup2030.backend.dto.TransportReservationDTO;
import com.worldcup2030.backend.model.*;
import com.worldcup2030.backend.repository.TransportRepository;
import com.worldcup2030.backend.repository.TransportReservationRepository;
import com.worldcup2030.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class TransportReservationService {

    @Autowired
    private TransportReservationRepository reservationRepository;

    @Autowired
    private TransportRepository transportRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public TransportReservationDTO createReservation(Long userId, Long transportId) {
        // Vérifier que l'utilisateur existe
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier que le transport existe
        Transport transport = transportRepository.findById(transportId)
                .orElseThrow(() -> new RuntimeException("Transport non trouvé"));

        // Vérifier la disponibilité (places restantes)
        long reservationsCount = reservationRepository.countByTransportId(transportId);
        if (reservationsCount >= transport.getCapacite()) {
            throw new RuntimeException("Aucune place disponible pour ce transport");
        }

        // Vérifier si l'utilisateur n'a pas déjà réservé ce transport
        boolean alreadyReserved = reservationRepository.existsByUserIdAndTransportId(userId, transportId);
        if (alreadyReserved) {
            throw new RuntimeException("Vous avez déjà réservé ce transport");
        }

        // Créer la réservation
        TransportReservation reservation = new TransportReservation();
        reservation.setUser(user);
        reservation.setTransport(transport);
        reservation.setSeatNumber(generateSeatNumber(transport.getType()));
        reservation.setPaymentStatus(PaymentStatus.PENDING);

        // Sauvegarder la réservation
        TransportReservation saved = reservationRepository.save(reservation);

        // Mettre à jour le nombre de places disponibles
        transport.setPlace(transport.getCapacite() - (int) reservationsCount - 1);
        transportRepository.save(transport);

        return convertToDTO(saved);
    }

    public List<TransportReservationDTO> getReservationsByUserId(Long userId) {
        List<TransportReservation> reservations = reservationRepository.findByUserId(userId);
        return reservations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelReservation(Long reservationId) {
        TransportReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        // Libérer la place
        Transport transport = reservation.getTransport();
        transport.setPlace(transport.getPlace() + 1);
        transportRepository.save(transport);

        // Supprimer la réservation
        reservationRepository.delete(reservation);
    }

    private String generateSeatNumber(TransportType type) {
        Random random = new Random();
        switch (type) {
            case PLANE:
                char row = (char) ('A' + random.nextInt(26));
                int number = 1 + random.nextInt(30);
                return row + String.valueOf(number);
            case TRAIN:
                return "Car" + (1 + random.nextInt(10)) + "-" + (1 + random.nextInt(50));
            case BUS:
                return String.valueOf(1 + random.nextInt(50));
            case CAR:
                return String.valueOf(1 + random.nextInt(4));
            default:
                return "SEAT-" + random.nextInt(100);
        }
    }

    private TransportReservationDTO convertToDTO(TransportReservation reservation) {
        TransportReservationDTO dto = new TransportReservationDTO();
        dto.setId(reservation.getId());
        dto.setSeatNumber(reservation.getSeatNumber());
        dto.setPaymentStatus(reservation.getPaymentStatus().name());
        dto.setUserId(reservation.getUser().getId());
        dto.setUserName(reservation.getUser().getFirstName() + " " + reservation.getUser().getLastName());

        Transport transport = reservation.getTransport();
        dto.setTransportId(transport.getId());
        dto.setTransportType(transport.getType().name());
        dto.setDepartureCity(transport.getDepartureCity());
        dto.setArrivalCity(transport.getArrivalCity());
        dto.setDepartureTime(transport.getDepartureTime().toString());
        dto.setArrivalTime(transport.getArrivalTime().toString());
        dto.setPrice(transport.getPrice());

        return dto;
    }
}