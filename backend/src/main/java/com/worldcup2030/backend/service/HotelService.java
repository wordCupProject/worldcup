package com.worldcup2030.backend.service;

import com.worldcup2030.backend.dto.HotelDTO;
import com.worldcup2030.backend.model.Hotel;
import com.worldcup2030.backend.repository.HotelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

        Hotel savedHotel = hotelRepository.save(hotel);
        System.out.println("Service - Hôtel sauvegardé : " + savedHotel);

        return savedHotel;
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
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

        return hotelRepository.save(hotel);
    }
}