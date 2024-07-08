package org.chmonya.user.service;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class EmailService {
    @Value("${mailgun.api.key}")
    private String mailGunApiKey;
    @Value("${mailgun.domain}")
    private String mailGunDomain;

    public boolean validateEmailAddress(String email) throws Exception{
        HttpResponse<JsonNode> request = Unirest.get("https://api.mailgun.net/v3/address/validate")
                .queryString("address", email)
                .basicAuth("api", mailGunApiKey)
                .asJson();
        System.out.println(request.getBody().getObject());

        return request.getBody().getObject().getBoolean("is_valid");
    }

    public void sendVerificationEmail(String to, String token) throws Exception {
        String verificationUrl = "http://localhost:3000/verify?token=" + token;
        System.out.println(verificationUrl);

        HttpResponse<JsonNode> request = Unirest.post("https://api.mailgun.net/v3/" + mailGunDomain + "/messages")
                .basicAuth("api", mailGunApiKey)
                .field("from", "Excited User <USER@sandbox5e90a657244040cc87c85e7278912058.mailgun.org>")
                .field("to", to)
                .field("subject", "Email Verification")
                .field("text", "To verify your email, click the following link: " + verificationUrl)
                .asJson();

        if (request.getStatus() != 200) {
            throw new Exception("Failed to send email");
        }
    }

    public void sendPasswordResetEmail(String to, String token) throws Exception {
        String resetUrl = "http://localhost:3000/reset?token=" + token;
        System.out.println(resetUrl);

        HttpResponse<JsonNode> request = Unirest.post("https://api.mailgun.net/v3/" + mailGunDomain + "/messages")
                .basicAuth("api", mailGunApiKey)
                .field("from", "Excited User <USER@sandbox5e90a657244040cc87c85e7278912058.mailgun.org>")
                .field("to", to)
                .field("subject", "Password Reset")
                .field("text", "To reset your password, click the following link: " + resetUrl)
                .asJson();

        if (request.getStatus() != 200) {
            throw new Exception("Failed to send email");
        }
    }
}
