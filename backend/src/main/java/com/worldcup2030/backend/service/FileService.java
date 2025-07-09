package com.worldcup2030.backend.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileService {

    private final String uploadDir = "uploads/hotels/";

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Impossible de créer le dossier d'upload", e);
        }
    }

    public String saveFile(MultipartFile file, String hotelName) throws IOException {
        if (file.isEmpty()) {
            return null;
        }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = hotelName.replaceAll("[^a-zA-Z0-9]", "_") +
                "_" + UUID.randomUUID().toString().substring(0, 8) +
                extension;

        Path filePath = Paths.get(uploadDir + filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filename;
    }

    public Resource loadFile(String filename) {
        try {
            Path file = Paths.get(uploadDir).resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Fichier non trouvé : " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Fichier non trouvé : " + filename, e);
        }
    }

    public boolean deleteFile(String filename) {
        try {
            Path file = Paths.get(uploadDir).resolve(filename);
            return Files.deleteIfExists(file);
        } catch (IOException e) {
            return false;
        }
    }
}