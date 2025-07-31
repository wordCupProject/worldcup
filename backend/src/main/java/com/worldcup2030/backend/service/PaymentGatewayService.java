package com.worldcup2030.backend.service;

import com.worldcup2030.backend.model.Payment;
import com.worldcup2030.backend.model.PaymentMethod;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class PaymentGatewayService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentGatewayService.class);
    private final Random random = new Random();

    /**
     * Simule le traitement d'un paiement via une passerelle externe
     * Dans un vrai projet, ceci ferait appel à Stripe, PayPal, etc.
     */
    public PaymentGatewayResponse processPayment(Payment payment) {
        logger.info("🌐 Processing payment through gateway for transaction: {}", payment.getTransactionId());

        try {
            // Simulation d'un appel réseau (délai)
            Thread.sleep(ThreadLocalRandom.current().nextInt(1000, 3000));

            // Simulation de différents scénarios selon la méthode de paiement
            PaymentGatewayResponse response = simulatePaymentProcessing(payment);

            logger.info("🔄 Gateway responded with: {} for transaction: {}",
                    response.isSuccess() ? "SUCCESS" : "FAILURE",
                    payment.getTransactionId());

            return response;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.error("❌ Payment processing interrupted: {}", payment.getTransactionId());
            return new PaymentGatewayResponse(false, "INTERRUPTED", "Traitement interrompu", "{}");

        } catch (Exception e) {
            logger.error("❌ Gateway error for transaction: {}", payment.getTransactionId(), e);
            return new PaymentGatewayResponse(false, "GATEWAY_ERROR", "Erreur de la passerelle: " + e.getMessage(), "{}");
        }
    }

    /**
     * Simule le remboursement via la passerelle
     */
    public PaymentGatewayResponse refundPayment(Payment payment) {
        logger.info("💰 Processing refund through gateway for transaction: {}", payment.getTransactionId());

        try {
            // Simulation d'un délai réseau
            Thread.sleep(ThreadLocalRandom.current().nextInt(500, 1500));

            // Les remboursements ont généralement un taux de succès plus élevé
            boolean success = random.nextDouble() > 0.05; // 95% de succès

            if (success) {
                String refundId = "REF-" + System.currentTimeMillis();
                return new PaymentGatewayResponse(
                        true,
                        "REFUND_SUCCESS",
                        "Remboursement traité avec succès",
                        String.format("{\"refund_id\":\"%s\",\"status\":\"completed\"}", refundId)
                );
            } else {
                return new PaymentGatewayResponse(
                        false,
                        "REFUND_FAILED",
                        "Le remboursement a échoué",
                        "{\"error\":\"insufficient_funds\",\"status\":\"failed\"}"
                );
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.error("❌ Refund processing interrupted: {}", payment.getTransactionId());
            return new PaymentGatewayResponse(false, "INTERRUPTED", "Remboursement interrompu", "{}");

        } catch (Exception e) {
            logger.error("❌ Refund gateway error for transaction: {}", payment.getTransactionId(), e);
            return new PaymentGatewayResponse(false, "GATEWAY_ERROR", "Erreur lors du remboursement: " + e.getMessage(), "{}");
        }
    }

    private PaymentGatewayResponse simulatePaymentProcessing(Payment payment) {
        PaymentMethod method = payment.getPaymentMethod();
        double successRate = getSuccessRateForMethod(method);

        // Simuler des conditions qui peuvent affecter le succès
        boolean hasIssues = simulateCommonIssues(payment);

        if (hasIssues) {
            successRate *= 0.3; // Réduire le taux de succès en cas de problème
        }

        boolean success = random.nextDouble() < successRate;

        if (success) {
            return createSuccessResponse(payment);
        } else {
            return createFailureResponse(payment, hasIssues);
        }
    }

    private double getSuccessRateForMethod(PaymentMethod method) {
        return switch (method) {
            case CREDIT_CARD -> 0.92;      // 92% de succès
            case DEBIT_CARD -> 0.89;       // 89% de succès
            case PAYPAL -> 0.96;           // 96% de succès
            case BANK_TRANSFER -> 0.85;    // 85% de succès
            case MOBILE_PAYMENT -> 0.91;   // 91% de succès
            case CASH -> 1.0;              // 100% de succès (paiement en personne)
        };
    }

    private boolean simulateCommonIssues(Payment payment) {
        // Simuler des problèmes courants (10% de chance)
        if (random.nextDouble() < 0.1) {
            logger.warn("⚠️ Simulating payment issue for transaction: {}", payment.getTransactionId());
            return true;
        }

        // Simuler des problèmes pour les gros montants (plus de 5000 MAD)
        if (payment.getAmount().doubleValue() > 5000 && random.nextDouble() < 0.05) {
            logger.warn("⚠️ Simulating high-amount payment issue for transaction: {}", payment.getTransactionId());
            return true;
        }

        return false;
    }

    private PaymentGatewayResponse createSuccessResponse(Payment payment) {
        String authorizationCode = "AUTH-" + ThreadLocalRandom.current().nextInt(100000, 999999);
        String gatewayTransactionId = "GTW-" + System.currentTimeMillis();

        String response = String.format(
                "{\"status\":\"success\",\"gateway_transaction_id\":\"%s\",\"authorization_code\":\"%s\",\"amount\":%.2f,\"currency\":\"MAD\"}",
                gatewayTransactionId, authorizationCode, payment.getAmount()
        );

        return new PaymentGatewayResponse(
                true,
                "PAYMENT_SUCCESS",
                "Paiement traité avec succès",
                response
        );
    }

    private PaymentGatewayResponse createFailureResponse(Payment payment, boolean hasIssues) {
        String[] errorCodes = {
                "INSUFFICIENT_FUNDS", "CARD_DECLINED", "EXPIRED_CARD",
                "INVALID_CVV", "FRAUD_DETECTED", "NETWORK_ERROR",
                "BANK_TIMEOUT", "INVALID_ACCOUNT"
        };

        String[] errorMessages = {
                "Fonds insuffisants", "Carte refusée par la banque", "Carte expirée",
                "CVV invalide", "Transaction suspecte détectée", "Erreur réseau",
                "Délai d'attente de la banque dépassé", "Compte invalide"
        };

        int errorIndex = random.nextInt(errorCodes.length);
        String errorCode = errorCodes[errorIndex];
        String errorMessage = errorMessages[errorIndex];

        // Ajuster le message si c'est dû à des problèmes simulés
        if (hasIssues && random.nextBoolean()) {
            errorCode = "TEMPORARY_ISSUE";
            errorMessage = "Problème temporaire, veuillez réessayer";
        }

        String response = String.format(
                "{\"status\":\"failed\",\"error_code\":\"%s\",\"error_message\":\"%s\",\"amount\":%.2f,\"currency\":\"MAD\"}",
                errorCode, errorMessage, payment.getAmount()
        );

        return new PaymentGatewayResponse(
                false,
                errorCode,
                errorMessage,
                response
        );
    }

    /**
     * Classe interne pour encapsuler la réponse de la passerelle
     */
    public static class PaymentGatewayResponse {
        private final boolean success;
        private final String code;
        private final String message;
        private final String fullResponse;

        public PaymentGatewayResponse(boolean success, String code, String message, String fullResponse) {
            this.success = success;
            this.code = code;
            this.message = message;
            this.fullResponse = fullResponse;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getCode() {
            return code;
        }

        public String getMessage() {
            return message;
        }

        public String getFullResponse() {
            return fullResponse;
        }

        @Override
        public String toString() {
            return String.format("PaymentGatewayResponse{success=%s, code='%s', message='%s'}",
                    success, code, message);
        }
    }
}