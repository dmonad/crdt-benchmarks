
# CRDT benchmarks

> A collection of reproducible benchmarks. *PRs are welcome.*

```sh
npm i && npm start
```

## Benchmarks

#### B1: No conflicts

Simulate two clients. One client modifies a text object and sends update messages to the other client. We measure the time to perform the task (`time`), the amount of data exchanged (`updateSize`), the time it takes to encode the document after the task is performed  (`encodeTime`), the size of the encoded document (`docSize`) and the time to parse the encoded document (`parseTime`).

#### B2: Two users producing conflicts

Simulate two clients. Both start with a synced text object containing 100 characters. Both clients modify the text object in a single transaction and then send their changes to the other client. We measure the time to sync concurrent changes into a single client (`time`), the size of the update messages (`updateSize`), the time it takes to encode the document after the task is performed  (`encodeTime`), the size of the encoded document (`docSize`) and the time to parse the encoded document (`parseTime`).

#### B3: Many conflicts

Simulate `√N` concurrent actions. We measure the time to perform the task
and sync all clients (`time`), the size of the update messages (`updateSize`), the time it takes to encode the document after the task is performed  (`encodeTime`), the size of the encoded document (`docSize`) and the time to parse the encoded document (`parseTime`). The logarithm of `N` was
chosen because `√N` concurrent actions may result in up to `√N^2 - 1`
conflicts (apply action 1: 0 conlict; apply action2: 1 conflict, apply action 2: 2 conflicts, ..).

### Results

** Preliminary benchmark results for [a RON-based CRDT](https://github.com/gritzko/ron) (written in C++) are posted [in this thread](https://github.com/dmonad/crdt-benchmarks/issues/3).

| N = 3000 | Yjs | automerge |
| :- | -: | -: |
|Bundle size                                                               |     53740 bytes |    297282 bytes |
|Bundle size (gzipped)                                                     |     16527 bytes |     74276 bytes |
|[B1.1] Append N characters (time)                                         |          108 ms |        19543 ms |
|[B1.1] Append N characters (avgUpdateSize)                                |        20 bytes |       107 bytes |
|[B1.1] Append N characters (encodeTime)                                   |            1 ms |          247 ms |
|[B1.1] Append N characters (docSize)                                      |      3018 bytes |      3280 bytes |
|[B1.1] Append N characters (parseTime)                                    |            0 ms |         1343 ms |
|[B1.2] Insert string of length N (time)                                   |            3 ms |         1207 ms |
|[B1.2] Insert string of length N (avgUpdateSize)                          |      3018 bytes |      3116 bytes |
|[B1.2] Insert string of length N (encodeTime)                             |            0 ms |           72 ms |
|[B1.2] Insert string of length N (docSize)                                |      3018 bytes |      3178 bytes |
|[B1.2] Insert string of length N (parseTime)                              |            0 ms |          365 ms |
|[B1.3] Prepend N characters (time)                                        |           93 ms |        37482 ms |
|[B1.3] Prepend N characters (avgUpdateSize)                               |        20 bytes |       106 bytes |
|[B1.3] Prepend N characters (encodeTime)                                  |            5 ms |          226 ms |
|[B1.3] Prepend N characters (docSize)                                     |     29881 bytes |      3351 bytes |
|[B1.3] Prepend N characters (parseTime)                                   |           10 ms |        19395 ms |
|[B1.4] Insert N characters at random positions (time)                     |          114 ms |        20807 ms |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |        27 bytes |       107 bytes |
|[B1.4] Insert N characters at random positions (encodeTime)               |            1 ms |          219 ms |
|[B1.4] Insert N characters at random positions (docSize)                  |     49840 bytes |     14231 bytes |
|[B1.4] Insert N characters at random positions (parseTime)                |            9 ms |         1531 ms |
|[B1.5] Insert N words at random positions (time)                          |          130 ms |        40132 ms |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |        32 bytes |       116 bytes |
|[B1.5] Insert N words at random positions (encodeTime)                    |            2 ms |          401 ms |
|[B1.5] Insert N words at random positions (docSize)                       |     99896 bytes |     64664 bytes |
|[B1.5] Insert N words at random positions (parseTime)                     |           18 ms |         3759 ms |
|[B1.6] Insert string, then delete it (time)                               |            3 ms |         3336 ms |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |      3029 bytes |      3145 bytes |
|[B1.6] Insert string, then delete it (encodeTime)                         |            0 ms |          109 ms |
|[B1.6] Insert string, then delete it (docSize)                            |        27 bytes |      3193 bytes |
|[B1.6] Insert string, then delete it (parseTime)                          |            0 ms |          449 ms |
|[B1.7] Insert/Delete strings at random positions (time)                   |          159 ms |        28281 ms |
|[B1.7] Insert/Delete strings at random positions (avgUpdateSize)          |        23 bytes |       119 bytes |
|[B1.7] Insert/Delete strings at random positions (encodeTime)             |            6 ms |          493 ms |
|[B1.7] Insert/Delete strings at random positions (docSize)                |     47706 bytes |     41636 bytes |
|[B1.7] Insert/Delete strings at random positions (parseTime)              |           18 ms |         2106 ms |
|[B1.8] Append N numbers (time)                                            |          113 ms |        74483 ms |
|[B1.8] Append N numbers (avgUpdateSize)                                   |        25 bytes |       111 bytes |
|[B1.8] Append N numbers (encodeTime)                                      |            3 ms |          328 ms |
|[B1.8] Append N numbers (docSize)                                         |     17844 bytes |     16371 bytes |
|[B1.8] Append N numbers (parseTime)                                       |            0 ms |         1292 ms |
|[B1.9] Insert Array of N numbers (time)                                   |            7 ms |         1183 ms |
|[B1.9] Insert Array of N numbers (avgUpdateSize)                          |     17812 bytes |     16096 bytes |
|[B1.9] Insert Array of N numbers (encodeTime)                             |            4 ms |           55 ms |
|[B1.9] Insert Array of N numbers (docSize)                                |     17812 bytes |     16159 bytes |
|[B1.9] Insert Array of N numbers (parseTime)                              |            1 ms |          341 ms |
|[B1.10] Prepend N numbers (time)                                          |           96 ms |       103385 ms |
|[B1.10] Prepend N numbers (avgUpdateSize)                                 |        25 bytes |       110 bytes |
|[B1.10] Prepend N numbers (encodeTime)                                    |            3 ms |          292 ms |
|[B1.10] Prepend N numbers (docSize)                                       |     44709 bytes |     16439 bytes |
|[B1.10] Prepend N numbers (parseTime)                                     |            9 ms |        19679 ms |
|[B1.11] Insert N numbers at random positions (time)                       |          140 ms |        79276 ms |
|[B1.11] Insert N numbers at random positions (avgUpdateSize)              |        32 bytes |       111 bytes |
|[B1.11] Insert N numbers at random positions (encodeTime)                 |            7 ms |          313 ms |
|[B1.11] Insert N numbers at random positions (docSize)                    |     64740 bytes |     27325 bytes |
|[B1.11] Insert N numbers at random positions (parseTime)                  |           12 ms |         1472 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (time)           |            2 ms |         2399 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (updateSize)     |      6036 bytes |      6251 bytes |
|[B2.1] Cuncurrently insert string of length N at index 0 (encodeTime)     |            2 ms |           86 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (docSize)        |      6142 bytes |      6381 bytes |
|[B2.1] Cuncurrently insert string of length N at index 0 (parseTime)      |            0 ms |          666 ms |
|[B2.2] Cuncurrently insert N characters at random positions (time)        |          164 ms |        16928 ms |
|[B2.2] Cuncurrently insert N characters at random positions (updateSize)  |     99479 bytes |     11817 bytes |
|[B2.2] Cuncurrently insert N characters at random positions (encodeTime)  |            3 ms |           93 ms |
|[B2.2] Cuncurrently insert N characters at random positions (docSize)     |    100377 bytes |     17790 bytes |
|[B2.2] Cuncurrently insert N characters at random positions (parseTime)   |           37 ms |        20187 ms |
|[B2.3] Cuncurrently insert N words at random positions (time)             |          190 ms |        68588 ms |
|[B2.3] Cuncurrently insert N words at random positions (updateSize)       |    198279 bytes |     81005 bytes |
|[B2.3] Cuncurrently insert N words at random positions (encodeTime)       |            3 ms |          487 ms |
|[B2.3] Cuncurrently insert N words at random positions (docSize)          |    199057 bytes |    127871 bytes |
|[B2.3] Cuncurrently insert N words at random positions (parseTime)        |           34 ms |        27179 ms |
|[B2.4] Cuncurrently insert & delete (time)                                |          617 ms |       175027 ms |
|[B2.4] Cuncurrently insert & delete (updateSize)                          |    300952 bytes |    196343 bytes |
|[B2.4] Cuncurrently insert & delete (encodeTime)                          |            7 ms |          919 ms |
|[B2.4] Cuncurrently insert & delete (docSize)                             |    301608 bytes |    208930 bytes |
|[B2.4] Cuncurrently insert & delete (parseTime)                           |           63 ms |         7778 ms |
|[B3.1] √N clients concurrently set number in Map (time)                   |            7 ms |           31 ms |
|[B3.1] √N clients concurrently set number in Map (updateSize)             |      1078 bytes |      3240 bytes |
|[B3.1] √N clients concurrently set number in Map (encodeTime)             |            0 ms |            5 ms |
|[B3.1] √N clients concurrently set number in Map (docSize)                |      1288 bytes |      2886 bytes |
|[B3.1] √N clients concurrently set number in Map (parseTime)              |            1 ms |           28 ms |
|[B3.2] √N clients concurrently set Object in Map (time)                   |            8 ms |           53 ms |
|[B3.2] √N clients concurrently set Object in Map (updateSize)             |      3167 bytes |      5066 bytes |
|[B3.2] √N clients concurrently set Object in Map (encodeTime)             |            0 ms |            6 ms |
|[B3.2] √N clients concurrently set Object in Map (docSize)                |      1431 bytes |      4305 bytes |
|[B3.2] √N clients concurrently set Object in Map (parseTime)              |            1 ms |           36 ms |
|[B3.3] √N clients concurrently set String in Map (time)                   |            2 ms |           30 ms |
|[B3.3] √N clients concurrently set String in Map (updateSize)             |      6369 bytes |      8576 bytes |
|[B3.3] √N clients concurrently set String in Map (encodeTime)             |            0 ms |           11 ms |
|[B3.3] √N clients concurrently set String in Map (docSize)                |      1340 bytes |      8174 bytes |
|[B3.3] √N clients concurrently set String in Map (parseTime)              |            0 ms |           28 ms |
|[B3.4] √N clients concurrently insert text in Array (time)                |            4 ms |           29 ms |
|[B3.4] √N clients concurrently insert text in Array (updateSize)          |      1173 bytes |      6561 bytes |
|[B3.4] √N clients concurrently insert text in Array (encodeTime)          |            0 ms |            6 ms |
|[B3.4] √N clients concurrently insert text in Array (docSize)             |      1067 bytes |      3004 bytes |
|[B3.4] √N clients concurrently insert text in Array (parseTime)           |            1 ms |           44 ms |

| N = 60000 | Yjs | automerge |
| :- | -: | -: |
|[B1.1] Append N characters (time)                                         |          770 ms |                 |
|[B1.1] Append N characters (avgUpdateSize)                                |        21 bytes |                 |
|[B1.1] Append N characters (docSize)                                      |     60019 bytes |                 |
|[B1.1] Append N characters (parseTime)                                    |            2 ms |                 |
|[B1.1] Append N characters                                                |                 |        skipping |
|[B1.2] Insert string of length N (time)                                   |            7 ms |                 |
|[B1.2] Insert string of length N (avgUpdateSize)                          |     60019 bytes |                 |
|[B1.2] Insert string of length N (docSize)                                |     60019 bytes |                 |
|[B1.2] Insert string of length N (parseTime)                              |            1 ms |                 |
|[B1.2] Insert string of length N                                          |                 |        skipping |
|[B1.3] Prepend N characters (time)                                        |          518 ms |                 |
|[B1.3] Prepend N characters (avgUpdateSize)                               |        21 bytes |                 |
|[B1.3] Prepend N characters (docSize)                                     |    643497 bytes |                 |
|[B1.3] Prepend N characters (parseTime)                                   |           74 ms |                 |
|[B1.3] Prepend N characters                                               |                 |        skipping |
|[B1.4] Insert N characters at random positions (time)                     |        15081 ms |                 |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |        28 bytes |                 |
|[B1.4] Insert N characters at random positions (docSize)                  |   1062685 bytes |                 |
|[B1.4] Insert N characters at random positions (parseTime)                |          187 ms |                 |
|[B1.4] Insert N characters at random positions                            |                 |        skipping |
|[B1.5] Insert N words at random positions (time)                          |        49360 ms |                 |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |        35 bytes |                 |
|[B1.5] Insert N words at random positions (docSize)                       |   2167365 bytes |                 |
|[B1.5] Insert N words at random positions (parseTime)                     |          368 ms |                 |
|[B1.5] Insert N words at random positions                                 |                 |        skipping |
|[B1.6] Insert string, then delete it (time)                               |            5 ms |                 |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |     60031 bytes |                 |
|[B1.6] Insert string, then delete it (docSize)                            |        29 bytes |                 |
|[B1.6] Insert string, then delete it (parseTime)                          |            0 ms |                 |
|[B1.6] Insert string, then delete it                                      |                 |        skipping |
|[B1.7] Insert/Delete strings at random positions (time)                   |        27750 ms |                 |
|[B1.7] Insert/Delete strings at random positions (avgUpdateSize)          |        26 bytes |                 |
|[B1.7] Insert/Delete strings at random positions (docSize)                |   1084522 bytes |                 |
|[B1.7] Insert/Delete strings at random positions (parseTime)              |          252 ms |                 |
|[B1.7] Insert/Delete strings at random positions                          |                 |        skipping |
|[B1.8] Append N numbers (time)                                            |        14110 ms |                 |
|[B1.8] Append N numbers (avgUpdateSize)                                   |        26 bytes |                 |
|[B1.8] Append N numbers (docSize)                                         |    356209 bytes |                 |
|[B1.8] Append N numbers (parseTime)                                       |            2 ms |                 |
|[B1.8] Append N numbers                                                   |                 |        skipping |
|[B1.9] Insert Array of N numbers (time)                                   |            7 ms |                 |
|[B1.9] Insert Array of N numbers (avgUpdateSize)                          |    356267 bytes |                 |
|[B1.9] Insert Array of N numbers (docSize)                                |    356267 bytes |                 |
|[B1.9] Insert Array of N numbers (parseTime)                              |            2 ms |                 |
|[B1.9] Insert Array of N numbers                                          |                 |        skipping |
|[B1.10] Prepend N numbers (time)                                          |          504 ms |                 |
|[B1.10] Prepend N numbers (avgUpdateSize)                                 |        26 bytes |                 |
|[B1.10] Prepend N numbers (docSize)                                       |    939801 bytes |                 |
|[B1.10] Prepend N numbers (parseTime)                                     |          126 ms |                 |
|[B1.10] Prepend N numbers                                                 |                 |        skipping |
|[B1.11] Insert N numbers at random positions (time)                       |        23850 ms |                 |
|[B1.11] Insert N numbers at random positions (avgUpdateSize)              |        33 bytes |                 |
|[B1.11] Insert N numbers at random positions (docSize)                    |   1358956 bytes |                 |
|[B1.11] Insert N numbers at random positions (parseTime)                  |          127 ms |                 |
|[B1.11] Insert N numbers at random positions                              |                 |        skipping |
|[B2.1] Cuncurrently insert string of length N at index 0 (time)           |            7 ms |                 |
|[B2.1] Cuncurrently insert string of length N at index 0 (updateSize)     |    120038 bytes |                 |
|[B2.1] Cuncurrently insert string of length N at index 0 (docSize)        |    120144 bytes |                 |
|[B2.1] Cuncurrently insert string of length N at index 0 (parseTime)      |            3 ms |                 |
|[B2.1] Cuncurrently insert string of length N at index 0                  |                 |        skipping |
|[B2.2] Cuncurrently insert N characters at random positions (time)        |        36487 ms |                 |
|[B2.2] Cuncurrently insert N characters at random positions (updateSize)  |   2124594 bytes |                 |
|[B2.2] Cuncurrently insert N characters at random positions (docSize)     |   2125492 bytes |                 |
|[B2.2] Cuncurrently insert N characters at random positions (parseTime)   |          307 ms |                 |
|[B2.2] Cuncurrently insert N characters at random positions               |                 |        skipping |
|[B2.3] Cuncurrently insert N words at random positions (time)             |       100991 ms |                 |
|[B2.3] Cuncurrently insert N words at random positions (updateSize)       |   4330443 bytes |                 |
|[B2.3] Cuncurrently insert N words at random positions (docSize)          |   4331277 bytes |                 |
|[B2.3] Cuncurrently insert N words at random positions (parseTime)        |          484 ms |                 |
|[B2.3] Cuncurrently insert N words at random positions                    |                 |        skipping |
|[B2.4] Cuncurrently insert & delete (time)                                |       459120 ms |                 |
|[B2.4] Cuncurrently insert & delete (updateSize)                          |   6579239 bytes |                 |
|[B2.4] Cuncurrently insert & delete (docSize)                             |   6579958 bytes |                 |
|[B2.4] Cuncurrently insert & delete (parseTime)                           |         1094 ms |                 |
|[B2.4] Cuncurrently insert & delete                                       |                 |        skipping |
|[B3.1] √N clients concurrently set number in Map (time)                   |           22 ms |                 |
|[B3.1] √N clients concurrently set number in Map (updateSize)             |      5042 bytes |                 |
|[B3.1] √N clients concurrently set number in Map (docSize)                |      5819 bytes |                 |
|[B3.1] √N clients concurrently set number in Map (parseTime)              |           12 ms |                 |
|[B3.1] √N clients concurrently set number in Map                          |                 |        skipping |
|[B3.2] √N clients concurrently set Object in Map (time)                   |           31 ms |                 |
|[B3.2] √N clients concurrently set Object in Map (updateSize)             |     14503 bytes |                 |
|[B3.2] √N clients concurrently set Object in Map (docSize)                |      6361 bytes |                 |
|[B3.2] √N clients concurrently set Object in Map (parseTime)              |            6 ms |                 |
|[B3.2] √N clients concurrently set Object in Map                          |                 |        skipping |
|[B3.3] √N clients concurrently set String in Map (time)                   |           24 ms |                 |
|[B3.3] √N clients concurrently set String in Map (updateSize)             |    156875 bytes |                 |
|[B3.3] √N clients concurrently set String in Map (docSize)                |      6309 bytes |                 |
|[B3.3] √N clients concurrently set String in Map (parseTime)              |            6 ms |                 |
|[B3.3] √N clients concurrently set String in Map                          |                 |        skipping |
|[B3.4] √N clients concurrently insert text in Array (time)                |           21 ms |                 |
|[B3.4] √N clients concurrently insert text in Array (updateSize)          |      5487 bytes |                 |
|[B3.4] √N clients concurrently insert text in Array (docSize)             |      5002 bytes |                 |
|[B3.4] √N clients concurrently insert text in Array (parseTime)           |            4 ms |                 |
|[B3.4] √N clients concurrently insert text in Array                       |                 |        skipping |


## Development

Modify the `N` variable in `benchmarks/utils.js` to increase the difficulty.

```sh
npm run watch
node dist/benchmark.js
```

Now you can also open `benchmark.html` to run the benchmarks in the browser.

## License

[The MIT License](./LICENSE) © Kevin Jahns
