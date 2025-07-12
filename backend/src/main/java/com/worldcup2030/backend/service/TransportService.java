package com.worldcup2030.backend.service;

import com.worldcup2030.backend.dto.TransportDTO;
import com.worldcup2030.backend.model.Transport;
import com.worldcup2030.backend.model.TransportType;
import com.worldcup2030.backend.repository.TransportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransportService {

    @Autowired
    private TransportRepository transportRepository;

    public Transport addTransport(TransportDTO dto) {
        Transport transport = convertToEntity(dto);
        return transportRepository.save(transport);
    }

    public List<TransportDTO> getAllTransports() {
        List<Transport> transports = transportRepository.findAll();
        return transports.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public TransportDTO getTransportById(Long id) {
        Optional<Transport> transport = transportRepository.findById(id);
        return transport.map(this::convertToDTO).orElseThrow();
    }

    public void deleteTransport(Long id) {
        transportRepository.deleteById(id);
    }

    public Transport findById(Long id) {
        return transportRepository.findById(id).orElse(null);
    }

    public Transport updateTransport(Long id, TransportDTO dto) {
        Transport existing = transportRepository.findById(id).orElseThrow();
        Transport updated = convertToEntity(dto);
        updated.setId(id); // conserve l'ID existant
        return transportRepository.save(updated);
    }

    // ===========================
    // === Conversion Helpers ===
    // ===========================

    private Transport convertToEntity(TransportDTO dto) {
        Transport transport = new Transport();

        transport.setType(TransportType.valueOf(dto.getType().toUpperCase()));
        transport.setDepartureCity(dto.getDepartureCity());
        transport.setArrivalCity(dto.getArrivalCity());

        transport.setDepartureTime(LocalDateTime.parse(dto.getDepartureTime()));
        transport.setArrivalTime(LocalDateTime.parse(dto.getArrivalTime()));

        transport.setCapacite(new BigDecimal(dto.getCapacite()));
        transport.setPlace(new BigDecimal(dto.getPlace()));
        transport.setPrice(new BigDecimal(dto.getPrice()));

        transport.setCompagnie(dto.getCompagnie());

        

        return transport;
    }

    private TransportDTO convertToDTO(Transport transport) {
        TransportDTO dto = new TransportDTO();

        dto.setId(transport.getId());
        dto.setType(transport.getType().name());
        dto.setDepartureCity(transport.getDepartureCity());
        dto.setArrivalCity(transport.getArrivalCity());
        dto.setDepartureTime(transport.getDepartureTime().toString());
        dto.setArrivalTime(transport.getArrivalTime().toString());
        dto.setCapacite(transport.getCapacite().toPlainString());
        dto.setPlace(transport.getPlace().toPlainString());
        dto.setPrice(transport.getPrice().toPlainString());
        dto.setCompagnie(transport.getCompagnie());
 

        return dto;
    }
}
