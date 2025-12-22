package com.worldcup2030.backend.controller;

import com.worldcup2030.backend.dto.PaymentDTO;
import com.worldcup2030.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<?> makePayment(@RequestBody PaymentDTO paymentDTO) {
        try {
            System.out.println("🔄 Payment request received: " + paymentDTO);

            PaymentDTO result = paymentService.makePayment(paymentDTO);

            System.out.println("✅ Payment processed successfully: " + result.getTransactionId());
            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            System.out.println("❌ Payment validation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.out.println("❌ Payment processing error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors du traitement du paiement: " + e.getMessage());
        }
    }

    @GetMapping("/by-reservation/{reservationId}")
    public ResponseEntity<?> getPaymentByReservation(@PathVariable Long reservationId) {
        try {
            PaymentDTO payment = paymentService.getPaymentByReservationId(reservationId);
            return ResponseEntity.ok(payment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.out.println("❌ Error fetching payment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la récupération du paiement");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        try {
            PaymentDTO payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(payment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.out.println("❌ Error fetching payment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la récupération du paiement");
        }
    }

    @PostMapping("/refund/{paymentId}")
    public ResponseEntity<?> refundPayment(@PathVariable Long paymentId) {
        try {
            // Implémentation du remboursement
            return ResponseEntity.ok("Remboursement en cours de traitement");
        } catch (Exception e) {
            System.out.println("❌ Refund error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors du remboursement");
        }
    }

    @PostMapping("/cancel/{paymentId}")
    public ResponseEntity<?> cancelPayment(@PathVariable Long paymentId) {
        try {
            // Implémentation de l'annulation
            return ResponseEntity.ok("Paiement annulé");
        } catch (Exception e) {
            System.out.println("❌ Cancel error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'annulation");
        }
    }
}