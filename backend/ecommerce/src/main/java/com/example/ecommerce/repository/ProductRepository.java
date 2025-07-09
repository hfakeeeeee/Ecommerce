package com.example.ecommerce.repository;

import com.example.ecommerce.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE LOWER(p.category) = LOWER(:category) ORDER BY p.createdAt DESC")
    List<Product> findByCategory(@Param("category") String category);
    
    @Query("SELECT p FROM Product p WHERE LOWER(p.category) = LOWER(:category) ORDER BY p.createdAt DESC")
    Page<Product> findByCategory(@Param("category") String category, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.price >= :minPrice AND p.price <= :maxPrice ORDER BY p.createdAt DESC")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE LOWER(p.category) = LOWER(:category) AND p.price >= :minPrice AND p.price <= :maxPrice ORDER BY p.createdAt DESC")
    Page<Product> findByCategoryAndPriceRange(@Param("category") String category, @Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, Pageable pageable);
    
    @Query("SELECT DISTINCT p.category FROM Product p ORDER BY p.category")
    List<String> findAllCategories();

    @Query("SELECT p FROM Product p ORDER BY p.createdAt DESC")
    Page<Product> findAllOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY p.createdAt DESC")
    Page<Product> searchProducts(@Param("query") String query, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND LOWER(p.category) = LOWER(:category) ORDER BY p.createdAt DESC")
    Page<Product> searchProductsByCategory(@Param("query") String query, @Param("category") String category, Pageable pageable);
} 