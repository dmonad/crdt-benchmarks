
# CRDT benchmarks

> A collection of reproducible benchmarks. *PRs are welcome.*

```sh
npm i && npm start
```

## Benchmarks

#### B1: No conflicts

Simulate two clients. One client modifies a text object and sends update messages to the other client. We measure the time to perform the task (`time`), the amount of data exchanged (`avgUpdateSize`), the size of the encoded document after the task is performed (`docSize`) and the time to parse the encoded document (`parseTime`).

#### B2: Two users producing conflicts

Simulate two clients. Both start with a synced text object containing 100 characters. Both clients modify the text object in a single transaction and then send their changes to the other client. We measure the time to sync concurrent changes into a single client (`time`), the size of the update messages (`updateSize`), the size of the encoded document after the task is performed (`docSize`) and the time to parse the encoded document (`parseTime`).

#### B3: Many conflicts

Simulate `√N` concurrent actions. We measure the time to perform the task
and sync all clients (`time`), the size of the update messages (`updateSize`),
the size of the encoded document after the task is performed (`docSize`), and
the time to parse the encoded document (`parseTime`). The logarithm of `N` was
chosen because `√N` concurrent actions may result in up to `√N^2 - 1`
conflicts (apply action 1: 0 conlict; apply action2: 1 conflict, apply action 2: 2 conflicts, ..).

### Results

** Preliminary benchmark results for [a RON-based CRDT](https://github.com/gritzko/ron) (written in C++) are posted [in this thread](https://github.com/dmonad/crdt-benchmarks/issues/3).

| N = 3000 | Yjs | automerge |
| :- | -: | -: |
|Bundle size                                                               |     53740 bytes |    259763 bytes |
|Bundle size (gzipped)                                                     |     16527 bytes |     61478 bytes |
|[B1.1] Append N characters (time)                                         |          107 ms |         1305 ms |
|[B1.1] Append N characters (avgUpdateSize)                                |        20 bytes |       326 bytes |
|[B1.1] Append N characters (docSize)                                      |      3018 bytes |   1078851 bytes |
|[B1.1] Append N characters (parseTime)                                    |            0 ms |          348 ms |
|[B1.2] Insert string of length N (time)                                   |            1 ms |          850 ms |
|[B1.2] Insert string of length N (avgUpdateSize)                          |      3018 bytes |    740719 bytes |
|[B1.2] Insert string of length N (docSize)                                |      3018 bytes |    783051 bytes |
|[B1.2] Insert string of length N (parseTime)                              |            0 ms |          204 ms |
|[B1.3] Prepend N characters (time)                                        |           86 ms |        14140 ms |
|[B1.3] Prepend N characters (avgUpdateSize)                               |        20 bytes |       290 bytes |
|[B1.3] Prepend N characters (docSize)                                     |     29881 bytes |    971994 bytes |
|[B1.3] Prepend N characters (parseTime)                                   |           10 ms |        13546 ms |
|[B1.4] Insert N characters at random positions (time)                     |           84 ms |         1169 ms |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |        27 bytes |       325 bytes |
|[B1.4] Insert N characters at random positions (docSize)                  |     49840 bytes |   1077069 bytes |
|[B1.4] Insert N characters at random positions (parseTime)                |            4 ms |          399 ms |
|[B1.5] Insert N words at random positions (time)                          |          102 ms |         4350 ms |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |        32 bytes |      1586 bytes |
|[B1.5] Insert N words at random positions (docSize)                       |     99896 bytes |   5072016 bytes |
|[B1.5] Insert N words at random positions (parseTime)                     |            5 ms |         1797 ms |
|[B1.6] Insert string, then delete it (time)                               |            1 ms |          713 ms |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |      3029 bytes |    704719 bytes |
|[B1.6] Insert string, then delete it (docSize)                            |        27 bytes |    747051 bytes |
|[B1.6] Insert string, then delete it (parseTime)                          |            0 ms |          118 ms |
|[B1.7] Insert/Delete strings at random positions (time)                   |          128 ms |         3180 ms |
|[B1.7] Insert/Delete strings at random positions (avgUpdateSize)          |        21 bytes |      1094 bytes |
|[B1.7] Insert/Delete strings at random positions (docSize)                |     42055 bytes |   3519219 bytes |
|[B1.7] Insert/Delete strings at random positions (parseTime)              |           11 ms |         1564 ms |
|[B1.8] Append N numbers (time)                                            |           99 ms |         1303 ms |
|[B1.8] Append N numbers (avgUpdateSize)                                   |        25 bytes |       332 bytes |
|[B1.8] Append N numbers (docSize)                                         |     17844 bytes |   1098305 bytes |
|[B1.8] Append N numbers (parseTime)                                       |            0 ms |          370 ms |
|[B1.9] Insert Array of N numbers (time)                                   |            3 ms |         1039 ms |
|[B1.9] Insert Array of N numbers (avgUpdateSize)                          |     17813 bytes |    760103 bytes |
|[B1.9] Insert Array of N numbers (docSize)                                |     17813 bytes |    802436 bytes |
|[B1.9] Insert Array of N numbers (parseTime)                              |            0 ms |          311 ms |
|[B1.10] Prepend N numbers (time)                                          |           36 ms |        16915 ms |
|[B1.10] Prepend N numbers (avgUpdateSize)                                 |        25 bytes |       296 bytes |
|[B1.10] Prepend N numbers (docSize)                                       |     44709 bytes |    991430 bytes |
|[B1.10] Prepend N numbers (parseTime)                                     |            2 ms |        14903 ms |
|[B1.11] Insert N numbers at random positions (time)                       |           77 ms |         1584 ms |
|[B1.11] Insert N numbers at random positions (avgUpdateSize)              |        32 bytes |       331 bytes |
|[B1.11] Insert N numbers at random positions (docSize)                    |     64740 bytes |   1096707 bytes |
|[B1.11] Insert N numbers at random positions (parseTime)                  |            3 ms |          449 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (time)           |            1 ms |         1832 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (updateSize)     |      6036 bytes |   1482726 bytes |
|[B2.1] Cuncurrently insert string of length N at index 0 (docSize)        |      6142 bytes |   1592619 bytes |
|[B2.1] Cuncurrently insert string of length N at index 0 (parseTime)      |            0 ms |          490 ms |
|[B2.2] Cuncurrently insert N characters at random positions (time)        |          100 ms |        13291 ms |
|[B2.2] Cuncurrently insert N characters at random positions (updateSize)  |     99479 bytes |   1373922 bytes |
|[B2.2] Cuncurrently insert N characters at random positions (docSize)     |    100377 bytes |   1483815 bytes |
|[B2.2] Cuncurrently insert N characters at random positions (parseTime)   |            7 ms |        13743 ms |
|[B2.3] Cuncurrently insert N words at random positions (time)             |          147 ms |        62395 ms |
|[B2.3] Cuncurrently insert N words at random positions (updateSize)       |    198279 bytes |   8895997 bytes |
|[B2.3] Cuncurrently insert N words at random positions (docSize)          |    199057 bytes |   9427864 bytes |
|[B2.3] Cuncurrently insert N words at random positions (parseTime)        |           11 ms |        22557 ms |
|[B2.4] Cuncurrently insert & delete (time)                                |          439 ms |       103267 ms |
|[B2.4] Cuncurrently insert & delete (updateSize)                          |    300952 bytes |  13214933 bytes |
|[B2.4] Cuncurrently insert & delete (docSize)                             |    301608 bytes |  13992066 bytes |
|[B2.4] Cuncurrently insert & delete (parseTime)                           |           35 ms |         4606 ms |
|[B3.1] √N clients concurrently set number in Map (time)                   |            3 ms |           14 ms |
|[B3.1] √N clients concurrently set number in Map (updateSize)             |      1078 bytes |      8576 bytes |
|[B3.1] √N clients concurrently set number in Map (docSize)                |      1288 bytes |     10046 bytes |
|[B3.1] √N clients concurrently set number in Map (parseTime)              |            1 ms |           15 ms |
|[B3.2] √N clients concurrently set Object in Map (time)                   |            8 ms |           45 ms |
|[B3.2] √N clients concurrently set Object in Map (updateSize)             |      3170 bytes |     23912 bytes |
|[B3.2] √N clients concurrently set Object in Map (docSize)                |      1432 bytes |     26516 bytes |
|[B3.2] √N clients concurrently set Object in Map (parseTime)              |            1 ms |           14 ms |
|[B3.3] √N clients concurrently set String in Map (time)                   |            2 ms |           18 ms |
|[B3.3] √N clients concurrently set String in Map (updateSize)             |      6369 bytes |     13878 bytes |
|[B3.3] √N clients concurrently set String in Map (docSize)                |      1394 bytes |     15348 bytes |
|[B3.3] √N clients concurrently set String in Map (parseTime)              |            0 ms |           11 ms |
|[B3.4] √N clients concurrently insert text in Array (time)                |            1 ms |           27 ms |
|[B3.4] √N clients concurrently insert text in Array (updateSize)          |      1176 bytes |     17392 bytes |
|[B3.4] √N clients concurrently insert text in Array (docSize)             |      1070 bytes |     19541 bytes |
|[B3.4] √N clients concurrently insert text in Array (parseTime)           |            0 ms |           22 ms |

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
