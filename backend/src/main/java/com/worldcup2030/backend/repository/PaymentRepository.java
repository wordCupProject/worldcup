package com.worldcup2030.backend.repository;

import com.worldcup2030.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Trouver un paiement par ID de réservation
    @Query("SELECT p FROM Payment p WHERE p.reservation.id = :reservationId")
    Optional<Payment> findByReservationId(@Param("reservationId") Long reservationId);

    // Vérifier si un paiement existe pour une réservation
    @Query("SELECT COUNT(p) > 0 FROM Payment p WHERE p.reservation.id = :reservationId")
    boolean existsByReservationId(@Param("reservationId") Long reservationId);

    // Trouver tous les paiements d'un utilisateur
    @Query("SELECT p FROM Payment p WHERE p.reservation.user.id = :userId")
    List<Payment> findByUserId(@Param("userId") Long userId);

    // Trouver les paiements par statut
    @Query("SELECT p FROM Payment p WHERE p.paymentStatus = :status")
    List<Payment> findByPaymentStatus(@Param("status") com.worldcup2030.backend.model.PaymentStatus status);

    // Trouver un paiement par transaction ID
    Optional<Payment> findByTransactionId(String transactionId);

    // Trouver les paiements par méthode de paiement
    @Query("SELECT p FROM Payment p WHERE p.paymentMethod = :method")
    List<Payment> findByPaymentMethod(@Param("method") com.worldcup2030.backend.model.PaymentMethod method);

    // Trouver les paiements échoués
    @Query("SELECT p FROM Payment p WHERE p.paymentStatus = 'FAILED'")
    List<Payment> findFailedPayments();

    // Trouver les paiements confirmés
    @Query("SELECT p FROM Payment p WHERE p.paymentStatus = 'CONFIRMED'")
    List<Payment> findConfirmedPayments();
}