
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

| N = 6000 | Yjs | automerge |
| :- | -: | -: |
|Bundle size                                                               |     53740 bytes |    297282 bytes |
|Bundle size (gzipped)                                                     |     16527 bytes |     74276 bytes |
|[B1.1] Append N characters (time)                                         |          157 ms |        97695 ms |
|[B1.1] Append N characters (avgUpdateSize)                                |        20 bytes |       107 bytes |
|[B1.1] Append N characters (encodeTime)                                   |            1 ms |          521 ms |
|[B1.1] Append N characters (docSize)                                      |      6018 bytes |      6606 bytes |
|[B1.1] Append N characters (parseTime)                                    |            0 ms |         2725 ms |
|[B1.2] Insert string of length N (time)                                   |            3 ms |         3454 ms |
|[B1.2] Insert string of length N (avgUpdateSize)                          |      6018 bytes |      6116 bytes |
|[B1.2] Insert string of length N (encodeTime)                             |            3 ms |          103 ms |
|[B1.2] Insert string of length N (docSize)                                |      6018 bytes |      6178 bytes |
|[B1.2] Insert string of length N (parseTime)                              |            0 ms |          662 ms |
|[B1.3] Prepend N characters (time)                                        |          133 ms |       185582 ms |
|[B1.3] Prepend N characters (avgUpdateSize)                               |        20 bytes |       106 bytes |
|[B1.3] Prepend N characters (encodeTime)                                  |            6 ms |          466 ms |
|[B1.3] Prepend N characters (docSize)                                     |     59881 bytes |      6947 bytes |
|[B1.3] Prepend N characters (parseTime)                                   |           23 ms |        94858 ms |
|[B1.4] Insert N characters at random positions (time)                     |          288 ms |       101891 ms |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |        27 bytes |       107 bytes |
|[B1.4] Insert N characters at random positions (encodeTime)               |            9 ms |          475 ms |
|[B1.4] Insert N characters at random positions (docSize)                  |    100602 bytes |     28934 bytes |
|[B1.4] Insert N characters at random positions (parseTime)                |           37 ms |         3272 ms |
|[B1.5] Insert N words at random positions (time)                          |          425 ms |       182720 ms |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |        33 bytes |       117 bytes |
|[B1.5] Insert N words at random positions (encodeTime)                    |            7 ms |         1067 ms |
|[B1.5] Insert N words at random positions (docSize)                       |    204120 bytes |    135280 bytes |
|[B1.5] Insert N words at random positions (parseTime)                     |           25 ms |         6999 ms |
|[B1.6] Insert string, then delete it (time)                               |            4 ms |        11896 ms |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |      6029 bytes |      6148 bytes |
|[B1.6] Insert string, then delete it (encodeTime)                         |            0 ms |          215 ms |
|[B1.6] Insert string, then delete it (docSize)                            |        27 bytes |      6194 bytes |
|[B1.6] Insert string, then delete it (parseTime)                          |            0 ms |         1262 ms |
|[B1.7] Insert/Delete strings at random positions (time)                   |          356 ms |       134055 ms |
|[B1.7] Insert/Delete strings at random positions (avgUpdateSize)          |        24 bytes |       120 bytes |
|[B1.7] Insert/Delete strings at random positions (encodeTime)             |            5 ms |          812 ms |
|[B1.7] Insert/Delete strings at random positions (docSize)                |     91617 bytes |     83777 bytes |
|[B1.7] Insert/Delete strings at random positions (parseTime)              |           31 ms |         5839 ms |
|[B1.8] Append N numbers (time)                                            |          242 ms |       344490 ms |
|[B1.8] Append N numbers (avgUpdateSize)                                   |        25 bytes |       111 bytes |
|[B1.8] Append N numbers (encodeTime)                                      |            4 ms |          631 ms |
|[B1.8] Append N numbers (docSize)                                         |     35623 bytes |     33383 bytes |
|[B1.8] Append N numbers (parseTime)                                       |            0 ms |         2686 ms |
|[B1.9] Insert Array of N numbers (time)                                   |           10 ms |         3559 ms |
|[B1.9] Insert Array of N numbers (avgUpdateSize)                          |     35650 bytes |     31783 bytes |
|[B1.9] Insert Array of N numbers (encodeTime)                             |            5 ms |           52 ms |
|[B1.9] Insert Array of N numbers (docSize)                                |     35650 bytes |     31846 bytes |
|[B1.9] Insert Array of N numbers (parseTime)                              |            2 ms |          588 ms |
|[B1.10] Prepend N numbers (time)                                          |          150 ms |       443030 ms |
|[B1.10] Prepend N numbers (avgUpdateSize)                                 |        25 bytes |       110 bytes |
|[B1.10] Prepend N numbers (encodeTime)                                    |            4 ms |          585 ms |
|[B1.10] Prepend N numbers (docSize)                                       |     89511 bytes |     33679 bytes |
|[B1.10] Prepend N numbers (parseTime)                                     |           32 ms |       109936 ms |
|[B1.11] Insert N numbers at random positions (time)                       |          308 ms |       353993 ms |
|[B1.11] Insert N numbers at random positions (avgUpdateSize)              |        32 bytes |       111 bytes |
|[B1.11] Insert N numbers at random positions (encodeTime)                 |           10 ms |          595 ms |
|[B1.11] Insert N numbers at random positions (docSize)                    |    130248 bytes |     55646 bytes |
|[B1.11] Insert N numbers at random positions (parseTime)                  |           38 ms |         3308 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (time)           |            4 ms |         6802 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (updateSize)     |     12036 bytes |     12251 bytes |
|[B2.1] Cuncurrently insert string of length N at index 0 (encodeTime)     |            3 ms |          171 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (docSize)        |     12142 bytes |     12386 bytes |
|[B2.1] Cuncurrently insert string of length N at index 0 (parseTime)      |            0 ms |         1482 ms |
|[B2.2] Cuncurrently insert N characters at random positions (time)        |          416 ms |        70110 ms |
|[B2.2] Cuncurrently insert N characters at random positions (updateSize)  |    200962 bytes |     23749 bytes |
|[B2.2] Cuncurrently insert N characters at random positions (encodeTime)  |            3 ms |          209 ms |
|[B2.2] Cuncurrently insert N characters at random positions (docSize)     |    201860 bytes |     35056 bytes |
|[B2.2] Cuncurrently insert N characters at random positions (parseTime)   |           71 ms |        82009 ms |
|[B2.3] Cuncurrently insert N words at random positions (time)             |          632 ms |       274280 ms |
|[B2.3] Cuncurrently insert N words at random positions (updateSize)       |    405775 bytes |    166728 bytes |
|[B2.3] Cuncurrently insert N words at random positions (encodeTime)       |            6 ms |          950 ms |
|[B2.3] Cuncurrently insert N words at random positions (docSize)          |    406553 bytes |    263073 bytes |
|[B2.3] Cuncurrently insert N words at random positions (parseTime)        |           65 ms |       122648 ms |
|[B2.4] Cuncurrently insert & delete (time)                                |         1903 ms |       860960 ms |
|[B2.4] Cuncurrently insert & delete (updateSize)                          |    620776 bytes |    398153 bytes |
|[B2.4] Cuncurrently insert & delete (encodeTime)                          |           22 ms |         1996 ms |
|[B2.4] Cuncurrently insert & delete (docSize)                             |    621449 bytes |    429418 bytes |
|[B2.4] Cuncurrently insert & delete (parseTime)                           |          104 ms |        21209 ms |
|[B3.1] √N clients concurrently set number in Map (time)                   |            6 ms |           74 ms |
|[B3.1] √N clients concurrently set number in Map (updateSize)             |      1547 bytes |      4620 bytes |
|[B3.1] √N clients concurrently set number in Map (encodeTime)             |            0 ms |            7 ms |
|[B3.1] √N clients concurrently set number in Map (docSize)                |      1832 bytes |      4094 bytes |
|[B3.1] √N clients concurrently set number in Map (parseTime)              |            3 ms |           48 ms |
|[B3.2] √N clients concurrently set Object in Map (time)                   |            6 ms |          105 ms |
|[B3.2] √N clients concurrently set Object in Map (updateSize)             |      4518 bytes |      7228 bytes |
|[B3.2] √N clients concurrently set Object in Map (encodeTime)             |            0 ms |           19 ms |
|[B3.2] √N clients concurrently set Object in Map (docSize)                |      2025 bytes |      6113 bytes |
|[B3.2] √N clients concurrently set Object in Map (parseTime)              |            1 ms |           56 ms |
|[B3.3] √N clients concurrently set String in Map (time)                   |            4 ms |           74 ms |
|[B3.3] √N clients concurrently set String in Map (updateSize)             |     12689 bytes |     15842 bytes |
|[B3.3] √N clients concurrently set String in Map (encodeTime)             |            0 ms |            8 ms |
|[B3.3] √N clients concurrently set String in Map (docSize)                |      1987 bytes |     15160 bytes |
|[B3.3] √N clients concurrently set String in Map (parseTime)              |            1 ms |           45 ms |
|[B3.4] √N clients concurrently insert text in Array (time)                |            6 ms |           57 ms |
|[B3.4] √N clients concurrently insert text in Array (updateSize)          |      1678 bytes |      9367 bytes |
|[B3.4] √N clients concurrently insert text in Array (encodeTime)          |            0 ms |            8 ms |
|[B3.4] √N clients concurrently insert text in Array (docSize)             |      1526 bytes |      4242 bytes |
|[B3.4] √N clients concurrently insert text in Array (parseTime)           |            1 ms |           78 ms |

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
