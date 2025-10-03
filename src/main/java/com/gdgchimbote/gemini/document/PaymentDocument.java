package com.gdgchimbote.gemini.document;

import com.gdgchimbote.gemini.dto.PaymentInfoResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.ZoneId;


@Document(collection = "payment")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PaymentDocument {

    @Id
    private String paymentId;
    private String amount;          // e.g. "S/ 100.00"
    private String dateTime;        // e.g. "2025-09-22 14:40"
    private String recipient;       // e.g. "Ruddy K. Gutarra P."
    private String operationCode;   // e.g. "16008400"
    private String phoneNumber;     // e.g. "981991049"
    private String destination;     // e.g. "Yape" or "Plin"
    private String status;
    private LocalDateTime createdAt;

    public static PaymentDocument create(PaymentInfoResponse response){
        LocalDateTime now = LocalDateTime.now(ZoneId.of("America/Lima"));
        return new PaymentDocument(null, response.getAmount(), response.getDateTime(), response.getRecipient(),
                response.getOperationCode(), response.getPhoneNumber(), response.getDestination(), "PROCESADO", now);
    }
}
