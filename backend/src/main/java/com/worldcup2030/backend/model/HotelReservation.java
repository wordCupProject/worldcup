package com.worldcup2030.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "hotel_reservations")
public class HotelReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "number_of_rooms", nullable = false)
    private Integer numberOfRooms;

    @Column(name = "number_of_guests", nullable = false)
    private Integer numberOfGuests;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @Column(name = "created_at")
    private LocalDate createdAt;

    // Constructeurs
    public HotelReservation() {
        this.createdAt = LocalDate.now();
    }

    public HotelReservation(LocalDate startDate, LocalDate endDate, Integer numberOfRooms,
                            Integer numberOfGuests, BigDecimal totalPrice, PaymentStatus paymentStatus,
                            User user, Hotel hotel) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.numberOfRooms = numberOfRooms;
        this.numberOfGuests = numberOfGuests;
        this.totalPrice = totalPrice;
        this.paymentStatus = paymentStatus;
        this.user = user;
        this.hotel = hotel;
        this.createdAt = LocalDate.now();
    }
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }


    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Hotel getHotel() {
        return hotel;
    }

    public void setHotel(Hotel hotel) {
        this.hotel = hotel;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "HotelReservation{" +
                "id=" + id +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", numberOfRooms=" + numberOfRooms +
                ", numberOfGuests=" + numberOfGuests +
                ", totalPrice=" + totalPrice +
                ", paymentStatus=" + paymentStatus +
                ", createdAt=" + createdAt +
                '}';
    }
}