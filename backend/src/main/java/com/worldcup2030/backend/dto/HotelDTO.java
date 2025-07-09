package com.worldcup2030.backend.dto;

import java.util.List;

public class HotelDTO {
    private Long id;
    private String name;
    private String city;
    private int stars;
    private String address;
    private String description;
    private List<String> services;
    private String photoPath; // Nouveau champ pour le chemin de la photo

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

    public HotelDTO(Long id, String name, String city, int stars, String address, String description, List<String> services, String photoPath) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.stars = stars;
        this.address = address;
        this.description = description;
        this.services = services;
        this.photoPath = photoPath;
    }

    // Getters et Setters
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

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    @Override
    public String toString() {
        return "HotelDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", city='" + city + '\'' +
                ", stars=" + stars +
                ", address='" + address + '\'' +
                ", description='" + description + '\'' +
                ", services=" + services +
                ", photoPath='" + photoPath + '\'' +
                '}';
    }
}