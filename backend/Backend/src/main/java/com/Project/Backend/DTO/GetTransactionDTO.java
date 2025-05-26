package com.Project.Backend.DTO;

import com.Project.Backend.Entity.*;

import java.io.Serializable;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GetTransactionDTO {
    private int transaction_Id;
    private String userEmail;
    private String userName;
    private String phoneNumber;
    private String userAddress; //userdata
    private String eventName;
    private String transactionVenue;
    private String transactionStatus;
    private Date transactionDate;
    private String transactionNote;
    private String packages;
    private PaymentEntity payment;
    private List<Map<String, Object>>subcontractors;

    public GetTransactionDTO() {
        this.subcontractors = new ArrayList<>();
        this.payment = new PaymentEntity();
    }

    public String getTransactionNote() {
        return transactionNote;
    }

    public void setTransactionNote(String transactionNote) {
        this.transactionNote = transactionNote;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getUserAddress() {
        return userAddress;
    }

    public void setUserAddress(String userAddress) {
        this.userAddress = userAddress;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getTransactionVenue() {
        return transactionVenue;
    }

    public void setTransactionVenue(String transactionVenue) {
        this.transactionVenue = transactionVenue;
    }

    public String getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(String transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public Date getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(Date transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getPackages() {
        return packages;
    }

    public void setPackages(String packages) {
        this.packages = packages;
    }

    public PaymentEntity getPayment() {
        return payment;
    }

    public void setPayment(PaymentEntity payment) {
        this.payment = payment;
    }

    public List<Map<String, Object>> getSubcontractors() {
        return subcontractors;
    }

    public void setSubcontractors(List<Map<String, Object>> subcontractors) {
        this.subcontractors = subcontractors;
    }

    public int getTransaction_Id() {
        return transaction_Id;
    }

    public void setTransaction_Id(int transaction_Id) {
        this.transaction_Id = transaction_Id;
    }
}
