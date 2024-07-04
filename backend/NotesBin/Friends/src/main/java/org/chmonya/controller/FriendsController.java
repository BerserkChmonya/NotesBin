package org.chmonya.controller;

import org.chmonya.service.FriendsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.chmonya.user.entities.User;

import java.util.List;

@Controller
@RequestMapping("/user/friends")
public class FriendsController {
    @Autowired
    private FriendsService friendsService;

    @PostMapping("/send-request")
    public ResponseEntity<String> sendRequest(@RequestParam int user1_id, @RequestParam String friendName){
        friendsService.addFriend(user1_id, friendName);
        return ResponseEntity.ok("Request sent!");
    }

    @PutMapping("/accept-request")
    public ResponseEntity<String> acceptRequest(@RequestParam int user1_id, @RequestParam int user2_id){
        friendsService.acceptFriend(user1_id, user2_id);
        return ResponseEntity.ok("Request accepted!");
    }

    @DeleteMapping("/reject-request")
    public ResponseEntity<String> rejectRequest(@RequestParam int user1_id, @RequestParam int user2_id){
        friendsService.rejectFriend(user1_id, user2_id);
        return ResponseEntity.ok("Request rejected!");
    }

    @GetMapping("/get-friends")
    public ResponseEntity<List<User>> getFriends(@RequestParam int user_id){
        return ResponseEntity.ok(friendsService.getFriends(user_id));
    }

    @GetMapping("/get-friend-requests")
    public ResponseEntity<List<User>> getFriendRequests(@RequestParam int user_id){
        return ResponseEntity.ok(friendsService.getFriendRequests(user_id));
    }

    @GetMapping("/test")
    public ResponseEntity<String> test(){
        return ResponseEntity.ok("Access granted!");
    }
}
