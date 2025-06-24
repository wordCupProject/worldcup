package com.worldcup2030.backend.model;
import jakarta.persistence.*;

@Entity
public class TransportReservation {
    @Id @GeneratedValue
    private Long id;

    private String seatNumber;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @ManyToOne
    private User user;

    @ManyToOne
    private Transport transport;

    public TransportReservation() {
    }

    public TransportReservation(Long id, String seatNumber, PaymentStatus paymentStatus, User user,
            Transport transport) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.paymentStatus = paymentStatus;
        this.user = user;
        this.transport = transport;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Transport getTransport() {
        return transport;
    }

    public void setTransport(Transport transport) {
        this.transport = transport;
    }


    
}

