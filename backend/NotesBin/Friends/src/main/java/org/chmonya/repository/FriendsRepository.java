package org.chmonya.repository;

import org.chmonya.entities.Friendship;
import org.chmonya.entities.RequestStatus;
import org.chmonya.user.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendsRepository extends JpaRepository<Friendship, Long> {
    Optional<Friendship> findByUser1AndUser2(User user1, User user2);
    List<Friendship> findByUser2AndStatus(User user2, RequestStatus status);
    @Query("SELECT f FROM Friendship f WHERE (f.user1 = :user OR f.user2 = :user) AND f.status = org.chmonya.entities.RequestStatus.ACCEPTED")
    List<Friendship> findFriends(@Param("user") User user);
}
