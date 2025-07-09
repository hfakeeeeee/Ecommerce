package com.example.ecommerce.controller;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:5173", "http://192.168.76.75:5173", "http://localhost:80"}, allowCredentials = "true")
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String query) {
        Pageable pageable = PageRequest.of(page, size);
        
        if (query != null && !query.trim().isEmpty()) {
            Page<Product> products = productService.searchProducts(query, pageable);
            return ResponseEntity.ok(products);
        } else if (minPrice != null && maxPrice != null) {
            Page<Product> products = productService.getProductsByPriceRange(minPrice, maxPrice, pageable);
            return ResponseEntity.ok(products);
        } else {
            Page<Product> products = productService.getAllProductsPaginated(pageable);
            return ResponseEntity.ok(products);
        }
    }

    @GetMapping("/all")
    public List<Product> getAllProductsUnpaginated() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/stock")
    public ResponseEntity<Map<String, Object>> getProductStock(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        if (product.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("productId", id);
            response.put("productName", product.get().getName());
            response.put("stock", product.get().getStock());
            response.put("available", product.get().getStock() > 0);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<Product>> getProductsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String query) {
        Pageable pageable = PageRequest.of(page, size);
        
        if (query != null && !query.trim().isEmpty()) {
            Page<Product> products = productService.searchProductsByCategory(query, category, pageable);
            return ResponseEntity.ok(products);
        } else if (minPrice != null && maxPrice != null) {
            Page<Product> products = productService.getProductsByCategoryAndPriceRange(category, minPrice, maxPrice, pageable);
            return ResponseEntity.ok(products);
        } else {
            Page<Product> products = productService.getProductsByCategoryPaginated(category, pageable);
            return ResponseEntity.ok(products);
        }
    }

    @GetMapping("/category/{category}/all")
    public List<Product> getProductsByCategoryUnpaginated(@PathVariable String category) {
        return productService.getProductsByCategory(category);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = productService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.getProductById(id)
                .map(existingProduct -> {
                    product.setId(id);
                    return ResponseEntity.ok(productService.saveProduct(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productService.getProductById(id).isPresent()) {
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getAllProductsForAdmin() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping("/admin/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            Product savedProduct = productService.saveProduct(product);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add product: " + e.getMessage());
        }
    }

    @PutMapping("/admin/edit/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            Optional<Product> existingProduct = productService.getProductById(id);
            if (existingProduct.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            product.setId(id);
            Product updatedProduct = productService.saveProduct(product);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update product: " + e.getMessage());
        }
    }

    /**
     * Get all products, sorted by newest first (createdAt descending).
     */
} 