package com.Project.Backend.Service;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OtpService {
    private final Map<String, OtpRecord> otpStorage = new ConcurrentHashMap<>();

    public String generateOtp(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000); // 6-digit OTP
        otpStorage.put(email, new OtpRecord(otp, Instant.now().plus(Duration.ofMinutes(5))));
        return otp;
    }

    public boolean validateOtp(String email, String inputOtp) {
        OtpRecord record = otpStorage.get(email);
        if (record == null) return false;
        if (Instant.now().isAfter(record.expiryTime())) return false;
        return record.otp().equals(inputOtp);
    }

    public void clearOtp(String email) {
        otpStorage.remove(email);
    }

    private record OtpRecord(String otp, Instant expiryTime) {}
}
