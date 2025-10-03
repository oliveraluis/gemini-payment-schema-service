package com.gdgchimbote.gemini.controller;

import com.gdgchimbote.gemini.document.PaymentDocument;
import com.gdgchimbote.gemini.service.ProcessPaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final ProcessPaymentService processPaymentService;

    @PostMapping
    public ResponseEntity<Void> processData(@RequestParam("file") MultipartFile file) {
        log.info("Process data service execution");
        processPaymentService.process(file);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<PaymentDocument>> findAll() {
        log.info("Find all payment document list");
        List<PaymentDocument> paymentDocumentList = processPaymentService.findAll();
        return ResponseEntity.ok(paymentDocumentList);
    }


}
