package com.worldcup2030.backend.service;

import com.worldcup2030.backend.dto.TransportDTO;
import com.worldcup2030.backend.model.Transport;
import com.worldcup2030.backend.model.TransportType;
import com.worldcup2030.backend.repository.TransportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransportService {

    @Autowired
    private TransportRepository transportRepository;

    public TransportDTO addTransport(TransportDTO dto) {
        Transport entity = convertToEntity(dto);
        Transport saved = transportRepository.save(entity);
        return convertToDTO(saved);
    }

    public List<TransportDTO> getAllTransports() {
        return transportRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TransportDTO getTransportById(Long id) {
        Transport transport = transportRepository.findById(id).orElseThrow();
        return convertToDTO(transport);
    }

    public void deleteTransport(Long id) {
        transportRepository.deleteById(id);
    }

    public TransportDTO updateTransport(Long id, TransportDTO dto) {
        Transport updated = convertToEntity(dto);
        updated.setId(id);
        Transport saved = transportRepository.save(updated);
        return convertToDTO(saved);
    }

    private Transport convertToEntity(TransportDTO dto) {
        Transport transport = new Transport();

        // Conversion correcte pour le format ISO avec "Z"
        LocalDateTime departureTime = LocalDateTime.ofInstant(
                Instant.parse(dto.getDepartureTime()), ZoneId.systemDefault());
        LocalDateTime arrivalTime = LocalDateTime.ofInstant(
                Instant.parse(dto.getArrivalTime()), ZoneId.systemDefault());

        transport.setType(TransportType.valueOf(dto.getType().toUpperCase()));
        transport.setDepartureCity(dto.getDepartureCity());
        transport.setArrivalCity(dto.getArrivalCity());
        transport.setDepartureTime(departureTime);
        transport.setArrivalTime(arrivalTime);
        transport.setCapacite(dto.getCapacite());
        transport.setPlace(dto.getCapacite());
        transport.setPrice(dto.getPrice());
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
        dto.setCapacite(transport.getCapacite());
        dto.setPlace(transport.getPlace());
        dto.setPrice(transport.getPrice());
        dto.setCompagnie(transport.getCompagnie());

        return dto;
    }
}
