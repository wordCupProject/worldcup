package com.worldcup2030.backend.controller;

import com.worldcup2030.backend.dto.ReservationRequestDTO;
import com.worldcup2030.backend.dto.TransportReservationDTO;
import com.worldcup2030.backend.service.TransportReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:4200")
public class ReservationController {

    private final TransportReservationService reservationService;

    public ReservationController(TransportReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<TransportReservationDTO> createReservation(@RequestBody ReservationRequestDTO requestDTO) {
        try {
            TransportReservationDTO reservation = reservationService.createReservation(
                    requestDTO.getUserId(),
                    requestDTO.getTransportId()
            );
            return ResponseEntity.ok(reservation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransportReservationDTO>> getUserReservations(@PathVariable Long userId) {
        try {
            List<TransportReservationDTO> reservations = reservationService.getReservationsByUserId(userId);
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long reservationId) {
        try {
            reservationService.cancelReservation(reservationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}