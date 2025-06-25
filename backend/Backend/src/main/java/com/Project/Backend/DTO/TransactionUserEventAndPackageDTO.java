package com.Project.Backend.DTO;

import com.Project.Backend.Entity.TransactionsEntity;

import java.sql.Date;

public class TransactionUserEventAndPackageDTO {
    private int transaction_Id;
    private String userName;
    private String userEmail;
    private String userContactNumber;
    private String eventType;
    private String eventLocation;
    private String status;
    private Date eventDate;
    private String note;
    private String packageName;

    public TransactionUserEventAndPackageDTO(int transaction_Id, String userName, String userEmail, String userContactNumber, String eventType, String eventLocation,
                                                TransactionsEntity.Status
            status, Date eventDate, String note, String packageName) {
        this.transaction_Id = transaction_Id;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userContactNumber = userContactNumber;
        this.eventType = eventType;
        this.eventLocation = eventLocation;
        this.status = status.toString();
        this.eventDate = eventDate;
        this.note = note;
        this.packageName = packageName;
    }

    public int getTransaction_Id() {
        return transaction_Id;
    }

    public void setTransaction_Id(int transaction_Id) {
        this.transaction_Id = transaction_Id;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserContactNumber() {
        return userContactNumber;
    }

    public void setUserContactNumber(String userContactNumber) {
        this.userContactNumber = userContactNumber;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getEventLocation() {
        return eventLocation;
    }

    public void setEventLocation(String eventLocation) {
        this.eventLocation = eventLocation;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getEventDate() {
        return eventDate;
    }

    public void setEventDate(Date eventDate) {
        this.eventDate = eventDate;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
