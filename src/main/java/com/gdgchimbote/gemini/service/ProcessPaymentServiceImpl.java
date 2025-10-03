package com.gdgchimbote.gemini.service;

import com.gdgchimbote.gemini.document.PaymentDocument;
import com.gdgchimbote.gemini.dto.PaymentInfoResponse;
import com.gdgchimbote.gemini.repository.PaymentRepository;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import com.google.genai.types.Schema;
import com.google.genai.types.ThinkingConfig;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProcessPaymentServiceImpl implements ProcessPaymentService{

    @Value("${gemini.ia.api.key}")
    private String apiKey;

    @Value("${gemini.ia.model}")
    private String model;

    private final PaymentRepository paymentRepository;
    @Override
    public void process(MultipartFile file) {
        try {
            Client client = Client
                    .builder()
                    .apiKey(this.apiKey)
                    .build();

            var bytes = file.getBytes();
            var contentType = file.getContentType();

            Content content = Content.builder()
                    .parts(List.of(Part.fromBytes(bytes, contentType)))
                    .build();

            Schema finalSchema = PaymentInfoResponse.getGeminiSchema();

            ThinkingConfig thinkingConfig = ThinkingConfig
                    .builder()
                    .thinkingBudget(0)
                    .build();

            GenerateContentConfig contentConfig = GenerateContentConfig.builder()
                    .thinkingConfig(thinkingConfig)
                    .responseSchema(finalSchema)
                    .responseMimeType(MimeTypeUtils.APPLICATION_JSON_VALUE)
                    .build();
            GenerateContentResponse response = client.models.generateContent(
                    this.model,
                    content,
                    contentConfig
            );

            PaymentDocument paymentDocument = Optional.ofNullable(response.text())
                    .map(this::convertJsonToPaymentInfo)
                    .map(PaymentDocument::create)
                    .map(paymentRepository::save)
                    .orElse(null);

            log.info("Payment document created: {}", paymentDocument);
        } catch (IOException exception) {
            log.error(exception.getLocalizedMessage());
        }
    }

    @Override
    public List<PaymentDocument> findAll() {
        return paymentRepository.findAll();
    }

    public PaymentInfoResponse convertJsonToPaymentInfo(String jsonString) throws JsonSyntaxException {
        Gson gson = new Gson();
        if (jsonString == null || jsonString.trim().isEmpty()) {
            throw new IllegalArgumentException("El String JSON no puede ser nulo o vacío.");
        }

        return gson.fromJson(jsonString, PaymentInfoResponse.class);
    }
}
