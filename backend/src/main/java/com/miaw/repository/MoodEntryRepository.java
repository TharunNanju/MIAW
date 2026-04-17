package com.miaw.repository;

import com.miaw.model.MoodEntry;
import com.miaw.model.User;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {
    Optional<MoodEntry> findByUserAndEntryDate(User user, LocalDate entryDate);

    List<MoodEntry> findAllByUserAndEntryDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
