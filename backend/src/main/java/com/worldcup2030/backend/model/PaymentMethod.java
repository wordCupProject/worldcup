package com.worldcup2030.backend.model;

public enum PaymentMethod {
    CREDIT_CARD("Carte de crédit"),
    DEBIT_CARD("Carte de débit"),
    BANK_TRANSFER("Virement bancaire"),
    PAYPAL("PayPal"),
    CASH("Espèces"),
    MOBILE_PAYMENT("Paiement mobile");

    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return this.displayName;
    }
}