package com.miaw.dao;

import com.miaw.model.MoodEntry;
import com.miaw.model.User;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MoodDAO {
    MoodEntry save(MoodEntry entry);

    Optional<MoodEntry> findByUserAndDate(User user, LocalDate date);

    List<MoodEntry> findAllByUser(User user);
}
