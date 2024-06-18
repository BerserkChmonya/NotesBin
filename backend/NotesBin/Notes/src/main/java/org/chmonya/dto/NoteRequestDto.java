package org.chmonya.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.chmonya.entity.Note;
@Data
@AllArgsConstructor
public class NoteRequestDto {
    private Note note;
    private String content;
}
