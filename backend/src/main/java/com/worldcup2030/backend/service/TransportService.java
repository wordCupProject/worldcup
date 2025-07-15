package com.worldcup2030.backend.service;

import com.worldcup2030.backend.dto.TransportDTO;
import com.worldcup2030.backend.model.Transport;
import com.worldcup2030.backend.model.TransportType;
import com.worldcup2030.backend.repository.TransportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
       // Transport existing = transportRepository.findById(id).orElseThrow();
        Transport updated = convertToEntity(dto);
        updated.setId(id);
        Transport saved = transportRepository.save(updated);
        return convertToDTO(saved);
    }

    private Transport convertToEntity(TransportDTO dto) {
        Transport transport = new Transport();

        transport.setType(TransportType.valueOf(dto.getType().toUpperCase()));
        transport.setDepartureCity(dto.getDepartureCity());
        transport.setArrivalCity(dto.getArrivalCity());

        transport.setDepartureTime(LocalDateTime.parse(dto.getDepartureTime()));
        transport.setArrivalTime(LocalDateTime.parse(dto.getArrivalTime()));

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
        dto.setPlace(transport.getCapacite());
        dto.setPrice(transport.getPrice());

        dto.setCompagnie(transport.getCompagnie());

        return dto;
    }
}
