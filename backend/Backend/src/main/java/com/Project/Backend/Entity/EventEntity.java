package com.Project.Backend.Entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name ="Events")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "event_Id")
public class EventEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int event_Id;

    @OneToMany(mappedBy = "event")
    @JsonManagedReference("event-transaction")
    private List<TransactionsEntity> transactions;

    private String event_name;
    private String event_description;
    private String event_summary;
    private boolean event_isAvailable;
    private double event_price;
    private String event_image;

    public int getEvent_Id() {
        return event_Id;
    }

    public void setEvent_Id(int event_Id) {
        this.event_Id = event_Id;
    }

    public List<TransactionsEntity> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<TransactionsEntity> transactions) {
        this.transactions = transactions;
    }

    public String getEvent_name() {
        return event_name;
    }

    public void setEvent_name(String event_name) {
        this.event_name = event_name;
    }

    public String getEvent_summary() {
        return event_summary;
    }

    public void setEvent_summary(String event_summary) {
        this.event_summary = event_summary;
    }

    public String getEvent_description() {
        return event_description;
    }

    public void setEvent_description(String event_description) {
        this.event_description = event_description;
    }

    public boolean isEvent_isAvailable() {
        return event_isAvailable;
    }

    public void setEvent_isAvailable(boolean event_isAvailable) {
        this.event_isAvailable = event_isAvailable;
    }

    public double getEvent_price() {
        return event_price;
    }

    public void setEvent_price(double event_price) {
        this.event_price = event_price;
    }

    public String getEvent_image() {
        return event_image;
    }

    public void setEvent_image(String event_image) {
        this.event_image = event_image;
    }
}
