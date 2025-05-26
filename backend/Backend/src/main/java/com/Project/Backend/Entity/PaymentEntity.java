package com.Project.Backend.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.sql.Date;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paymentId;

    @OneToOne
    @JoinColumn(name = "transaction_id")
    @JsonBackReference("transaction-payment")
    private TransactionsEntity transaction;

    private Date paymentDatePaid;
    private String paymentNote;
    private String paymentReceipt; // Added this field to match ERD
    private STATUS paymentStatus = STATUS.ACCEPTED;
    private int paymentReferenceNumber; // Added this field to match ERD

    @PrePersist
    protected void onCreate() {
        this.paymentDatePaid = Date.valueOf(LocalDateTime.now().toLocalDate());
    }

    public enum STATUS {
        ACCEPTED, REJECTED, RETURNED
    }

    // Getters and Setters
    public int getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(int paymentId) {
        this.paymentId = paymentId;
    }

    public TransactionsEntity getTransaction() {
        return transaction;
    }

    public void setTransaction(TransactionsEntity transaction) {
        this.transaction = transaction;
    }

    public Date getPaymentDatePaid() {
        return paymentDatePaid;
    }

    public void setPaymentDatePaid(Date paymentDatePaid) {
        this.paymentDatePaid = paymentDatePaid;
    }

    public String getPaymentNote() {
        return paymentNote;
    }

    public void setPaymentNote(String paymentNote) {
        this.paymentNote = paymentNote;
    }

    public String getPaymentReceipt() {
        return paymentReceipt;
    }

    public void setPaymentReceipt(String paymentReceipt) {
        this.paymentReceipt = paymentReceipt;
    }

    public STATUS getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(STATUS paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public int getPaymentReferenceNumber() {
        return paymentReferenceNumber;
    }

    public void setPaymentReferenceNumber(int paymentReferenceNumber) {
        this.paymentReferenceNumber = paymentReferenceNumber;
    }
}
