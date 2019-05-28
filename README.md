### Program question

Program question result for dcard

### Prerequisites

A redis server

### Build up

 1. Modify config.json to set redis connect information
    ```
    {
        "redis":
            {
                "host": "127.0.0.1",
                "port": "6379"
            }
    }
    ```
 2. run ```yarn``` or ```npm i```

 3. ```npm start```

### Docker

 1. You can start this project use ```docker-compose up --build```

### How to test
 1. Modify config.json to set redis connect information
    ```
    {
        "redis":
            {
                "host": "127.0.0.1",
                "port": "6379"
            }
    }
    ```
 2. run ```yarn``` or ```npm i```
 3. ```npm test```