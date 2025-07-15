package com.worldcup2030.backend.dto;

public class TransportDTO {

    private Long id;
    private String type;
    private String departureCity;
    private String arrivalCity;
    private String departureTime; // ISO-8601 string
    private String arrivalTime;
    private int capacite;
    private int place;
    private int price;
    private String compagnie;

    public TransportDTO() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDepartureCity() { return departureCity; }
    public void setDepartureCity(String departureCity) { this.departureCity = departureCity; }

    public String getArrivalCity() { return arrivalCity; }
    public void setArrivalCity(String arrivalCity) { this.arrivalCity = arrivalCity; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public int getCapacite() { return capacite; }
    public void setCapacite(int capacite) { this.capacite = capacite; }

    public int getPlace() { return place; }
    public void setPlace(int place) { this.place = place; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public String getCompagnie() { return compagnie; }
    public void setCompagnie(String compagnie) { this.compagnie = compagnie; }
}
