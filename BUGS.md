
## Bug Report Table

| ID | Title | Endpoint | Severity | Steps to Reproduce | Expected Result | Actual Result | Evidence |
|----|-------|----------|----------|---------------------|------------------|----------------|--------|
| BUG-01 | No bugs found | GET /products/categories      | Nil       | Nil                 | API response accordingly       | API responds matches expected behaviour            | getAllProductCategories-reports/newman-report.html, getAllProductCategories-reports/newman-report.json |
## Bug Report Table

| ID | Title | Endpoint | Severity | Steps to Reproduce | Expected Result | Actual Result | Evidence |
|----|-------|----------|----------|---------------------|------------------|----------------|--------|
| BUG-01 | No bugs found | GET /products/categories | Nil | Nil | API response accordingly | API responds matches expected behaviour | getAllProductCategories-reports/newman-report.html, getAllProductCategories-reports/newman-report.json |
| BUG-001 | Invalid price data type is accepted by Update Product API | PUT /products/1 | Medium | Send PUT request with `"price":"invalid-price"` | API should reject invalid price type if price must be numeric | API returns 200 OK and accepts `"invalid-price"` as price | Postman response + failed "Price should be a number" assertion |
| BUG-002 | Negative price is accepted by Update Product API | PUT /products/1 | Medium | Send PUT request with `"price":-80` | API should reject negative price if price must be non-negative | API returns 200 OK and accepts `-80` as price | Postman response + failed negative-price assertions |