// ReservationRequestDTO.java
package com.worldcup2030.backend.dto;

public class ReservationRequestDTO {
    private Long userId;
    private Long transportId;

    public ReservationRequestDTO() {}

    public ReservationRequestDTO(Long userId, Long transportId) {
        this.userId = userId;
        this.transportId = transportId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getTransportId() {
        return transportId;
    }

    public void setTransportId(Long transportId) {
        this.transportId = transportId;
    }
}