package com.example.ecommerce.repository;

import com.example.ecommerce.model.ChatMessage;
import com.example.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByUserOrderByTimestampDesc(User user);
    List<ChatMessage> findByUserOrderByTimestampAsc(User user);
} 