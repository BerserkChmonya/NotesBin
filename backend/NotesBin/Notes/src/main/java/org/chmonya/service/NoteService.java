package org.chmonya.service;

import org.chmonya.dto.NoteRequestDto;
import org.chmonya.dto.TitledDto;
import org.chmonya.dto.UpdateDto;
import org.chmonya.entity.Note;
import org.chmonya.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class NoteService {
    @Autowired
    private NoteRepository noteRepository;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private BlobStorageService blobStorageService;


    public void saveNote(Note note, String content) {
        String link = restTemplate.getForObject(
                "http://localhost:8040/link/generate",
                String.class
        );
        note.setLink(link);
        note.setCreatedDate(new Date());

        noteRepository.save(note);
        System.out.println("Note saved with link " + link);
        blobStorageService.uploadBlob(link, content);
        System.out.println("Blob uploaded with link " + link);
    }

    public List<NoteRequestDto> getNotesByUserId(int userId) {
        List<NoteRequestDto> notes_dto= new ArrayList<>();
        List<Note> notes = noteRepository.findByUserId(userId);
        for (Note note : notes) {
            try {
                notes_dto.add(new NoteRequestDto(note, blobStorageService.downloadTextBlob(note.getLink()) ));
            } catch (Exception e) {
                System.out.println("Error while downloading blob with name " + note.getLink());
            }
        }
        return notes_dto;
    }

    public void deleteNote(String link) {
        Note note = noteRepository.findByLink(link);
        if (note != null) {
            noteRepository.delete(note);
            blobStorageService.deleteBlob(link);
        }
    }

    public void updateNote(UpdateDto updateDto) {
        blobStorageService.updateBlob(updateDto.getLink(), updateDto.getContent());
    }

    public TitledDto getNote(String link) {
        try {
            String title = noteRepository.findByLink(link).getTitle();
            return new TitledDto(title, blobStorageService.downloadTextBlob(link));
        } catch (Exception e) {
            System.out.println("Error while downloading blob with name " + link);
            return null;
        }
    }

    public List<TitledDto> getTitledContent(int userId) {
        List<Note> notes = noteRepository.findByUserId(userId);
        List<TitledDto> titledContent= new ArrayList<>();
        for (Note note : notes) {
            try {
                if(note.isPrivate()) continue;
                titledContent.add(new TitledDto( note.getTitle(), blobStorageService.downloadTextBlob(note.getLink()) ));
            } catch (Exception e) {
                System.out.println("Error while downloading blob with name " + note.getLink());
            }
        }
        return titledContent;

    }

    public void updateTitle(String link, String title){
        System.out.println("Updating title of note with link " + link + " to " + title);
        Note note = noteRepository.findByLink(link);
        note.setTitle(title);
        noteRepository.save(note);
    }
}
