package com.miaw.service;

import com.miaw.dto.JournalEntryRequest;
import com.miaw.model.JournalEntry;
import com.miaw.model.User;
import com.miaw.repository.JournalEntryRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class JournalService {
    private final JournalEntryRepository journalEntryRepository;

    public JournalService(JournalEntryRepository journalEntryRepository) {
        this.journalEntryRepository = journalEntryRepository;
    }

    public JournalEntry createEntry(User user, JournalEntryRequest request) {
        JournalEntry entry = new JournalEntry();
        entry.setUser(user);
        entry.setTitle(request.getTitle());
        entry.setContent(request.getContent());
        entry.setEntryDate(request.getEntryDate() != null ? request.getEntryDate() : LocalDate.now());
        return journalEntryRepository.save(entry);
    }

    public List<JournalEntry> listEntries(User user) {
        return journalEntryRepository.findAllByUserOrderByEntryDateDesc(user);
    }

    public JournalEntry updateEntry(User user, Long entryId, JournalEntryRequest request) {
        JournalEntry entry = journalEntryRepository.findById(entryId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Journal entry not found"));
        if (!entry.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }
        entry.setTitle(request.getTitle());
        entry.setContent(request.getContent());
        if (request.getEntryDate() != null) {
            entry.setEntryDate(request.getEntryDate());
        }
        return journalEntryRepository.save(entry);
    }

    public void deleteEntry(User user, Long entryId) {
        JournalEntry entry = journalEntryRepository.findById(entryId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Journal entry not found"));
        if (!entry.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }
        journalEntryRepository.delete(entry);
    }
}
