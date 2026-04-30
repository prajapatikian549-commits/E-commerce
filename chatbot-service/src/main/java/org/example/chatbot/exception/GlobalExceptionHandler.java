package org.example.chatbot.exception;

import org.example.chatbot.controller.ChatController;
import org.example.chatbot.dto.ChatResponse;
import org.example.chatbot.dto.ReplySource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice(assignableTypes = ChatController.class)
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ChatResponse> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ChatResponse(msg, ReplySource.FALLBACK));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ChatResponse> handleUnexpected(Exception ex) {
        log.error("Unhandled error in chatbot-service", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ChatResponse("Something went wrong. Please try again later.", ReplySource.FALLBACK));
    }
}
