package com.worldcup2030.backend.service;

import com.worldcup2030.backend.dto.HotelDTO;
import com.worldcup2030.backend.model.Hotel;
import com.worldcup2030.backend.repository.HotelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public Hotel addHotel(HotelDTO dto) {
        System.out.println("Service - Ajout d'un hôtel : " + dto);

        Hotel hotel = new Hotel();
        hotel.setName(dto.getName());
        hotel.setCity(dto.getCity());
        hotel.setStars(dto.getStars());
        hotel.setAddress(dto.getAddress());
        hotel.setDescription(dto.getDescription());
        hotel.setServices(dto.getServices());
        hotel.setPhotoPath(dto.getPhotoPath());

        Hotel savedHotel = hotelRepository.save(hotel);
        System.out.println("Service - Hôtel sauvegardé : " + savedHotel);
        return savedHotel;
    }

    public List<HotelDTO> getAllHotels() {
        List<Hotel> hotels = hotelRepository.findAll();
        return hotels.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public HotelDTO getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hôtel non trouvé avec l'ID : " + id));
        return convertToDTO(hotel);
    }

    public Hotel findById(Long id) {
        return hotelRepository.findById(id).orElse(null);
    }

    public void deleteHotel(Long id) {
        hotelRepository.deleteById(id);
    }

    public Hotel updateHotel(Long id, HotelDTO dto) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hôtel non trouvé avec l'ID : " + id));

        hotel.setName(dto.getName());
        hotel.setCity(dto.getCity());
        hotel.setStars(dto.getStars());
        hotel.setAddress(dto.getAddress());
        hotel.setDescription(dto.getDescription());
        hotel.setServices(dto.getServices());

        // Mettre à jour le chemin de la photo seulement si fourni
        if (dto.getPhotoPath() != null) {
            hotel.setPhotoPath(dto.getPhotoPath());
        }

        return hotelRepository.save(hotel);
    }

    // Méthode utilitaire pour convertir Hotel en HotelDTO
    private HotelDTO convertToDTO(Hotel hotel) {
        return new HotelDTO(
                hotel.getId(),
                hotel.getName(),
                hotel.getCity(),
                hotel.getStars(),
                hotel.getAddress(),
                hotel.getDescription(),
                hotel.getServices(),
                hotel.getPhotoPath()
        );
    }
}