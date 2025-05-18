package com.Project.Backend.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.sql.Date;
import java.sql.Timestamp;
 
@Entity
@Table(name = "Unavailable_Dates")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "unavailableDate_id")
public class UnavailableDates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int unavailableDate_id;
    private Date date;

    @Column(columnDefinition = "TEXT")
    private String reason;
    private Timestamp created_at;

    @ManyToOne
    @JoinColumn(name = "subcontractor_id")
    @JsonBackReference(value = "subcontractor-unavailable-dates")
    private SubcontractorEntity subcontractor;

    // Getters and setters
    public int getUnavailableDate_id() {
        return unavailableDate_id;
    }

    public void setUnavailableDate_id(int unavailableDate_id) {
        this.unavailableDate_id = unavailableDate_id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Timestamp getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }

    public SubcontractorEntity getSubcontractorEntity() {
        return subcontractor;
    }

    public void setSubcontractorEntity(SubcontractorEntity subcontractor) {
        this.subcontractor = subcontractor;
    }
}
