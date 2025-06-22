package com.worldcup2030.backend.model;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class Ticket {
    @Id @GeneratedValue
    private Long id;

    private String seatNumber;
    private BigDecimal price;
    private LocalDateTime purchasedAt;

    @ManyToOne
    private User user;

    @ManyToOne
    private Match match;

    public Ticket() {
    }

    public Ticket(Long id, String seatNumber, BigDecimal price, LocalDateTime purchasedAt, User user, Match match) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.price = price;
        this.purchasedAt = purchasedAt;
        this.user = user;
        this.match = match;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public LocalDateTime getPurchasedAt() {
        return purchasedAt;
    }

    public void setPurchasedAt(LocalDateTime purchasedAt) {
        this.purchasedAt = purchasedAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Match getMatch() {
        return match;
    }

    public void setMatch(Match match) {
        this.match = match;
    }


    
}
