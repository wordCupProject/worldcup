package com.worldcup2030.backend.model;
import java.math.BigDecimal;

import jakarta.persistence.*;

@Entity
public class Offer {
    @Id @GeneratedValue
    private Long id;

    private String title;
    private BigDecimal totalPrice;
    private String description;

    @ManyToOne
    private Match match;

    @ManyToOne
    private Hotel hotel;

    @ManyToOne
    private Transport transport;

    public Offer() {
    }

    public Offer(Long id, String title, BigDecimal totalPrice, String description, Match match, Hotel hotel,
            Transport transport) {
        this.id = id;
        this.title = title;
        this.totalPrice = totalPrice;
        this.description = description;
        this.match = match;
        this.hotel = hotel;
        this.transport = transport;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Match getMatch() {
        return match;
    }

    public void setMatch(Match match) {
        this.match = match;
    }

    public Hotel getHotel() {
        return hotel;
    }

    public void setHotel(Hotel hotel) {
        this.hotel = hotel;
    }

    public Transport getTransport() {
        return transport;
    }

    public void setTransport(Transport transport) {
        this.transport = transport;
    }

    
}

