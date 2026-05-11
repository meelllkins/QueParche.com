package com.queparche.infrastructure;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.queparche")
public class QueParchemApplication {

    public static void main(String[] args) {
        SpringApplication.run(QueParchemApplication.class, args);
    }
}
