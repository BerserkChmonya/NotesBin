package org.chmonya.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class URLGenService {
    private final JdbcTemplate jdbcTemplate;
    private final RedisTemplate<String, String> redisTemplate;
    private final String cacheKey = "urlCache";
    @Autowired
    public URLGenService(JdbcTemplate jdbcTemplate, RedisTemplate<String, String> redisTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.redisTemplate = redisTemplate;

        initializeCache();
    }
    private String generateURL() {
        UUID uuid = UUID.randomUUID();
        String uniqueURL = uuid.toString();
        while (!isURLValid(uniqueURL)) {
            uuid = UUID.randomUUID();
            uniqueURL = uuid.toString();
        }
        return uniqueURL;
    }

    private boolean isURLValid(String url) {
        String query = "SELECT COUNT(*) FROM note WHERE link = ?";
        int count = jdbcTemplate.queryForObject(query, Integer.class, url);
        return count == 0;
    }


    private void initializeCache() {
        for (int i = 0; i < 10; i++) {
            String url = generateURL();
            redisTemplate.opsForList().rightPush(cacheKey, url);
        }
    }
    @Async("taskExecutor")
    public void addToCacheAsync() {
        String url = generateURL();
        System.out.println("Async Adding to cache: " + url);
        redisTemplate.opsForList().rightPush(cacheKey, url);
    }

    public String getFromCache() {
        String url = redisTemplate.opsForList().leftPop(cacheKey);
        if (url != null) {
            addToCacheAsync();
            return url;
        } else {
            // Fallback if cache is empty
            return generateURL();
        }
    }
}
