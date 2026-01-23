package com.miaw.service;

import com.miaw.model.User;
import com.miaw.repository.HabitRepository;
import com.miaw.repository.JournalEntryRepository;
import com.miaw.repository.MoodEntryRepository;
import com.miaw.repository.UserRepository;
import com.miaw.repository.WellnessAssessmentRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final MoodEntryRepository moodEntryRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final HabitRepository habitRepository;
    private final WellnessAssessmentRepository wellnessAssessmentRepository;

    public AdminService(UserRepository userRepository,
                        MoodEntryRepository moodEntryRepository,
                        JournalEntryRepository journalEntryRepository,
                        HabitRepository habitRepository,
                        WellnessAssessmentRepository wellnessAssessmentRepository) {
        this.userRepository = userRepository;
        this.moodEntryRepository = moodEntryRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.habitRepository = habitRepository;
        this.wellnessAssessmentRepository = wellnessAssessmentRepository;
    }

    public List<User> listUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        userRepository.delete(user);
    }

    public long totalUsers() {
        return userRepository.count();
    }

    public long totalMoodEntries() {
        return moodEntryRepository.count();
    }

    public long totalJournalEntries() {
        return journalEntryRepository.count();
    }

    public long totalHabits() {
        return habitRepository.count();
    }

    public long totalAssessments() {
        return wellnessAssessmentRepository.count();
    }
}
