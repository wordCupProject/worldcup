package com.worldcup2030.backend.controller;

import com.worldcup2030.backend.dto.HotelDTO;
import com.worldcup2030.backend.model.Hotel;
import com.worldcup2030.backend.service.HotelService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "http://localhost:4200")
public class HotelController {

    private final HotelService hotelService;
    private final ObjectMapper objectMapper;

    public HotelController(HotelService hotelService, ObjectMapper objectMapper) {
        this.hotelService = hotelService;
        this.objectMapper = objectMapper;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Hotel> createHotelJson(@RequestBody HotelDTO dto) {
        System.out.println("Requête JSON reçue : " + dto);

        try {
            Hotel hotel = hotelService.addHotel(dto);
            return ResponseEntity.ok(hotel);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'ajout de l'hôtel : " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Hotel> createHotelMultipart(
            @RequestParam("name") String name,
            @RequestParam("city") String city,
            @RequestParam("stars") int stars,
            @RequestParam("address") String address,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("services") String servicesJson,
            @RequestParam(value = "photo", required = false) MultipartFile photo) {

        System.out.println("Requête multipart reçue - name: " + name + ", city: " + city);

        try {
            // Convertir le JSON des services en liste
            List<String> services = Arrays.asList(objectMapper.readValue(servicesJson, String[].class));

            HotelDTO dto = new HotelDTO();
            dto.setName(name);
            dto.setCity(city);
            dto.setStars(stars);
            dto.setAddress(address);
            dto.setDescription(description);
            dto.setServices(services);

            // TODO: Gérer le fichier photo si nécessaire
            if (photo != null && !photo.isEmpty()) {
                System.out.println("Photo reçue : " + photo.getOriginalFilename());
                // Logique pour sauvegarder la photo
            }

            Hotel hotel = hotelService.addHotel(dto);
            return ResponseEntity.ok(hotel);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'ajout de l'hôtel : " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        try {
            List<Hotel> hotels = hotelService.getAllHotels();
            return ResponseEntity.ok(hotels);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des hôtels : " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}