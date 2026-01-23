package com.miaw.service;

import com.miaw.dto.HabitConsistencyResponse;
import com.miaw.dto.HabitLogRequest;
import com.miaw.dto.HabitRequest;
import com.miaw.model.Habit;
import com.miaw.model.HabitLog;
import com.miaw.model.User;
import com.miaw.repository.HabitLogRepository;
import com.miaw.repository.HabitRepository;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class HabitService {
    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;

    public HabitService(HabitRepository habitRepository, HabitLogRepository habitLogRepository) {
        this.habitRepository = habitRepository;
        this.habitLogRepository = habitLogRepository;
    }

    public Habit createHabit(User user, HabitRequest request) {
        Habit habit = new Habit();
        habit.setUser(user);
        habit.setName(request.getName());
        habit.setDescription(request.getDescription());
        return habitRepository.save(habit);
    }

    public Habit updateHabit(User user, Long habitId, HabitRequest request) {
        Habit habit = getHabitForUser(user, habitId);
        habit.setName(request.getName());
        habit.setDescription(request.getDescription());
        return habitRepository.save(habit);
    }

    public List<Habit> listHabits(User user) {
        return habitRepository.findAllByUser(user);
    }

    public HabitLog logHabit(User user, Long habitId, HabitLogRequest request) {
        Habit habit = getHabitForUser(user, habitId);
        LocalDate logDate = request.getLogDate() != null ? request.getLogDate() : LocalDate.now();
        HabitLog log = habitLogRepository.findByHabitAndLogDate(habit, logDate)
            .orElseGet(() -> {
                HabitLog newLog = new HabitLog();
                newLog.setHabit(habit);
                newLog.setLogDate(logDate);
                return newLog;
            });
        log.setCompleted(request.isCompleted());
        return habitLogRepository.save(log);
    }

    public List<HabitLog> listLogs(User user, Long habitId) {
        Habit habit = getHabitForUser(user, habitId);
        return habitLogRepository.findAllByHabitOrderByLogDateDesc(habit);
    }

    public HabitConsistencyResponse getConsistency(User user, Long habitId, int days) {
        Habit habit = getHabitForUser(user, habitId);
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);
        long completedCount = habitLogRepository.countByHabitAndCompletedTrueAndLogDateBetween(habit, startDate, endDate);
        double rate = days == 0 ? 0 : (double) completedCount / days;
        List<HabitLog> logs = habitLogRepository.findAllByHabitOrderByLogDateDesc(habit);
        int currentStreak = calculateCurrentStreak(logs);
        int longestStreak = calculateLongestStreak(logs);
        return new HabitConsistencyResponse(habit.getId(), habit.getName(), rate, currentStreak, longestStreak);
    }

    private Habit getHabitForUser(User user, Long habitId) {
        Habit habit = habitRepository.findById(habitId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Habit not found"));
        if (!habit.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }
        return habit;
    }

    private int calculateCurrentStreak(List<HabitLog> logs) {
        logs.sort(Comparator.comparing(HabitLog::getLogDate).reversed());
        LocalDate currentDate = LocalDate.now();
        int streak = 0;
        for (HabitLog log : logs) {
            if (!log.isCompleted()) {
                continue;
            }
            if (!log.getLogDate().equals(currentDate)) {
                if (log.getLogDate().isBefore(currentDate)) {
                    break;
                }
            }
            if (log.getLogDate().equals(currentDate)) {
                streak++;
                currentDate = currentDate.minusDays(1);
            }
        }
        return streak;
    }

    private int calculateLongestStreak(List<HabitLog> logs) {
        logs.sort(Comparator.comparing(HabitLog::getLogDate));
        int longest = 0;
        int current = 0;
        LocalDate previous = null;
        for (HabitLog log : logs) {
            if (!log.isCompleted()) {
                continue;
            }
            if (previous == null || log.getLogDate().equals(previous.plusDays(1))) {
                current++;
            } else {
                current = 1;
            }
            longest = Math.max(longest, current);
            previous = log.getLogDate();
        }
        return longest;
    }
}
