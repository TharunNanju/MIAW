package com.miaw.controller;

import com.miaw.dto.JournalEntryRequest;
import com.miaw.dto.JournalEntryResponse;
import com.miaw.model.JournalEntry;
import com.miaw.model.User;
import com.miaw.service.AuthService;
import com.miaw.service.JournalService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/journals")
public class JournalController {
    private final AuthService authService;
    private final JournalService journalService;

    public JournalController(AuthService authService, JournalService journalService) {
        this.authService = authService;
        this.journalService = journalService;
    }

    @GetMapping
    public List<JournalEntryResponse> list() {
        User user = authService.getCurrentUser();
        return journalService.listEntries(user).stream().map(this::toResponse).toList();
    }

    @PostMapping
    public JournalEntryResponse create(@Valid @RequestBody JournalEntryRequest request) {
        User user = authService.getCurrentUser();
        JournalEntry entry = journalService.createEntry(user, request);
        return toResponse(entry);
    }

    @PutMapping("/{entryId}")
    public JournalEntryResponse update(@PathVariable Long entryId, @Valid @RequestBody JournalEntryRequest request) {
        User user = authService.getCurrentUser();
        JournalEntry entry = journalService.updateEntry(user, entryId, request);
        return toResponse(entry);
    }

    @DeleteMapping("/{entryId}")
    public void delete(@PathVariable Long entryId) {
        User user = authService.getCurrentUser();
        journalService.deleteEntry(user, entryId);
    }

    private JournalEntryResponse toResponse(JournalEntry entry) {
        return new JournalEntryResponse(
            entry.getId(),
            entry.getTitle(),
            entry.getContent(),
            entry.getEntryDate(),
            entry.getCreatedAt()
        );
    }
}
