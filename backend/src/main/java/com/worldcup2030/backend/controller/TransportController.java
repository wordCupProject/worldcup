package com.worldcup2030.backend.controller;

import com.worldcup2030.backend.dto.TransportDTO;
import com.worldcup2030.backend.service.TransportService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transports")
@CrossOrigin(origins = "http://localhost:4200")
public class TransportController {

    private final TransportService transportService;

    public TransportController(TransportService transportService) {
        this.transportService = transportService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TransportDTO> createTransportJson(@RequestBody TransportDTO dto) {
        try {
            TransportDTO saved = transportService.addTransport(dto);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<TransportDTO>> getAllTransports() {
        try {
            return ResponseEntity.ok(transportService.getAllTransports());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransportDTO> getTransportById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(transportService.getTransportById(id));
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransport(@PathVariable Long id) {
        try {
            transportService.deleteTransport(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransportDTO> updateTransport(@PathVariable Long id, @RequestBody TransportDTO dto) {
        try {
            TransportDTO updated = transportService.updateTransport(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
