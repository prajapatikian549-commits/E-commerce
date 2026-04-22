package org.example.orders;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    /** Use before mapping to {@link OrderResponse} outside a long-running persistence context. */
    @Query("SELECT DISTINCT o FROM OrderEntity o LEFT JOIN FETCH o.lines WHERE o.id = :id")
    Optional<OrderEntity> findWithLinesById(@Param("id") Long id);
}
