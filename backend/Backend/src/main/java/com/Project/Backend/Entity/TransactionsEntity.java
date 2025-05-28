 package com.Project.Backend.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import org.w3c.dom.Text;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "transactions")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "transaction_Id")
public class TransactionsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int transaction_Id;

    @JoinColumn(name = "user_id")
    @ManyToOne
    @JsonBackReference(value = "user-transaction")
    private UserEntity user;

    @JoinColumn(name = "event_id")
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference(value = "event-transaction")
    private EventEntity event;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id")
    @JsonManagedReference(value = "transaction-package")
    private PackagesEntity packages;

    @OneToMany(mappedBy = "transactionsId", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "transaction-event-service")
    private List<EventServiceEntity> eventServices;

    //PAYMENT
    @OneToOne(mappedBy = "transaction", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "transaction-payment")
    private PaymentEntity payment;

    private String transactionVenue;
    private Status transactionStatus;
    private Date transactionDate;
    private Boolean transactionIsActive;
    private Boolean transactionisApprove;
    private Date transactionCreatedDdate;

    @Column(columnDefinition = "TEXT")
    private String transactionNote;

    public enum Status {
        COMPLETED, DECLINED, CANCELLED, PENDING, ONGOING
    }

    // Getters and Setters

    @PrePersist //before it save to db this will run first to ensue the variables will not be empty
    protected void onCreate() {
        this.transactionCreatedDdate = Date.valueOf(LocalDateTime.now().toLocalDate());
        this.transactionIsActive = true;
        this.transactionisApprove = false;
        this.transactionStatus = Status.PENDING;
    }

    public Date getTransactionCreatedDdate() {
        return transactionCreatedDdate;
    }

    public void setTransactionCreatedDdate(Date transactionCreatedDdate) {
        this.transactionCreatedDdate = transactionCreatedDdate;
    }

    public int getTransaction_Id() {
        return transaction_Id;
    }

    public void setTransaction_Id(int transaction_Id) {
        this.transaction_Id = transaction_Id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public EventEntity getEvent() {
        return event;
    }

    public void setEvent(EventEntity event) {
        this.event = event;
    }

    public PackagesEntity getPackages() {
        return packages;
    }

    public void setPackages(PackagesEntity packages) {
        this.packages = packages;
    }

    public List<EventServiceEntity> getEventServices() {
        return eventServices;
    }

    public void setEventServices(List<EventServiceEntity> eventServices) {
        this.eventServices = eventServices;
    }

    public PaymentEntity getPayment() {
        return payment;
    }

    public void setPayment(PaymentEntity payment) {
        this.payment = payment;
    }

    public String getTransactionVenue() {
        return transactionVenue;
    }

    public void setTransactionVenue(String transactionVenue) {
        this.transactionVenue = transactionVenue;
    }

    public Status getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(Status transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public Date getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(Date transactionDate) {
        this.transactionDate = transactionDate;
    }

    public Boolean getTransactionIsActive() {
        return transactionIsActive;
    }

    public void setTransactionIsActive(Boolean transactionIsActive) {
        this.transactionIsActive = transactionIsActive;
    }

    public Boolean getTransactionisApprove() {
        return transactionisApprove;
    }

    public void setTransactionisApprove(Boolean transactionisApprove) {
        this.transactionisApprove = transactionisApprove;
    }

    public String getTransactionNote() {
        return transactionNote;
    }

    public void setTransactionNote(String transactionNote) {
        this.transactionNote = transactionNote;
    }
}
