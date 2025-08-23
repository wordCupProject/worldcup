package com.worldcup2030.backend.repository;

import com.worldcup2030.backend.model.TransportReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportReservationRepository extends JpaRepository<TransportReservation, Long> {

    List<TransportReservation> findByUserId(Long userId);

    List<TransportReservation> findByTransportId(Long transportId);

    @Query("SELECT COUNT(r) FROM TransportReservation r WHERE r.transport.id = :transportId")
    long countByTransportId(@Param("transportId") Long transportId);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM TransportReservation r WHERE r.user.id = :userId AND r.transport.id = :transportId")
    boolean existsByUserIdAndTransportId(@Param("userId") Long userId, @Param("transportId") Long transportId);

    void deleteByUserId(Long userId);

    void deleteByTransportId(Long transportId);
}