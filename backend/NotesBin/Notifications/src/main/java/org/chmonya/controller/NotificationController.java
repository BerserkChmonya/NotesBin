package org.chmonya.controller;

import org.chmonya.entity.Notification;
import org.chmonya.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @PostMapping("/send")
    public void sendNotification(String topic, String message) {
        notificationService.sendNotification(topic, message);
    }

    @GetMapping("/unseen/{userId}")
    public List<Notification> getUnseenNotifications(@PathVariable int userId) {
        System.out.println("huj");
        return notificationService.getUnseenNotifications(userId);
    }

    @PutMapping("/mark/{id}")
    public void markAsSeen(@PathVariable Long id) {
        notificationService.markAsSeen(id);
    }
}
