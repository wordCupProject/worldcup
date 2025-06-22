package com.worldcup2030.backend.model;
import java.util.List;

import jakarta.persistence.*;
@Entity
public class Hotel {
    @Id @GeneratedValue
    private Long id;

    private String name;
    private String city;
    private String address;
    private int stars;

    @OneToMany(mappedBy = "hotel")
    private List<Room> rooms;

    @OneToMany(mappedBy = "hotel")
    private List<Offer> offers;

    public Hotel() {
    }

    public Hotel(Long id, String name, String city, String address, int stars, List<Room> rooms, List<Offer> offers) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.address = address;
        this.stars = stars;
        this.rooms = rooms;
        this.offers = offers;
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

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getStars() {
        return stars;
    }

    public void setStars(int stars) {
        this.stars = stars;
    }

    public List<Room> getRooms() {
        return rooms;
    }

    public void setRooms(List<Room> rooms) {
        this.rooms = rooms;
    }

    public List<Offer> getOffers() {
        return offers;
    }

    public void setOffers(List<Offer> offers) {
        this.offers = offers;
    }


    
}
