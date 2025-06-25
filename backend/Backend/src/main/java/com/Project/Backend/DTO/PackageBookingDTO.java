package com.Project.Backend.DTO;

import java.sql.Date;

public class PackageBookingDTO {
    
    // Personal Information
    private String firstName;
    private String lastName;
    private String email;
    private String contact;
    
    // Event Details
    private String eventName;
    private Integer eventId;
    private String transactionVenue;
    private Date transactionDate;
    private String transactionNote;
    
    // Package Information (specific to package bookings)
    private Integer packageId;
    private String packageName; // Optional, for display purposes
    
    // Payment Information
    private String paymentReceipt; // URL of uploaded payment proof
    private String paymentNote;
    private String paymentReferenceNumber;
    
    // User Information
    private String userEmail;

    // Constructors
    public PackageBookingDTO() {}

    public PackageBookingDTO(String firstName, String lastName, String email, String contact, 
                           String eventName, Integer eventId, String transactionVenue, 
                           Date transactionDate, Integer packageId, String paymentReferenceNumber, 
                           String userEmail) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.contact = contact;
        this.eventName = eventName;
        this.eventId = eventId;
        this.transactionVenue = transactionVenue;
        this.transactionDate = transactionDate;
        this.packageId = packageId;
        this.paymentReferenceNumber = paymentReferenceNumber;
        this.userEmail = userEmail;
    }

    // Getters and Setters
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

    public String getTransactionVenue() {
        return transactionVenue;
    }

    public void setTransactionVenue(String transactionVenue) {
        this.transactionVenue = transactionVenue;
    }

    public Date getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(Date transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getTransactionNote() {
        return transactionNote;
    }

    public void setTransactionNote(String transactionNote) {
        this.transactionNote = transactionNote;
    }

    public Integer getPackageId() {
        return packageId;
    }

    public void setPackageId(Integer packageId) {
        this.packageId = packageId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getPaymentReceipt() {
        return paymentReceipt;
    }

    public void setPaymentReceipt(String paymentReceipt) {
        this.paymentReceipt = paymentReceipt;
    }

    public String getPaymentNote() {
        return paymentNote;
    }

    public void setPaymentNote(String paymentNote) {
        this.paymentNote = paymentNote;
    }

    public String getPaymentReferenceNumber() {
        return paymentReferenceNumber;
    }

    public void setPaymentReferenceNumber(String paymentReferenceNumber) {
        this.paymentReferenceNumber = paymentReferenceNumber;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    @Override
    public String toString() {
        return "PackageBookingDTO{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", contact='" + contact + '\'' +
                ", eventName='" + eventName + '\'' +
                ", eventId=" + eventId +
                ", transactionVenue='" + transactionVenue + '\'' +
                ", transactionDate=" + transactionDate +
                ", transactionNote='" + transactionNote + '\'' +
                ", packageId=" + packageId +
                ", packageName='" + packageName + '\'' +
                ", paymentReferenceNumber='" + paymentReferenceNumber + '\'' +
                ", userEmail='" + userEmail + '\'' +
                '}';
    }
}