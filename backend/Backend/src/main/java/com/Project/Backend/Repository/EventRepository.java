package com.Project.Backend.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.Backend.Entity.EventEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRepository extends JpaRepository<EventEntity, Integer> {
    // List<EventEntity> findByIsAvailableTrue();
    @Query("SELECT e FROM EventEntity e WHERE e.event_name = :eventName")
    EventEntity findByName(@Param("eventName") String eventName);
}
