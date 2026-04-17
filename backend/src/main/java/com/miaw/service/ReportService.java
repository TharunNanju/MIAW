package com.miaw.service;

import com.miaw.dto.HabitConsistencyResponse;
import com.miaw.dto.MoodSummaryResponse;
import com.miaw.model.Habit;
import com.miaw.model.MoodEntry;
import com.miaw.model.MoodLevel;
import com.miaw.model.User;
import com.miaw.repository.HabitRepository;
import com.miaw.repository.MoodEntryRepository;
import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ReportService {
    private final MoodEntryRepository moodEntryRepository;
    private final HabitRepository habitRepository;
    private final HabitService habitService;

    public ReportService(MoodEntryRepository moodEntryRepository, HabitRepository habitRepository, HabitService habitService) {
        this.moodEntryRepository = moodEntryRepository;
        this.habitRepository = habitRepository;
        this.habitService = habitService;
    }

    public MoodSummaryResponse getMoodSummary(User user, LocalDate startDate, LocalDate endDate) {
        List<MoodEntry> entries = moodEntryRepository.findAllByUserAndEntryDateBetween(user, startDate, endDate);
        Map<MoodLevel, Long> counts = new EnumMap<>(MoodLevel.class);
        for (MoodLevel level : MoodLevel.values()) {
            counts.put(level, 0L);
        }
        entries.forEach(entry -> counts.merge(entry.getMoodLevel(), 1L, Long::sum));
        return new MoodSummaryResponse(startDate, endDate, counts);
    }

    public List<HabitConsistencyResponse> getHabitConsistencyReport(User user, int days) {
        List<Habit> habits = habitRepository.findAllByUser(user);
        return habits.stream()
            .map(habit -> habitService.getConsistency(user, habit.getId(), days))
            .collect(Collectors.toList());
    }
}
