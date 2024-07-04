package org.chmonya.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobHttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

@Service
public class BlobStorageService {

    private final BlobServiceClient blobServiceClient;
    private final BlobContainerClient blobContainerClient;

    @Autowired
    public BlobStorageService(BlobServiceClient blobServiceClient, BlobContainerClient blobContainerClient) {
        this.blobServiceClient = blobServiceClient;
        this.blobContainerClient = blobContainerClient;
    }

    // Method to upload text as a blob
    public void uploadBlob(String blobName, String data) {
        BlobClient blobClient = blobContainerClient.getBlobClient(blobName);
        byte[] bytes = data.getBytes(StandardCharsets.UTF_8);
        blobClient.upload(new ByteArrayInputStream(bytes), bytes.length, false);
    }

    // Method to download a text blob
    public String downloadTextBlob(String blobName) throws Exception {
        BlobClient blobClient = blobContainerClient.getBlobClient(blobName);
        System.out.println("successfully getting blob");
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        blobClient.download(outputStream);
        System.out.println("successfully downloading blob");
        return new String(outputStream.toByteArray(), StandardCharsets.UTF_8);
    }

    // Method to update a text blob
    public void updateBlob(String blobName, String data) {
        BlobClient blobClient = blobContainerClient.getBlobClient(blobName);
        byte[] bytes = data.getBytes(StandardCharsets.UTF_8);
        blobClient.upload(new ByteArrayInputStream(bytes), bytes.length, true);
    }

    // Method to delete a blob
    public void deleteBlob(String blobName) {
        BlobClient blobClient = blobContainerClient.getBlobClient(blobName);
        blobClient.delete();
    }

    // Method to set blob HTTP headers
    public void setBlobHttpHeaders(String blobName, BlobHttpHeaders headers) {
        BlobClient blobClient = blobContainerClient.getBlobClient(blobName);
        blobClient.setHttpHeaders(headers);
    }
}
