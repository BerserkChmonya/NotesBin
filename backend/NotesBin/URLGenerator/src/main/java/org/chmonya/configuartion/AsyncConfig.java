package org.chmonya.configuartion;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        // Set the core pool size to handle the expected minimum load
        executor.setCorePoolSize(20);
        // Set the maximum pool size to handle spikes in load
        executor.setMaxPoolSize(100);
        // Set the queue capacity to handle bursts
        executor.setQueueCapacity(200);
        // Set the thread name prefix for easier debugging
        executor.setThreadNamePrefix("AsyncThread-");
        // Set the keep-alive time for extra threads
        executor.setKeepAliveSeconds(60);
        executor.initialize();
        return executor;
    }
}
