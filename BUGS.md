
## Bug Report Table

| ID | Title | Endpoint | Severity | Steps to Reproduce | Expected Result | Actual Result | Evidence |
|----|-------|----------|----------|---------------------|------------------|----------------|--------|
| BUG-01 | Unsupported method |POST /carts/user/5      | Low       |1. Open postman 2.Input the API URL "https://dummyjson.com/carts/user/5" 3. Select the post methode and clickon the send button 4. Observe the response body to see that the API call returns an HTML error page instead of a consistent JSON error body | The response body suppose to return JSON Error format accordingly       | API call returned HTLM body          | https://drive.google.com/file/d/17JM7W_LSomCpxtvF1ZGuyeZJ0D1IUVqv/view?usp=sharing |
| BUG-02 | Unsupported method | POST /carts/users/5      | Low       |1. Open postman 2.Input the API URL "https://dummyjson.com/docs/carts#carts-user/5" 3. Select the post methode and clickon the send button 4. Observe the response body to see that the API call returns an HTML error page instead of a consistent JSON error body | The response body suppose to return JSON Error format accordingly       | API call returned HTLM body          | https://drive.google.com/file/d/17JM7W_LSomCpxtvF1ZGuyeZJ0D1IUVqv/view?usp=sharing |

