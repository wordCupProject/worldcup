package com.worldcup2030.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.worldcup2030.backend.dto.TransportDTO;
import com.worldcup2030.backend.model.Transport;
import com.worldcup2030.backend.service.FileService;
import com.worldcup2030.backend.service.TransportService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/transports")
@CrossOrigin(origins = "http://localhost:4200")
public class TransportController {

    private final TransportService transportService;
    private final FileService fileService;
    private final ObjectMapper objectMapper;

    public TransportController(TransportService transportService, FileService fileService, ObjectMapper objectMapper) {
        this.transportService = transportService;
        this.fileService = fileService;
        this.objectMapper = objectMapper;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Transport> createTransportJson(@RequestBody TransportDTO dto) {
        try {
            Transport transport = transportService.addTransport(dto);
            return ResponseEntity.ok(transport);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'ajout du transport : " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Transport> createTransportMultipart(
            @RequestParam("type") String type,
            @RequestParam("departureCity") String departureCity,
            @RequestParam("arrivalCity") String arrivalCity,
            @RequestParam("departureTime") String departureTime,
            @RequestParam("arrivalTime") String arrivalTime,
            @RequestParam("capacite") String capacite,
            @RequestParam("place") String place,
            @RequestParam("price") String price,
            @RequestParam("compagnie") String compagnie,
            @RequestParam("date") String date
    ) {
        try {
            TransportDTO dto = new TransportDTO();
            dto.setType(type);
            dto.setDepartureCity(departureCity);
            dto.setArrivalCity(arrivalCity);
            dto.setDepartureTime(departureTime);
            dto.setArrivalTime(arrivalTime);
            dto.setCapacite(capacite);
            dto.setPlace(place);
            dto.setPrice(price);
            dto.setCompagnie(compagnie);
          

         

            Transport transport = transportService.addTransport(dto);
            return ResponseEntity.ok(transport);

        } catch (Exception e) {
            System.err.println("Erreur lors de l'ajout multipart du transport : " + e.getMessage());
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
            Transport transport = transportService.findById(id);
         
            transportService.deleteTransport(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transport> updateTransport(@PathVariable Long id, @RequestBody TransportDTO dto) {
        try {
            Transport updated = transportService.updateTransport(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
