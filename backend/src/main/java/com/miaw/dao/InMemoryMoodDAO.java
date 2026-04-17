package com.miaw.dao;

import com.miaw.model.MoodEntry;
import com.miaw.model.User;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

public class InMemoryMoodDAO implements MoodDAO {
    private final List<MoodEntry> entries = new CopyOnWriteArrayList<>();

    @Override
    public MoodEntry save(MoodEntry entry) {
        entries.removeIf(existing -> existing.getId() != null && existing.getId().equals(entry.getId()));
        if (entry.getId() == null) {
            entry.setId((long) (entries.size() + 1));
        }
        entries.add(entry);
        return entry;
    }

    @Override
    public Optional<MoodEntry> findByUserAndDate(User user, LocalDate date) {
        return entries.stream()
            .filter(entry -> entry.getUser().getId().equals(user.getId()))
            .filter(entry -> entry.getEntryDate().equals(date))
            .findFirst();
    }

    @Override
    public List<MoodEntry> findAllByUser(User user) {
        List<MoodEntry> result = new ArrayList<>();
        entries.stream()
            .filter(entry -> entry.getUser().getId().equals(user.getId()))
            .forEach(result::add);
        return result;
    }
}
