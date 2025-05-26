package com.Project.Backend.Service;

import com.Project.Backend.Entity.NotificationEntity;
import com.Project.Backend.Entity.UserEntity;
import com.Project.Backend.Repository.NotificationRepository;
import com.Project.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Create a new notification for a user
     */
    public NotificationEntity createNotification(int userId, String recipientType, String message, String notificationType) {
        Optional<UserEntity> userOpt = userRepository.findById(userId);
        
        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();
            NotificationEntity notification = new NotificationEntity(user, recipientType, message, notificationType);
            return notificationRepository.save(notification);
        }
        
        return null;
    }
    
    /**
     * Get all notifications for a user
     */
    public List<NotificationEntity> getUserNotifications(int userId) {
        return notificationRepository.findByUserUserIdOrderByNotificationDateDesc(userId);
    }
    
    /**
     * Get unread notifications for a user
     */
    public List<NotificationEntity> getUnreadNotifications(int userId) {
        return notificationRepository.findByUserUserIdAndIsReadFalseOrderByNotificationDateDesc(userId);
    }
    
    /**
     * Count unread notifications for a user
     */
    public long countUnreadNotifications(int userId) {
        return notificationRepository.countByUserUserIdAndIsReadFalse(userId);
    }
    
    /**
     * Mark a notification as read
     */
    public NotificationEntity markAsRead(int notificationId) {
        Optional<NotificationEntity> notificationOpt = notificationRepository.findById(notificationId);
        
        if (notificationOpt.isPresent()) {
            NotificationEntity notification = notificationOpt.get();
            notification.setRead(true);
            return notificationRepository.save(notification);
        }
        
        return null;
    }
    
    /**
     * Mark all notifications as read for a user
     */
    public void markAllAsRead(int userId) {
        List<NotificationEntity> unreadNotifications = notificationRepository.findByUserUserIdAndIsReadFalseOrderByNotificationDateDesc(userId);
        
        for (NotificationEntity notification : unreadNotifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }
    
    /**
     * Delete a notification
     */
    public void deleteNotification(int notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    
    /**
     * Get notifications by type for a user
     */
    public List<NotificationEntity> getNotificationsByType(int userId, String notificationType) {
        return notificationRepository.findByUserUserIdAndNotificationTypeOrderByNotificationDateDesc(userId, notificationType);
    }
    
    /**
     * Create a welcome notification for a new user
     */
    public NotificationEntity createWelcomeNotification(int userId) {
        return createNotification(
            userId,
            "User",
            "Hey there! Welcome to EventEase. Begin your journey by exploring our event services.",
            "welcome"
        );
    }
    
    /**
     * Create a booking approval notification
     */
    public NotificationEntity createBookingApprovalNotification(int userId, String amount) {
        return createNotification(
            userId,
            "User",
            "Your booking has been approved by the event contractor. Your ₹" + amount + " downpayment has been confirmed.",
            "booking-approved"
        );
    }
    
    /**
     * Create a booking rejection notification
     */
    public NotificationEntity createBookingRejectionNotification(int userId) {
        return createNotification(
            userId,
            "User",
            "Your booking has been rejected by the event contractor.",
            "booking-rejected"
        );
    }
}
