package org.chmonya.controller;

import org.chmonya.dto.NoteRequestDto;
import org.chmonya.dto.TitledDto;
import org.chmonya.dto.UpdateDto;
import org.chmonya.entity.Note;
import org.chmonya.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/notes")
public class NoteController {
    @Autowired
    private NoteService noteService;

    @PostMapping("/save")
    public void saveNote(@RequestBody NoteRequestDto saveNoteRequest){
        Note note = saveNoteRequest.getNote();
        String content = saveNoteRequest.getContent();
        noteService.saveNote(note, content);
    }

    @GetMapping("/get-notes")
    public List<NoteRequestDto> getNotesByUserId(@RequestParam int userId){
        return noteService.getNotesByUserId(userId);
    }

    @PostMapping("/delete")
    public void deleteNote(@RequestParam String link){
        noteService.deleteNote(link);
    }

    @PutMapping("/update")
    public void updateNote(@RequestBody UpdateDto updateDto){
        noteService.updateNote(updateDto);
    }

    @GetMapping("/get-note")
    public TitledDto getNote(@RequestParam String link){
        return noteService.getNote(link);
    }


    @GetMapping("/test")
    public String test(){
        return "Hello World";
    }

    @GetMapping("/get-titled")
    public List<TitledDto> getTitledNotes(@RequestParam int userId){
        return noteService.getTitledContent(userId);
    }

    @PutMapping("/update-title")
    public void updateTitle(@RequestParam String link, @RequestParam String title){
        System.out.println("Updating title");
        noteService.updateTitle(link, title);
    }

//    @GetMapping("/update-title")
//    public String updateTitle(){
//        return "Hello world";
//    }
}
