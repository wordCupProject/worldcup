package com.worldcup2030.backend.repository;

import com.worldcup2030.backend.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
}
