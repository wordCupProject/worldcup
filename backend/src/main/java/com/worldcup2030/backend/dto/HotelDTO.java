package com.worldcup2030.backend.dto;

import java.util.List;

public class HotelDTO {
    private String name;
    private String city;
    private int stars;
    private String address;
    private String description;
    private List<String> services;

    // Constructeurs
    public HotelDTO() {}

    public HotelDTO(String name, String city, int stars, String address, String description, List<String> services) {
        this.name = name;
        this.city = city;
        this.stars = stars;
        this.address = address;
        this.description = description;
        this.services = services;
    }

    // Getters et Setters
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

    public int getStars() {
        return stars;
    }

    public void setStars(int stars) {
        this.stars = stars;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getServices() {
        return services;
    }

    public void setServices(List<String> services) {
        this.services = services;
    }

    @Override
    public String toString() {
        return "HotelDTO{" +
                "name='" + name + '\'' +
                ", city='" + city + '\'' +
                ", stars=" + stars +
                ", address='" + address + '\'' +
                ", description='" + description + '\'' +
                ", services=" + services +
                '}';
    }
}