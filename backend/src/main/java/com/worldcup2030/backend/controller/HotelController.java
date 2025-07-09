package com.worldcup2030.backend.controller;

import com.worldcup2030.backend.dto.HotelDTO;
import com.worldcup2030.backend.model.Hotel;
import com.worldcup2030.backend.service.HotelService;
import com.worldcup2030.backend.service.FileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
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
    private final FileService fileService;
    private final ObjectMapper objectMapper;

    public HotelController(HotelService hotelService, FileService fileService, ObjectMapper objectMapper) {
        this.hotelService = hotelService;
        this.fileService = fileService;
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

            // Gérer le fichier photo
            if (photo != null && !photo.isEmpty()) {
                String filename = fileService.saveFile(photo, name);
                dto.setPhotoPath(filename);
                System.out.println("Photo sauvegardée : " + filename);
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
    public ResponseEntity<List<HotelDTO>> getAllHotels() {
        try {
            List<HotelDTO> hotels = hotelService.getAllHotels();
            return ResponseEntity.ok(hotels);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des hôtels : " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDTO> getHotelById(@PathVariable Long id) {
        try {
            HotelDTO hotel = hotelService.getHotelById(id);
            return ResponseEntity.ok(hotel);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération de l'hôtel : " + e.getMessage());
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Resource file = fileService.loadFile(filename);

            // Déterminer le type de contenu
            String contentType = "image/jpeg";
            if (filename.toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            } else if (filename.toLowerCase().endsWith(".gif")) {
                contentType = "image/gif";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(file);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération de l'image : " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        try {
            // Récupérer l'hôtel pour supprimer sa photo
            Hotel hotel = hotelService.findById(id);
            if (hotel != null && hotel.getPhotoPath() != null) {
                fileService.deleteFile(hotel.getPhotoPath());
            }

            hotelService.deleteHotel(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Erreur lors de la suppression de l'hôtel : " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody HotelDTO dto) {
        try {
            Hotel hotel = hotelService.updateHotel(id, dto);
            return ResponseEntity.ok(hotel);
        } catch (Exception e) {
            System.err.println("Erreur lors de la mise à jour de l'hôtel : " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}