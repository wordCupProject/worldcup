package com.worldcup2030.backend.controller;

import com.worldcup2030.backend.dto.PaymentDTO;
import com.worldcup2030.backend.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Endpoint principal pour effectuer un paiement
     */
    @PostMapping("/pay")
    public ResponseEntity<PaymentDTO> makePayment(@Valid @RequestBody PaymentDTO paymentDTO) {
        return ResponseEntity.ok((PaymentDTO) paymentService.makePayment(paymentDTO));
    }

    /**
     * Rembourse un paiement donné
     */
    @PostMapping("/refund/{paymentId}")
    public ResponseEntity<PaymentDTO> refund(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentService.refundPayment(paymentId));
    }

    /**
     * Annule un paiement donné
     */
    @PostMapping("/cancel/{paymentId}")
    public ResponseEntity<PaymentDTO> cancel(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentService.cancelPayment(paymentId));
    }

    /**
     * Récupère un paiement par ID de réservation (1 seul paiement par réservation max)
     */
    @GetMapping("/by-reservation/{reservationId}")
    public ResponseEntity<PaymentDTO> getByReservationId(@PathVariable Long reservationId) {
        return ResponseEntity.ok(paymentService.getPaymentByReservationId(reservationId));
    }
}
