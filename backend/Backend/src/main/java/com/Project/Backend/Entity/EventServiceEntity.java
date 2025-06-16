package com.Project.Backend.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

@Entity
@Table(name = "event_services")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "eventServices_id")
public class EventServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int eventServices_id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference("subcontractor-eventservice")
    @JoinColumn(name = "subcontractor_id", nullable = true)
    private SubcontractorEntity subcontractor;


    @ManyToOne()
    @JoinColumn(name = "transaction_id")
    @JsonBackReference("transaction-event-service")
    private TransactionsEntity transactionsId;

    public int getEventServices_id() {
        return eventServices_id;
    }

    public void setEventServices_id(int eventServices_id) {
        this.eventServices_id = eventServices_id;
    }

    public SubcontractorEntity getSubcontractor() {
        return subcontractor;
    }

    public void setSubcontractor(SubcontractorEntity subcontractor) {
        this.subcontractor = subcontractor;
    }

    public TransactionsEntity getTransactionsId() {
        return transactionsId;
    }

    public void setTransactionsId(TransactionsEntity transactionsId) {
        this.transactionsId = transactionsId;
    }
}
