package com.Project.Backend.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subcontractor_progress")
public class SubcontractorProgressEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int subcontractorProgressId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    @JsonBackReference(value = "transaction-subcontractor-progress")
    private TransactionsEntity transaction;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subcontractor_id", nullable = false)
    private SubcontractorEntity subcontractor;

    @Column(nullable = false)
    private int progressPercentage; // 0-100 percentage

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CheckInStatus checkInStatus;

    @Column(columnDefinition = "TEXT")
    private String progressNotes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum CheckInStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.checkInStatus == null) {
            this.checkInStatus = CheckInStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Constructors
    public SubcontractorProgressEntity() {}

    public SubcontractorProgressEntity(TransactionsEntity transaction, SubcontractorEntity subcontractor,
                                     int progressPercentage, String progressNotes) {
        this.transaction = transaction;
        this.subcontractor = subcontractor;
        this.progressPercentage = progressPercentage;
        this.progressNotes = progressNotes;
    }

    // Getters and Setters
    public int getSubcontractorProgressId() {
        return subcontractorProgressId;
    }

    public void setSubcontractorProgressId(int subcontractorProgressId) {
        this.subcontractorProgressId = subcontractorProgressId;
    }

    public TransactionsEntity getTransaction() {
        return transaction;
    }

    public void setTransaction(TransactionsEntity transaction) {
        this.transaction = transaction;
    }

    public SubcontractorEntity getSubcontractor() {
        return subcontractor;
    }

    public void setSubcontractor(SubcontractorEntity subcontractor) {
        this.subcontractor = subcontractor;
    }

    public int getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(int progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public CheckInStatus getCheckInStatus() {
        return checkInStatus;
    }

    public void setCheckInStatus(CheckInStatus checkInStatus) {
        this.checkInStatus = checkInStatus;
    }

    public String getProgressNotes() {
        return progressNotes;
    }

    public void setProgressNotes(String progressNotes) {
        this.progressNotes = progressNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
