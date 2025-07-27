package com.worldcup2030.backend.controller;

import com.worldcup2030.backend.dto.HotelReservationDTO;
import com.worldcup2030.backend.model.PaymentStatus;
import com.worldcup2030.backend.service.HotelReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotel-reservations")
@CrossOrigin(origins = "http://localhost:4200")
public class HotelReservationController {

    private final HotelReservationService reservationService;

    public HotelReservationController(HotelReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<HotelReservationDTO> createReservation(@RequestBody HotelReservationDTO reservationDTO) {
        try {
            HotelReservationDTO createdReservation = reservationService.createReservation(reservationDTO);
            return new ResponseEntity<>(createdReservation, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<HotelReservationDTO>> getUserReservations(@PathVariable Long userId) {
        try {
            List<HotelReservationDTO> reservations = reservationService.getUserReservations(userId);
            return new ResponseEntity<>(reservations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<HotelReservationDTO>> getAllReservations() {
        try {
            List<HotelReservationDTO> reservations = reservationService.getAllReservations();
            return new ResponseEntity<>(reservations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelReservationDTO> getReservationById(@PathVariable Long id) {
        try {
            HotelReservationDTO reservation = reservationService.getReservationById(id);
            return new ResponseEntity<>(reservation, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelReservation(@PathVariable Long id) {
        try {
            reservationService.cancelReservation(id);
            return new ResponseEntity<>("Réservation annulée avec succès", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<HotelReservationDTO> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            PaymentStatus paymentStatus = PaymentStatus.valueOf(status.toUpperCase());
            HotelReservationDTO updatedReservation = reservationService.updateReservationStatus(id, paymentStatus);
            return new ResponseEntity<>(updatedReservation, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long id) {
        try {
            reservationService.cancelReservation(id);
            return new ResponseEntity<>("Réservation supprimée avec succès", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
