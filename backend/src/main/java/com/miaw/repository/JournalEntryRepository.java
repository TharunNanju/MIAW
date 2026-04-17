package com.miaw.repository;

import com.miaw.model.JournalEntry;
import com.miaw.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    List<JournalEntry> findAllByUserOrderByEntryDateDesc(User user);
}
