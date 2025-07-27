package com.worldcup2030.backend.model;

public enum PaymentStatus {
    PENDING("En attente"),
    CONFIRMED("Confirmé"),
    CANCELLED("Annulé"),
    REFUNDED("Remboursé"),
    FAILED("Échec");

    private final String displayName;

    PaymentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}