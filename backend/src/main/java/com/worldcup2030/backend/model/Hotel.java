package com.worldcup2030.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "hotel")
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private int stars;

    @Column(nullable = false)
    private String address;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private String photoPath; // Chemin de la photo

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "hotel_services",
            joinColumns = @JoinColumn(name = "hotel_id")
    )
    @Column(name = "service")
    private List<String> services;

    // Constructeurs
    public Hotel() {}

    public Hotel(String name, String city, int stars, String address, String description, List<String> services, String photoPath) {
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
        return "Hotel{" +
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