package com.worldcup2030.backend.model;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;

@Entity
public class Transport {
    @Id @GeneratedValue
    private Long id;

    @Enumerated(EnumType.STRING)
    private TransportType type;

    private String departureCity;
    private String arrivalCity;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal price;

    @OneToMany(mappedBy = "transport")
    private List<TransportReservation> reservations;

    @OneToMany(mappedBy = "transport")
    private List<Offer> offers;

    public Transport() {
    }

    public Transport(Long id, TransportType type, String departureCity, String arrivalCity, LocalDateTime departureTime,
            LocalDateTime arrivalTime, BigDecimal price, List<TransportReservation> reservations, List<Offer> offers) {
        this.id = id;
        this.type = type;
        this.departureCity = departureCity;
        this.arrivalCity = arrivalCity;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.price = price;
        this.reservations = reservations;
        this.offers = offers;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TransportType getType() {
        return type;
    }

    public void setType(TransportType type) {
        this.type = type;
    }

    public String getDepartureCity() {
        return departureCity;
    }

    public void setDepartureCity(String departureCity) {
        this.departureCity = departureCity;
    }

    public String getArrivalCity() {
        return arrivalCity;
    }

    public void setArrivalCity(String arrivalCity) {
        this.arrivalCity = arrivalCity;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public List<TransportReservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<TransportReservation> reservations) {
        this.reservations = reservations;
    }

    public List<Offer> getOffers() {
        return offers;
    }

    public void setOffers(List<Offer> offers) {
        this.offers = offers;
    }


    
}
