package org.chmonya.service;

import org.chmonya.entities.Friendship;
import org.chmonya.entities.RequestStatus;
import org.chmonya.repository.FriendsRepository;
import org.chmonya.user.entities.User;
import org.chmonya.user.repository.UserRepository;
import org.chmonya.user.service.JWTTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FriendsService {
    @Autowired
    private FriendsRepository friendsRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JWTTokenProvider jwtTokenProvider;

    public void addFriend(int user1_id, String friendName) {
        if (!validateUser(user1_id)) {
            throw new IllegalArgumentException("Invalid user1");
        }
        User user1 = userRepository.findById(user1_id)
                .orElseThrow(() -> new IllegalArgumentException("User1 not found with id: " + user1_id));
        User user2 = userRepository.findByName(friendName)
                .orElseThrow(() -> new IllegalArgumentException("User2 not found with name: " + friendName));

        if (friendsRepository.findByUser1AndUser2(user1, user2).isPresent() || friendsRepository.findByUser1AndUser2(user2, user1).isPresent() || user1.getUsername().equals(user2.getUsername())) {
            return;
        }

        Friendship friendship = Friendship.builder()
                .user1(user1)
                .user2(user2)
                .status(RequestStatus.PENDING)
                .createdAt(new Date())
                .build();

        friendsRepository.save(friendship);
    }

    public void acceptFriend(int user1_id, int user2_id) {
        if (!validateUser(user1_id)) {
            throw new IllegalArgumentException("Invalid user1");
        }

        User user1 = userRepository.findById(user1_id)
                .orElseThrow(() -> new IllegalArgumentException("User1 not found with id: " + user1_id));
        User user2 = userRepository.findById(user2_id)
                .orElseThrow(() -> new IllegalArgumentException("User2 not found with id: " + user2_id));

        Friendship friendship = friendsRepository.findByUser1AndUser2(user1, user2).orElse(null);
        if (friendship == null) {
            friendship = friendsRepository.findByUser1AndUser2(user2, user1).orElse(null);
        }

        if (friendship != null) {
            friendship.setStatus(RequestStatus.ACCEPTED);
            friendsRepository.save(friendship);
        }
    }

    public void rejectFriend(int user1_id, int user2_id) {
        if (!validateUser(user1_id)) {
            throw new IllegalArgumentException("Invalid user1");
        }

        User user1 = userRepository.findById(user1_id)
                .orElseThrow(() -> new IllegalArgumentException("User1 not found with id: " + user1_id));
        User user2 = userRepository.findById(user2_id)
                .orElseThrow(() -> new IllegalArgumentException("User2 not found with id: " + user2_id));

        Friendship friendship = friendsRepository.findByUser1AndUser2(user1, user2).orElse(null);
        if (friendship == null) {
            friendship = friendsRepository.findByUser1AndUser2(user2, user1).orElse(null);
        }

        if (friendship != null) {
            friendsRepository.delete(friendship);
        }
    }

    public List<User> getFriends(int user_id) {
        if (!validateUser(user_id)) {
            throw new IllegalArgumentException("Invalid user1");
        }

        User user = userRepository.findById(user_id)
                .orElseThrow(() -> new IllegalArgumentException("User2 not found with id: " + user_id));

        List<Friendship> friendships = friendsRepository.findFriends(user);

        return friendships.stream()
                .map(friendship -> friendship.getUser1().equals(user) ? friendship.getUser2() : friendship.getUser1())
                .collect(Collectors.toList());
    }

    public List<User> getFriendRequests(int user_id) {
        if (!validateUser(user_id)) {
            throw new IllegalArgumentException("Invalid user1");
        }

        User user = userRepository.findById(user_id)
                .orElseThrow(() -> new IllegalArgumentException("User2 not found with id: " + user_id));

        List<Friendship> friendships = friendsRepository.findByUser2AndStatus(user, RequestStatus.PENDING);

        return friendships.stream()
                .map(friendship -> friendship.getUser1().equals(user) ? friendship.getUser2() : friendship.getUser1())
                .collect(Collectors.toList());
    }

    private boolean validateUser(int userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return jwtTokenProvider.validateToken(user.getUsername());
    }

}
