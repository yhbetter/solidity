package com.dapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DappApplication {

    public static void main(String[] args) {
        SpringApplication.run(DappApplication.class, args);
    }
}
