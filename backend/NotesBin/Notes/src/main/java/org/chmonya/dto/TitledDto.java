package org.chmonya.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class TitledDto {
    private String title;
    private String content;
    private Date createdDate;
}
