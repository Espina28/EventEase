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
    public ResponseEntity<List<NotificationEntity>> getUserNotifications(@RequestParam String userEmail) {
        List<NotificationEntity> notifications = notificationService.getUserNotifications(userEmail);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Get unread notifications for the authenticated user
     */
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationEntity>> getUnreadNotifications(@RequestParam String userEmail) {
        List<NotificationEntity> notifications = notificationService.getUnreadNotifications(userEmail);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Count unread notifications for the authenticated user
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> countUnreadNotifications(@RequestParam String userEmail) {
        long count = notificationService.countUnreadNotifications(userEmail);
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
    public ResponseEntity<Void> markAllAsRead(@RequestParam String userEmail) {
        notificationService.markAllAsRead(userEmail);
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
            @RequestParam String userEmail, 
            @PathVariable String notificationType) {
        List<NotificationEntity> notifications = notificationService.getNotificationsByType(userEmail, notificationType);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Create a test notification (for development purposes)
     */
    @PostMapping("/test")
    public ResponseEntity<NotificationEntity> createTestNotification(
            @RequestParam String userEmail,
            @RequestParam String message,
            @RequestParam String type) {
        
        NotificationEntity notification = notificationService.createNotification(
            userEmail,
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
    public ResponseEntity<NotificationEntity> createWelcomeNotification(@RequestParam String userEmail) {
        NotificationEntity notification = notificationService.createWelcomeNotification(userEmail);
        
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
            @RequestParam String userEmail,
            @RequestParam String amount) {
        
        NotificationEntity notification = notificationService.createBookingApprovalNotification(userEmail, amount);
        
        if (notification != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        }
        
        return ResponseEntity.badRequest().build();
    }
    
    /**
     * Create a booking rejection notification
     */
    @PostMapping("/booking-rejected")
    public ResponseEntity<NotificationEntity> createBookingRejectionNotification(@RequestParam String userEmail, @RequestParam String reason) {
        NotificationEntity notification = notificationService.createBookingRejectionNotification(userEmail, reason);
        
        if (notification != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        }
        
        return ResponseEntity.badRequest().build();
    }

    /**
     * Notify all admins
     */
    @PostMapping("/notify-admins")
    public ResponseEntity<Void> notifyAdmins(@RequestParam String message) {
        notificationService.notifyUsersByRole("Admin", message);
        return ResponseEntity.ok().build();
    }

    /**
     * Notify subcontractors related to a package
     */
    @PostMapping("/notify-subcontractors")
    public ResponseEntity<Void> notifySubcontractors(@RequestParam int packageId, @RequestParam String message) {
        notificationService.notifySubcontractorsByPackage(packageId, message);
        return ResponseEntity.ok().build();
    }

    /**
     * Notify subcontractors by subcontractor ID
     */
    @PostMapping("/notify-subcontractors-by-id")
    public ResponseEntity<NotificationEntity> notifySubcontractorsById(@RequestParam int subcontractorId, @RequestParam String message) {
        System.out.println("subcontractorId" + subcontractorId + "message" + message);
        NotificationEntity notification = notificationService.notifySubcontractorById(subcontractorId, message);
        if (notification != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        }
        return ResponseEntity.badRequest().build();
    }
}
