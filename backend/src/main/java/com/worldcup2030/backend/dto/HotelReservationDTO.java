package com.worldcup2030.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class HotelReservationDTO {
    private Long id;
    private Long userId;
    private String userEmail;
    private Long hotelId;
    private String hotelName;
    private String hotelCity;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numberOfRooms;
    private Integer numberOfGuests;
    private BigDecimal totalPrice;
    private String paymentStatus;

    // Constructeurs
    public HotelReservationDTO() {}

    public HotelReservationDTO(Long id, Long userId, String userEmail, Long hotelId, String hotelName,
                               String hotelCity, LocalDate startDate, LocalDate endDate,
                               Integer numberOfRooms, Integer numberOfGuests, BigDecimal totalPrice, String paymentStatus) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.hotelId = hotelId;
        this.hotelName = hotelName;
        this.hotelCity = hotelCity;
        this.startDate = startDate;
        this.endDate = endDate;
        this.numberOfRooms = numberOfRooms;
        this.numberOfGuests = numberOfGuests;
        this.totalPrice = totalPrice;
        this.paymentStatus = paymentStatus;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public String getHotelCity() {
        return hotelCity;
    }

    public void setHotelCity(String hotelCity) {
        this.hotelCity = hotelCity;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getNumberOfRooms() {
        return numberOfRooms;
    }

    public void setNumberOfRooms(Integer numberOfRooms) {
        this.numberOfRooms = numberOfRooms;
    }

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    @Override
    public String toString() {
        return "HotelReservationDTO{" +
                "id=" + id +
                ", userId=" + userId +
                ", userEmail='" + userEmail + '\'' +
                ", hotelId=" + hotelId +
                ", hotelName='" + hotelName + '\'' +
                ", hotelCity='" + hotelCity + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", numberOfRooms=" + numberOfRooms +
                ", numberOfGuests=" + numberOfGuests +
                ", totalPrice=" + totalPrice +
                ", paymentStatus='" + paymentStatus + '\'' +
                '}';
    }
}
