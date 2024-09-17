<!-- SPDX-License-Identifier: Apache-2.0 -->

# logger-service

This application subscribes to a [NATS] subject where the messages it receives are logs. The logs' destination is up to the user.

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Lumberjack
    participant Environment
    participant ElasticSearch
    participant Stdout
    participant NATS

    Lumberjack->>Environment: Read
    alt Startup
        alt STDOUT and ELASTIC unset or false
            Lumberjack->>Lumberjack: Throw fatal exception
        end

        opt
            activate ElasticSearch
            Note over Lumberjack,ElasticSearch: ELASTIC is set to true
            Lumberjack--> ElasticSearch: Configure pino-elasticsearch
        end

        opt
            activate Stdout          
            Note over Lumberjack,Stdout: STDOUT is set to true
            Lumberjack-->Stdout: Configure stdout
        end

        Lumberjack->>NATS: Subscribe to log subject
    end

    

    loop On each NATS message 
        NATS --) Lumberjack: Receive message
        par Send message to configured channels
            Lumberjack-> ElasticSearch: Send Log
        and 
            Lumberjack-> Stdout: Send Log
        end
    end
    deactivate Stdout
    deactivate ElasticSearch
```
