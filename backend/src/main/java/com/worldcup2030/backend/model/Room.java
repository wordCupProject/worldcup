package com.worldcup2030.backend.model;
import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.*;

@Entity
public class Room {
    @Id @GeneratedValue
    private Long id;

    private String roomType;
    private BigDecimal pricePerNight;
    private boolean available;

    @ManyToOne
    private Hotel hotel;

    @OneToMany(mappedBy = "room")
    private List<HotelReservation> reservations;

    public Room() {
    }

    public Room(Long id, String roomType, BigDecimal pricePerNight, boolean available, Hotel hotel,
            List<HotelReservation> reservations) {
        this.id = id;
        this.roomType = roomType;
        this.pricePerNight = pricePerNight;
        this.available = available;
        this.hotel = hotel;
        this.reservations = reservations;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public BigDecimal getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public Hotel getHotel() {
        return hotel;
    }

    public void setHotel(Hotel hotel) {
        this.hotel = hotel;
    }

    public List<HotelReservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<HotelReservation> reservations) {
        this.reservations = reservations;
    }

    
}
