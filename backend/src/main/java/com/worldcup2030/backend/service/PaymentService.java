package com.worldcup2030.backend.service;

import com.worldcup2030.backend.dto.PaymentDTO;
import com.worldcup2030.backend.model.*;
import com.worldcup2030.backend.repository.HotelReservationRepository;
import com.worldcup2030.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private HotelReservationRepository reservationRepository;

    // Pattern pour valider le format MM/YY ou MM/YYYY
    private static final Pattern EXPIRY_DATE_PATTERN = Pattern.compile("^(0[1-9]|1[0-2])/([0-9]{2}|[0-9]{4})$");

    public PaymentDTO makePayment(PaymentDTO paymentDTO) {
        System.out.println("🔄 Processing payment: " + paymentDTO);

        // 1. Valider la réservation
        HotelReservation reservation = reservationRepository.findById(paymentDTO.getReservationId())
                .orElseThrow(() -> new IllegalArgumentException("Réservation non trouvée avec l'ID: " + paymentDTO.getReservationId()));

        // 2. Vérifier si un paiement existe déjà pour cette réservation
        if (paymentRepository.existsByReservationId(paymentDTO.getReservationId())) {
            throw new IllegalArgumentException("Un paiement existe déjà pour cette réservation");
        }

        // 3. Valider les données de paiement
        validatePaymentRequest(paymentDTO);

        // 4. Créer le paiement
        Payment payment = new Payment();
        payment.setReservation(reservation);
        payment.setAmount(paymentDTO.getAmount());
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());
        payment.setPaymentStatus(PaymentStatus.PENDING);

        // 5. Traitement spécifique selon la méthode de paiement
        if (paymentDTO.getPaymentMethod() == PaymentMethod.CREDIT_CARD ||
                paymentDTO.getPaymentMethod() == PaymentMethod.DEBIT_CARD) {

            // Valider les informations de carte
            validateCardPayment(paymentDTO);

            // Stocker les informations de carte (sauf le numéro complet et CVV)
            payment.setCardHolderName(paymentDTO.getCardHolderName());
            payment.setCardLastFour(getLastFourDigits(paymentDTO.getCardNumber()));
        }

        // 6. Initier le paiement
        Payment processedPayment = initiatePayment(payment);

        // 7. Convertir en DTO pour le retour
        return convertToDTO(processedPayment);
    }

    private void validatePaymentRequest(PaymentDTO paymentDTO) {
        if (paymentDTO.getReservationId() == null || paymentDTO.getReservationId() <= 0) {
            throw new IllegalArgumentException("ID de réservation invalide");
        }

        if (paymentDTO.getAmount() == null || paymentDTO.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Montant invalide");
        }

        if (paymentDTO.getPaymentMethod() == null) {
            throw new IllegalArgumentException("Méthode de paiement requise");
        }
    }

    private void validateCardPayment(PaymentDTO paymentDTO) {
        if (paymentDTO.getCardHolderName() == null || paymentDTO.getCardHolderName().trim().isEmpty()) {
            throw new IllegalArgumentException("Nom du titulaire de la carte requis");
        }

        if (paymentDTO.getCardNumber() == null || !isValidCardNumber(paymentDTO.getCardNumber())) {
            throw new IllegalArgumentException("Numéro de carte invalide");
        }

        if (paymentDTO.getExpiryDate() == null || !isValidExpiryDate(paymentDTO.getExpiryDate())) {
            throw new IllegalArgumentException("Date d'expiration invalide");
        }

        if (paymentDTO.getCvv() == null || !isValidCVV(paymentDTO.getCvv())) {
            throw new IllegalArgumentException("Code CVV invalide");
        }
    }

    private boolean isValidCardNumber(String cardNumber) {
        if (cardNumber == null) return false;
        String cleanNumber = cardNumber.replaceAll("\\s+", "");
        return cleanNumber.length() >= 13 && cleanNumber.length() <= 19 && cleanNumber.matches("\\d+");
    }

    private boolean isValidExpiryDate(String expiryDate) {
        if (expiryDate == null || expiryDate.trim().isEmpty()) {
            System.out.println("❌ Expiry date is null or empty");
            return false;
        }

        String cleanDate = expiryDate.trim();

        // Accepter MM/YY ou MM/YYYY
        if (EXPIRY_DATE_PATTERN.matcher(cleanDate).matches()) {
            try {
                String[] parts = cleanDate.split("/");
                int month = Integer.parseInt(parts[0]);
                int year = Integer.parseInt(parts[1]);

                if (year < 100) year += 2000;

                YearMonth cardExpiry = YearMonth.of(year, month);
                boolean isValid = !cardExpiry.isBefore(YearMonth.now());

                if (!isValid) {
                    System.out.println("❌ Card expired: " + cardExpiry + " (now: " + YearMonth.now() + ")");
                } else {
                    System.out.println("✅ Card expiry date valid: " + cardExpiry);
                }

                return isValid;

            } catch (Exception e) {
                System.out.println("❌ Error parsing MM/YYYY expiry: " + cleanDate);
                return false;
            }
        }

        // Accepter YYYY-MM
        if (cleanDate.matches("^\\d{4}-\\d{2}$")) {
            try {
                YearMonth cardExpiry = YearMonth.parse(cleanDate);
                boolean isValid = !cardExpiry.isBefore(YearMonth.now());

                if (!isValid) {
                    System.out.println("❌ Card expired: " + cardExpiry + " (now: " + YearMonth.now() + ")");
                } else {
                    System.out.println("✅ Card expiry date valid: " + cardExpiry);
                }

                return isValid;
            } catch (DateTimeParseException e) {
                System.out.println("❌ Error parsing YYYY-MM expiry: " + cleanDate + " - " + e.getMessage());
                return false;
            }
        }

        System.out.println("❌ Expiry date format invalid: " + cleanDate);
        return false;
    }

    private boolean isValidCVV(String cvv) {
        return cvv != null && cvv.matches("\\d{3,4}");
    }

    private String getLastFourDigits(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) return "****";
        String cleanNumber = cardNumber.replaceAll("\\s+", "");
        return "****" + cleanNumber.substring(cleanNumber.length() - 4);
    }

    private Payment initiatePayment(Payment payment) {
        try {
            String transactionId = generateTransactionId();
            payment.setTransactionId(transactionId);

            boolean paymentSuccess = simulatePaymentGateway(payment);

            if (paymentSuccess) {
                payment.setPaymentStatus(PaymentStatus.CONFIRMED);
                payment.setPaymentDate(LocalDateTime.now());
                payment.setPaymentGatewayResponse("Payment processed successfully");

                payment.getReservation().setPaymentStatus(PaymentStatus.valueOf("PAID"));
                reservationRepository.save(payment.getReservation());

                System.out.println("✅ Payment confirmed: " + transactionId);
            } else {
                payment.setPaymentStatus(PaymentStatus.FAILED);
                payment.setFailureReason("Paiement refusé par la banque");
                payment.setPaymentGatewayResponse("Payment declined");

                System.out.println("❌ Payment failed: " + transactionId);
            }

            return paymentRepository.save(payment);

        } catch (Exception e) {
            System.out.println("❌ Payment processing error: " + e.getMessage());
            payment.setPaymentStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Erreur technique: " + e.getMessage());

            return paymentRepository.save(payment);
        }
    }

    private boolean simulatePaymentGateway(Payment payment) {
        return Math.random() > 0.1; // 90% de réussite
    }

    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
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

        dto.setCardNumber(null); // Données sensibles non renvoyées
        dto.setCvv(null);

        return dto;
    }

    public PaymentDTO getPaymentByReservationId(Long reservationId) {
        Payment payment = paymentRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Aucun paiement trouvé pour cette réservation"));
        return convertToDTO(payment);
    }

    public PaymentDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Paiement non trouvé"));
        return convertToDTO(payment);
    }
}
