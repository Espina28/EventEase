package com.Project.Backend.Repository;

import com.Project.Backend.Entity.BookingRejectionNoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRejectionNoteRepository extends JpaRepository<BookingRejectionNoteEntity, Integer> {
}
