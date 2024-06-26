package org.chmonya.user.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class JWTTokenProvider {
    @Autowired
    private JWTUtils jwtUtils;

    public boolean validateToken(String username) {
        // Retrieve the HttpServletRequest from RequestContextHolder
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();

        // Extract the token from the Authorization header
        String token = extractTokenFromHeader(request);

        if (StringUtils.hasText(token)) {
            return jwtUtils.extractUsername(token).equals(username);
        }

        return false;
    }

    private String extractTokenFromHeader(HttpServletRequest request) {
        // Get the Authorization header from the request
        String bearerToken = request.getHeader("Authorization");

        // Check if Authorization header is present and formatted correctly
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer ".length() == 7
        }

        return null;
    }
}
