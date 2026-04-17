package com.miaw.service;

import com.miaw.dto.MoodEntryRequest;
import com.miaw.model.MoodEntry;
import com.miaw.model.User;
import com.miaw.repository.MoodEntryRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MoodService {
    private final MoodEntryRepository moodEntryRepository;

    public MoodService(MoodEntryRepository moodEntryRepository) {
        this.moodEntryRepository = moodEntryRepository;
    }

    @Transactional
    public MoodEntry upsertEntry(User user, MoodEntryRequest request) {
        LocalDate entryDate = request.getEntryDate() != null ? request.getEntryDate() : LocalDate.now();
        MoodEntry entry = moodEntryRepository.findByUserAndEntryDate(user, entryDate)
            .orElseGet(() -> {
                MoodEntry moodEntry = new MoodEntry();
                moodEntry.setUser(user);
                moodEntry.setEntryDate(entryDate);
                return moodEntry;
            });

        entry.setMoodLevel(request.getMoodLevel());
        entry.setNote(request.getNote());
        return moodEntryRepository.save(entry);
    }

    @Transactional
    public MoodEntry updateEntry(User user, Long entryId, MoodEntryRequest request) {
        MoodEntry entry = moodEntryRepository.findById(entryId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mood entry not found"));
        if (!entry.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }
        if (request.getEntryDate() != null) {
            entry.setEntryDate(request.getEntryDate());
        }
        entry.setMoodLevel(request.getMoodLevel());
        entry.setNote(request.getNote());
        return moodEntryRepository.save(entry);
    }

    public List<MoodEntry> listEntries(User user, LocalDate startDate, LocalDate endDate) {
        LocalDate end = endDate != null ? endDate : LocalDate.now();
        LocalDate start = startDate != null ? startDate : end.minusDays(30);
        return moodEntryRepository.findAllByUserAndEntryDateBetween(user, start, end);
    }

    @Transactional
    public void deleteEntry(User user, Long entryId) {
        MoodEntry entry = moodEntryRepository.findById(entryId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mood entry not found"));
        if (!entry.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }
        moodEntryRepository.delete(entry);
    }
}
