package com.Project.Backend.DTO;

import java.util.Date;

/**
 * Data Transfer Object for Notification
 * Used to transfer notification data to the frontend without exposing entity relationships
 */
public class NotificationDTO {
    private int notificationId;
    private int userId;
    private String notificationRecipientType;
    private Date notificationDate;
    private String notificationMessage;
    private String notificationType;
    private boolean isRead;
    
    // Default constructor
    public NotificationDTO() {
    }
    
    // Constructor with fields
    public NotificationDTO(int notificationId, int userId, String notificationRecipientType, 
                          Date notificationDate, String notificationMessage, 
                          String notificationType, boolean isRead) {
        this.notificationId = notificationId;
        this.userId = userId;
        this.notificationRecipientType = notificationRecipientType;
        this.notificationDate = notificationDate;
        this.notificationMessage = notificationMessage;
        this.notificationType = notificationType;
        this.isRead = isRead;
    }
    
    // Getters and Setters
    public int getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(int notificationId) {
        this.notificationId = notificationId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
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
