package com.worldcup2030.backend.model;
import java.util.List;

import jakarta.persistence.*;

@Entity
public class User {
    @Id @GeneratedValue
    private Long id;

    private String name;
    private String email;
    private String password;
    private String role;

    @OneToMany(mappedBy = "user")
    private List<Ticket> tickets;

    @OneToMany(mappedBy = "user")
    private List<HotelReservation> hotelReservations;

    @OneToMany(mappedBy = "user")
    private List<TransportReservation> transportReservations;

    public User() {
    }

    public User(Long id, String name, String email, String password, String role, List<Ticket> tickets,
            List<HotelReservation> hotelReservations, List<TransportReservation> transportReservations) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.tickets = tickets;
        this.hotelReservations = hotelReservations;
        this.transportReservations = transportReservations;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }

    public List<HotelReservation> getHotelReservations() {
        return hotelReservations;
    }

    public void setHotelReservations(List<HotelReservation> hotelReservations) {
        this.hotelReservations = hotelReservations;
    }

    public List<TransportReservation> getTransportReservations() {
        return transportReservations;
    }

    public void setTransportReservations(List<TransportReservation> transportReservations) {
        this.transportReservations = transportReservations;
    }

    
}

