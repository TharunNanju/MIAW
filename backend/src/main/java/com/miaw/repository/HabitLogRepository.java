package com.miaw.repository;

import com.miaw.model.Habit;
import com.miaw.model.HabitLog;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {
    Optional<HabitLog> findByHabitAndLogDate(Habit habit, LocalDate logDate);

    List<HabitLog> findAllByHabitOrderByLogDateDesc(Habit habit);

    long countByHabitAndCompletedTrueAndLogDateBetween(Habit habit, LocalDate startDate, LocalDate endDate);
}
