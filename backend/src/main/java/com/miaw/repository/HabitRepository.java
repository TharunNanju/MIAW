package com.miaw.repository;

import com.miaw.model.Habit;
import com.miaw.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findAllByUser(User user);
}
