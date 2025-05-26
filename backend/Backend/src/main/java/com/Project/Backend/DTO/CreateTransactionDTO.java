package com.Project.Backend.DTO;

import com.Project.Backend.Entity.*;

import java.sql.Date;
import java.util.List;

public class CreateTransactionDTO {
    private int transaction_Id;
    private String userEmail;
    private String eventName;            //pk of event
    private String packageName;
    private List<Integer> services; //this is pk's of subcontractor
    private PaymentEntity payment;
    //------
    private String venue;
    private Date eventDate;
    private String userNote;

    public int getTransaction_Id() {
        return transaction_Id;
    }

    public void setTransaction_Id(int transaction_Id) {
        this.transaction_Id = transaction_Id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public List<Integer> getServices() {
        return services;
    }

    public void setServices(List<Integer> services) {
        this.services = services;
    }

    public PaymentEntity getPayment() {
        return payment;
    }

    public void setPayment(PaymentEntity payment) {
        this.payment = payment;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public Date getEventDate() {
        return eventDate;
    }

    public void setEventDate(Date eventDate) {
        this.eventDate = eventDate;
    }

    public String getUserNote() {
        return userNote;
    }

    public void setUserNote(String userNote) {
        this.userNote = userNote;
    }
}
