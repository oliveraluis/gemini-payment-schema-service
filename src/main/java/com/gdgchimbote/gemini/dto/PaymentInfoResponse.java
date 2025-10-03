package com.gdgchimbote.gemini.dto;

import com.google.genai.types.Schema;
import com.google.genai.types.Type;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@AllArgsConstructor
public class PaymentInfoResponse {
    private String amount;          // e.g. "S/ 100.00"
    private String dateTime;        // e.g. "2025-09-22 14:40"
    private String recipient;       // e.g. "Ruddy K. Gutarra P."
    private String operationCode;   // e.g. "16008400"
    private String phoneNumber;     // e.g. "981991049"
    private String destination;     // e.g. "Yape" or "Plin"

    /**
     * Genera y devuelve el objeto Schema de Google AI Platform,
     * definiendo explícitamente la estructura JSON esperada de Gemini.
     * * @return El Schema configurado.
     */
    public static Schema getGeminiSchema() {

        Map<String, Schema> paymentProperties = new HashMap<>();

        // Definición explícita de cada propiedad: Nombre del campo, Tipo y Descripción (Prompt)

        paymentProperties.put("amount",
                Schema.builder()
                        .type(Type.Known.STRING)
                        .description("Monto total de la transacción, incluyendo la divisa y el formato (ej: 'S/ 135.00').")
                        .build());

        paymentProperties.put("dateTime",
                Schema.builder()
                        .type(Type.Known.STRING)
                        .description("Fecha y hora de la transacción combinadas en un solo string (ej: '2025-09-22 14:40').")
                        .build());

        paymentProperties.put("recipient",
                Schema.builder()
                        .type(Type.Known.STRING)
                        .description("Nombre completo y claro del destinatario del pago.")
                        .build());

        paymentProperties.put("operationCode",
                Schema.builder()
                        .type(Type.Known.STRING)
                        .description("El código, número de operación o referencia única de la transacción.")
                        .build());

        paymentProperties.put("phoneNumber",
                Schema.builder()
                        .type(Type.Known.STRING)
                        .description("Número de teléfono completo del receptor o emisor. Si solo se ven los últimos dígitos, inclúyelos (ej: '*** *** 049').")
                        .build());

        paymentProperties.put("destination",
                Schema.builder()
                        .type(Type.Known.STRING)
                        .description("Plataforma de pago utilizada (debe ser 'Yape' o 'Plin').")
                        .build());


        return Schema.builder()
                .type(Type.Known.OBJECT)
                .properties(paymentProperties)
                .propertyOrdering(List.of(
                        "amount", "dateTime", "recipient",
                        "operationCode", "phoneNumber", "destination"
                ))
                .build();
    }// e.g. "successful", "pending", "failed"
}
