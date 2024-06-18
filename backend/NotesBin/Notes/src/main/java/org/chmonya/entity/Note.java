package org.chmonya.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.chmonya.user.Entity.User;

import java.util.Date;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Note {
    @Id
    @SequenceGenerator(name = "note_sequence", sequenceName = "note_sequence")
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "note_sequence")
    private int id;

    private String title = "Untitled";

    @Column(unique = true, nullable = false)
    private String link;

    @Column(nullable = false)
    private boolean isPrivate;

    @Column(nullable = false)
    private Date createdDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    public void ensureTitleIsSet() {
        if (this.title == null) {
            this.title = "Untitled";
        }
    }
}
