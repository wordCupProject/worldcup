package com.worldcup2030.backend.model;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;

@Entity
public class Match {
    @Id @GeneratedValue
    private Long id;

    private String teamA;
    private String teamB;
    private LocalDateTime date;
    private String stadium;
    private String city;

    @OneToMany(mappedBy = "match")
    private List<Ticket> tickets;

    @OneToMany(mappedBy = "match")
    private List<Offer> offers;

    public Match() {
    }

    public Match(Long id, String teamA, String teamB, LocalDateTime date, String stadium, String city,
            List<Ticket> tickets, List<Offer> offers) {
        this.id = id;
        this.teamA = teamA;
        this.teamB = teamB;
        this.date = date;
        this.stadium = stadium;
        this.city = city;
        this.tickets = tickets;
        this.offers = offers;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTeamA() {
        return teamA;
    }

    public void setTeamA(String teamA) {
        this.teamA = teamA;
    }

    public String getTeamB() {
        return teamB;
    }

    public void setTeamB(String teamB) {
        this.teamB = teamB;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getStadium() {
        return stadium;
    }

    public void setStadium(String stadium) {
        this.stadium = stadium;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }

    public List<Offer> getOffers() {
        return offers;
    }

    public void setOffers(List<Offer> offers) {
        this.offers = offers;
    }


    
}

