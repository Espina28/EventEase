package com.Project.Backend.Controller;

import com.Project.Backend.Entity.NotificationEntity;
import com.Project.Backend.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    /**
     * Get all notifications for the authenticated user
     */
    @GetMapping
    public ResponseEntity<List<NotificationEntity>> getUserNotifications(@RequestParam int userId) {
        List<NotificationEntity> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Get unread notifications for the authenticated user
     */
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationEntity>> getUnreadNotifications(@RequestParam int userId) {
        List<NotificationEntity> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Count unread notifications for the authenticated user
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> countUnreadNotifications(@RequestParam int userId) {
        long count = notificationService.countUnreadNotifications(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Mark a notification as read
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationEntity> markAsRead(@PathVariable int notificationId) {
        NotificationEntity notification = notificationService.markAsRead(notificationId);
        
        if (notification != null) {
            return ResponseEntity.ok(notification);
        }
        
        return ResponseEntity.notFound().build();
    }
    
    /**
     * Mark all notifications as read for the authenticated user
     */
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@RequestParam int userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Delete a notification
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable int notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Get notifications by type for the authenticated user
     */
    @GetMapping("/type/{notificationType}")
    public ResponseEntity<List<NotificationEntity>> getNotificationsByType(
            @RequestParam int userId, 
            @PathVariable String notificationType) {
        List<NotificationEntity> notifications = notificationService.getNotificationsByType(userId, notificationType);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Create a test notification (for development purposes)
     */
    @PostMapping("/test")
    public ResponseEntity<NotificationEntity> createTestNotification(
            @RequestParam int userId,
            @RequestParam String message,
            @RequestParam String type) {
        
        NotificationEntity notification = notificationService.createNotification(
            userId,
            "User",
            message,
            type
        );
        
        if (notification != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        }
        
        return ResponseEntity.badRequest().build();
    }
    
    /**
     * Create a welcome notification
     */
    @PostMapping("/welcome")
    public ResponseEntity<NotificationEntity> createWelcomeNotification(@RequestParam int userId) {
        NotificationEntity notification = notificationService.createWelcomeNotification(userId);
        
        if (notification != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        }
        
        return ResponseEntity.badRequest().build();
    }
    
    /**
     * Create a booking approval notification
     */
    @PostMapping("/booking-approved")
    public ResponseEntity<NotificationEntity> createBookingApprovalNotification(
            @RequestParam int userId,
            @RequestParam String amount) {
        
        NotificationEntity notification = notificationService.createBookingApprovalNotification(userId, amount);
        
        if (notification != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        }
        
        return ResponseEntity.badRequest().build();
    }
    
    /**
     * Create a booking rejection notification
     */
    @PostMapping("/booking-rejected")
    public ResponseEntity<NotificationEntity> createBookingRejectionNotification(@RequestParam int userId) {
        NotificationEntity notification = notificationService.createBookingRejectionNotification(userId);
        
        if (notification != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        }
        
        return ResponseEntity.badRequest().build();
    }
}
