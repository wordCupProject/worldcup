package com.worldcup2030.backend.service;

import com.worldcup2030.backend.dto.PaymentDTO;
import com.worldcup2030.backend.model.*;
import com.worldcup2030.backend.repository.PaymentRepository;
import com.worldcup2030.backend.repository.HotelReservationRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final HotelReservationRepository reservationRepository;
    private final PaymentGatewayService paymentGatewayService;

    public PaymentService(PaymentRepository paymentRepository,
                          HotelReservationRepository reservationRepository,
                          PaymentGatewayService paymentGatewayService) {
        this.paymentRepository = paymentRepository;
        this.reservationRepository = reservationRepository;
        this.paymentGatewayService = paymentGatewayService;
    }

    public PaymentDTO initiatePayment(PaymentDTO paymentDTO) {
        logger.info("🚀 Initiating payment: {}", paymentDTO);

        try {
            validatePaymentRequest(paymentDTO);
            HotelReservation reservation = getReservationById(paymentDTO.getReservationId());

            if (paymentRepository.hasConfirmedPayment(reservation.getId())) {
                throw new RuntimeException("Cette réservation a déjà été payée");
            }

            if (paymentDTO.getAmount().compareTo(reservation.getTotalPrice()) != 0) {
                throw new RuntimeException("Le montant du paiement ne correspond pas au prix de la réservation");
            }

            Payment payment = createPaymentEntity(paymentDTO, reservation);
            Payment savedPayment = paymentRepository.save(payment);
            logger.info("✅ Payment created with ID: {}", savedPayment.getId());

            return convertToDTO(savedPayment);

        } catch (RuntimeException e) {
            logger.error("❌ Error initiating payment: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("❌ Unexpected error initiating payment", e);
            throw new RuntimeException("Erreur lors de l'initiation du paiement: " + e.getMessage(), e);
        }
    }

    public PaymentDTO processPayment(Long paymentId) {
        logger.info("💳 Processing payment: {}", paymentId);

        try {
            Payment payment = getPaymentById(paymentId);

            if (payment.getPaymentStatus() != PaymentStatus.PENDING) {
                throw new RuntimeException("Ce paiement ne peut pas être traité (statut: " + payment.getPaymentStatus() + ")");
            }

            PaymentGatewayService.PaymentGatewayResponse gatewayResponse = paymentGatewayService.processPayment(payment);
            updatePaymentFromGatewayResponse(payment, gatewayResponse);

            if (payment.getPaymentStatus() == PaymentStatus.CONFIRMED) {
                updateReservationPaymentStatus(payment.getReservation(), PaymentStatus.CONFIRMED);
                logger.info("✅ Payment confirmed and reservation updated");
            } else {
                logger.warn("⚠️ Payment failed or pending: {}", payment.getPaymentStatus());
            }

            Payment updatedPayment = paymentRepository.save(payment);
            return convertToDTO(updatedPayment);

        } catch (RuntimeException e) {
            logger.error("❌ Error processing payment: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("❌ Unexpected error processing payment", e);
            throw new RuntimeException("Erreur lors du traitement du paiement: " + e.getMessage(), e);
        }
    }

    public List<PaymentDTO> getUserPayments(Long userId) {
        logger.info("📖 Getting payments for user: {}", userId);

        try {
            List<Payment> payments = paymentRepository.findByUserId(userId);
            logger.info("✅ Found {} payments for user {}", payments.size(), userId);

            return payments.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            logger.error("❌ Error getting user payments", e);
            throw new RuntimeException("Erreur lors de la récupération des paiements: " + e.getMessage(), e);
        }
    }

    public PaymentDTO getPaymentByReservationId(Long reservationId) {
        logger.info("📖 Getting payment for reservation: {}", reservationId);

        Optional<Payment> paymentOpt = paymentRepository.findByReservationId(reservationId);

        if (paymentOpt.isEmpty()) {
            throw new RuntimeException("Aucun paiement trouvé pour cette réservation");
        }

        return convertToDTO(paymentOpt.get());
    }

    public PaymentDTO refundPayment(Long paymentId) {
        logger.info("💰 Refunding payment: {}", paymentId);

        try {
            Payment payment = getPaymentById(paymentId);

            if (payment.getPaymentStatus() != PaymentStatus.CONFIRMED) {
                throw new RuntimeException("Seuls les paiements confirmés peuvent être remboursés");
            }

            PaymentGatewayService.PaymentGatewayResponse refundResponse = paymentGatewayService.refundPayment(payment);

            if (refundResponse.isSuccess()) {
                payment.setPaymentStatus(PaymentStatus.REFUNDED);
                payment.setPaymentGatewayResponse(refundResponse.getMessage());
                updateReservationPaymentStatus(payment.getReservation(), PaymentStatus.REFUNDED);
                logger.info("✅ Payment refunded successfully");
            } else {
                throw new RuntimeException("Échec du remboursement: " + refundResponse.getMessage());
            }

            Payment updatedPayment = paymentRepository.save(payment);
            return convertToDTO(updatedPayment);

        } catch (RuntimeException e) {
            logger.error("❌ Error refunding payment: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("❌ Unexpected error refunding payment", e);
            throw new RuntimeException("Erreur lors du remboursement: " + e.getMessage(), e);
        }
    }

    public PaymentDTO cancelPayment(Long paymentId) {
        logger.info("🚫 Canceling payment: {}", paymentId);

        try {
            Payment payment = getPaymentById(paymentId);

            if (payment.getPaymentStatus() != PaymentStatus.PENDING) {
                throw new RuntimeException("Seuls les paiements en attente peuvent être annulés");
            }

            payment.setPaymentStatus(PaymentStatus.CANCELLED);
            payment.setFailureReason("Annulé par l'utilisateur");

            Payment updatedPayment = paymentRepository.save(payment);
            logger.info("✅ Payment canceled successfully");

            return convertToDTO(updatedPayment);

        } catch (RuntimeException e) {
            logger.error("❌ Error canceling payment: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("❌ Unexpected error canceling payment", e);
            throw new RuntimeException("Erreur lors de l'annulation du paiement: " + e.getMessage(), e);
        }
    }

    private PaymentDTO convertToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setReservationId(payment.getReservation().getId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setPaymentStatus(payment.getPaymentStatus());
        dto.setTransactionId(payment.getTransactionId());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setCreatedAt(payment.getCreatedAt());
        dto.setUpdatedAt(payment.getUpdatedAt());
        dto.setCardHolderName(payment.getCardHolderName());
        dto.setCardLastFour(payment.getCardLastFour());
        dto.setPaymentGatewayResponse(payment.getPaymentGatewayResponse());
        dto.setFailureReason(payment.getFailureReason());
        return dto;
    }

    // ================= MÉTHODES PRIVÉES ===================

    private void validatePaymentRequest(PaymentDTO paymentDTO) {
        if (paymentDTO == null) {
            throw new IllegalArgumentException("Les données de paiement sont manquantes");
        }
        if (paymentDTO.getReservationId() == null || paymentDTO.getReservationId() <= 0) {
            throw new IllegalArgumentException("ID de réservation invalide");
        }
        if (paymentDTO.getAmount() == null || paymentDTO.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Montant invalide");
        }
        if (paymentDTO.getPaymentMethod() == null) {
            throw new IllegalArgumentException("Méthode de paiement manquante");
        }
        if (paymentDTO.getPaymentMethod() == PaymentMethod.CREDIT_CARD ||
                paymentDTO.getPaymentMethod() == PaymentMethod.DEBIT_CARD) {
            validateCardPayment(paymentDTO);
        }
    }

    private void validateCardPayment(PaymentDTO paymentDTO) {
        if (paymentDTO.getCardHolderName() == null || paymentDTO.getCardHolderName().trim().isEmpty()) {
            throw new IllegalArgumentException("Nom du titulaire de la carte manquant");
        }
        if (paymentDTO.getCardNumber() == null || !paymentDTO.getCardNumber().matches("^[0-9]{13,19}$")) {
            throw new IllegalArgumentException("Numéro de carte invalide");
        }
        if (paymentDTO.getExpiryDate() == null || !paymentDTO.getExpiryDate().matches("^(0[1-9]|1[0-2])/[0-9]{2}$")) {
            throw new IllegalArgumentException("Date d'expiration invalide");
        }
        if (paymentDTO.getCvv() == null || !paymentDTO.getCvv().matches("^[0-9]{3,4}$")) {
            throw new IllegalArgumentException("CVV invalide");
        }
    }

    private HotelReservation getReservationById(Long reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'ID: " + reservationId));
    }

    private Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé avec l'ID: " + paymentId));
    }

    private Payment createPaymentEntity(PaymentDTO paymentDTO, HotelReservation reservation) {
        Payment payment = new Payment(reservation, paymentDTO.getAmount(), paymentDTO.getPaymentMethod());
        payment.setTransactionId(generateTransactionId());

        if (paymentDTO.getPaymentMethod() == PaymentMethod.CREDIT_CARD ||
                paymentDTO.getPaymentMethod() == PaymentMethod.DEBIT_CARD) {
            payment.setCardHolderName(paymentDTO.getCardHolderName());
            payment.setCardLastFour(extractLastFourDigits(paymentDTO.getCardNumber()));
        }

        return payment;
    }

    private void updatePaymentFromGatewayResponse(Payment payment, PaymentGatewayService.PaymentGatewayResponse response) {
        if (response.isSuccess()) {
            payment.setPaymentStatus(PaymentStatus.CONFIRMED);
            payment.setPaymentDate(LocalDateTime.now());
        } else {
            payment.setPaymentStatus(PaymentStatus.FAILED);
            payment.setFailureReason(response.getMessage());
        }
        payment.setPaymentGatewayResponse(response.getFullResponse());
    }

    private void updateReservationPaymentStatus(HotelReservation reservation, PaymentStatus status) {
        reservation.setPaymentStatus(status);
        reservationRepository.save(reservation);
    }

    private String generateTransactionId() {
        return "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String extractLastFourDigits(String cardNumber) {
        if (cardNumber != null && cardNumber.length() >= 4) {
            return cardNumber.substring(cardNumber.length() - 4);
        }
        return null;
    }

    public PaymentDTO makePayment(PaymentDTO paymentDTO) {
        // Étape 1 : créer le paiement
        PaymentDTO initiatedPayment = initiatePayment(paymentDTO);

        // Étape 2 : le traiter via la passerelle
        return processPayment(initiatedPayment.getId());
    }
}
