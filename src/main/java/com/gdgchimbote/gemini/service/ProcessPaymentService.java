package com.gdgchimbote.gemini.service;

import com.gdgchimbote.gemini.document.PaymentDocument;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProcessPaymentService {
    void process(MultipartFile multipartFile);

    List<PaymentDocument> findAll();
}
