package com.miaw.dao;

import com.miaw.model.User;
import java.util.List;
import java.util.Optional;

public interface UserDAO {
    User save(User user);

    Optional<User> findByEmail(String email);

    Optional<User> findById(Long id);

    List<User> findAll();
}
