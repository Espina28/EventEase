package com.Project.Backend.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "notifications")
public class NotificationEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int notificationId;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-notification")
    private UserEntity user;
    
    private String notificationRecipientType;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date notificationDate;
    
    private String notificationMessage;
    
    private String notificationType; // e.g., "booking-approved", "booking-rejected", "welcome"
    
    private boolean isRead;
    
    // Default constructor
    public NotificationEntity() {
    }
    
    // Constructor with fields
    public NotificationEntity(UserEntity user, String notificationRecipientType, 
                             String notificationMessage, String notificationType) {
        this.user = user;
        this.notificationRecipientType = notificationRecipientType;
        this.notificationDate = new Date(); // Current date and time
        this.notificationMessage = notificationMessage;
        this.notificationType = notificationType;
        this.isRead = false;
    }
    
    // Getters and Setters
    public int getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(int notificationId) {
        this.notificationId = notificationId;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public String getNotificationRecipientType() {
        return notificationRecipientType;
    }

    public void setNotificationRecipientType(String notificationRecipientType) {
        this.notificationRecipientType = notificationRecipientType;
    }

    public Date getNotificationDate() {
        return notificationDate;
    }

    public void setNotificationDate(Date notificationDate) {
        this.notificationDate = notificationDate;
    }

    public String getNotificationMessage() {
        return notificationMessage;
    }

    public void setNotificationMessage(String notificationMessage) {
        this.notificationMessage = notificationMessage;
    }
    
    public String getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(String notificationType) {
        this.notificationType = notificationType;
    }
    
    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }
}
