package com.Project.Backend.Entity;

import jakarta.persistence.*;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "form_data")
public class FormDraftEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String email;

    @Column(columnDefinition = "json")
    private String progressJSON;
    private String eventName;
    private Timestamp createdAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime dateOnly = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        this.createdAt = Timestamp.valueOf(dateOnly);
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getProgressJSON() {
        return progressJSON;
    }

    public void setProgressJSON(String progressJSON) {
        this.progressJSON = progressJSON;
    }
}
