package com.worldcup2030.backend.repository;

import com.worldcup2030.backend.model.HotelReservation;
import com.worldcup2030.backend.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HotelReservationRepository extends JpaRepository<HotelReservation, Long> {

    List<HotelReservation> findByUserIdOrderByStartDateDesc(Long userId);

    List<HotelReservation> findAllByOrderByStartDateDesc();

    List<HotelReservation> findByPaymentStatus(PaymentStatus paymentStatus);

    List<HotelReservation> findByHotelIdOrderByStartDateDesc(Long hotelId);

    @Query("SELECT hr FROM HotelReservation hr WHERE hr.user.id = :userId AND hr.paymentStatus != 'CANCELLED'")
    List<HotelReservation> findActiveReservationsByUserId(@Param("userId") Long userId);

    @Query("SELECT hr FROM HotelReservation hr WHERE hr.startDate >= :startDate AND hr.endDate <= :endDate")
    List<HotelReservation> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(hr) FROM HotelReservation hr WHERE hr.hotel.id = :hotelId AND hr.startDate <= :endDate AND hr.endDate >= :startDate AND hr.paymentStatus != 'CANCELLED'")
    Long countOverlappingReservations(@Param("hotelId") Long hotelId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}