## CHANGELOG

### 0.5.4

* fix bug if secret not correct, server raise error and exit
* fix cli client usage, options should should in front of the url param 
* bug fix : begin request url: port=4821 server stops

### 0.5.2

* http get support headers
* bug fix ensureRequest's retry

### 0.5.0

* client response status
* export Response in index
* wrapper request with retry and error handler for DrumstickClient

### 0.4.0

* cmd line for start server
* cmd line for client
* update readme for start server 
* update readme for client usage

### 0.3.1

* fix bug response not in order in one request
* fix bug throw exception when client ended event (server close) 
* fix bug server request `--no-check-certificate`

### 0.3.0

* multi requests in one connection
* lint-stage support

### 0.2.0

* config travis ci to run unittest
* config travis ci to deploy to npm

### 0.1.0

init
