package com.worldcup2030.backend.repository;

import com.worldcup2030.backend.model.Transport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransportRepository extends JpaRepository<Transport, Long> {
}
