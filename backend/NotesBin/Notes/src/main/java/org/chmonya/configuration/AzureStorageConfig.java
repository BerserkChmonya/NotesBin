package org.chmonya.configuration;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AzureStorageConfig {
    @Value("${azure.storage.account-url}")
    private String accountURl;

    @Value("${azure.storage.sas-token}")
    private String sasToken;

    @Bean
    public BlobServiceClient getBlobServiceClient() {
        return new BlobServiceClientBuilder()
        .endpoint(accountURl)
        .sasToken(sasToken)
        .buildClient();
    }

    @Bean
    public BlobContainerClient getBlobContainerClient() {
        return getBlobServiceClient().getBlobContainerClient("nb-container");
    }
}
