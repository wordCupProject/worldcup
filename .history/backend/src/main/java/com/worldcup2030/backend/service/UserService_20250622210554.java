package com.worldcup2030.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.worldcup2030.backend.dto.RegisterRequest;
import com.worldcup2030.backend.model.User;
import com.worldcup2030.backend.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;


@Autowired
private PasswordEncoder passwordEncoder;

@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}




    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email déjà utilisé.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole("NormalUser");

        user.setPassword(request.getPassword());

        return userRepository.save(user);
    }
}

