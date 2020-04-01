Example of how to do csrf

Take a note that in csrf.js checks are done to see if the code is running in browser or server. The csrf generation code is added only on the server.

To see bundle sizes detail run:

```
ANALYZE=true yarn build
```

with the optimization next will report 72.1 kB first load for the login page vs 182 kB without it.



The only problem is handling client side navigation when initially coming from a page that doesn't use csf. Since the page is rendered client side, there is no csrf cookie nor token, so the validation fails.

To fix this, if page is rendered client side, it does an api call to fetch a csrf token, which also includes the secret cookie.
