package org.chmonya.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TitledDto {
    private String title;
    private String content;
}
