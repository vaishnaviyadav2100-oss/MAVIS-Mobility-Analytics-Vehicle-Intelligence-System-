package com.mavis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MavisApplication {

    public static void main(String[] args) {
        SpringApplication.run(MavisApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚗 MAVIS Backend is LIVE on http://localhost:8080");
        System.out.println("API Base URL: http://localhost:8080/api");
        System.out.println("=================================================");
    }
}
