package org.chmonya.controller;

import org.chmonya.service.URLGenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/link")
public class URLGenController {
    @Autowired
    private URLGenService urlGenService;

    @GetMapping("/generate")
    public String getURL() {
        return  urlGenService.getFromCache();
    }

    @GetMapping
    public String test() {
        return "Hello World!";
    }
}
