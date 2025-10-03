package com.gdgchimbote.gemini.repository;

import com.gdgchimbote.gemini.document.PaymentDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentRepository extends MongoRepository<PaymentDocument, String> {
}
