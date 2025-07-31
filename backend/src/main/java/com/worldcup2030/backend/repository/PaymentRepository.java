package com.worldcup2030.backend.repository;

import com.worldcup2030.backend.model.Payment;
import com.worldcup2030.backend.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * Trouve un paiement par ID de réservation
     */
    Optional<Payment> findByReservationId(Long reservationId);

    /**
     * Trouve tous les paiements d'un utilisateur via ses réservations
     */
    @Query("SELECT p FROM Payment p JOIN p.reservation r WHERE r.user.id = :userId ORDER BY p.createdAt DESC")
    List<Payment> findByUserId(@Param("userId") Long userId);

    /**
     * Trouve les paiements par statut
     */
    List<Payment> findByPaymentStatusOrderByCreatedAtDesc(PaymentStatus paymentStatus);

    /**
     * Trouve les paiements en attente depuis plus de X minutes
     */
    @Query("SELECT p FROM Payment p WHERE p.paymentStatus = 'PENDING' AND p.createdAt < :cutoffTime")
    List<Payment> findPendingPaymentsOlderThan(@Param("cutoffTime") LocalDateTime cutoffTime);

    /**
     * Trouve un paiement par ID de transaction
     */
    Optional<Payment> findByTransactionId(String transactionId);

    /**
     * Compte les paiements réussis d'un utilisateur
     */
    @Query("SELECT COUNT(p) FROM Payment p JOIN p.reservation r WHERE r.user.id = :userId AND p.paymentStatus = 'CONFIRMED'")
    Long countSuccessfulPaymentsByUserId(@Param("userId") Long userId);

    /**
     * Calcule le total des paiements confirmés d'un utilisateur
     */
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p JOIN p.reservation r WHERE r.user.id = :userId AND p.paymentStatus = 'CONFIRMED'")
    BigDecimal getTotalConfirmedPaymentsByUserId(@Param("userId") Long userId);

    /**
     * Trouve les paiements par période
     */
    @Query("SELECT p FROM Payment p WHERE p.createdAt BETWEEN :startDate AND :endDate ORDER BY p.createdAt DESC")
    List<Payment> findPaymentsBetweenDates(@Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);

    /**
     * Vérifie si une réservation a déjà un paiement confirmé
     */
    @Query("SELECT COUNT(p) > 0 FROM Payment p WHERE p.reservation.id = :reservationId AND p.paymentStatus = 'CONFIRMED'")
    boolean hasConfirmedPayment(@Param("reservationId") Long reservationId);

    /**
     * Trouve les paiements échoués récents pour détection de fraude
     */
    @Query("SELECT p FROM Payment p JOIN p.reservation r WHERE r.user.id = :userId AND p.paymentStatus = 'FAILED' AND p.createdAt > :since")
    List<Payment> findRecentFailedPaymentsByUserId(@Param("userId") Long userId,
                                                   @Param("since") LocalDateTime since);
}