
# CRDT benchmarks

> A collection of reproducible benchmarks. *PRs are welcome.*

```sh
npm i && npm start
```

## Benchmarks

#### B1: No conflicts

Simulate two clients. One client modifies a text object and sends update messages to the other client. We measure the time to perform the task (`time`), the amount of data exchanged (`avgUpdateSize`), the size of the encoded document after the task is performed (`docSize`), the time to parse the encoded document (`parseTime`), and the memory used to hold the decoded document (`memUsed`).

#### B2: Two users producing conflicts

Simulate two clients. Both start with a synced text object containing 100 characters. Both clients modify the text object in a single transaction and then send their changes to the other client. We measure the time to sync concurrent changes into a single client (`time`), the size of the update messages (`updateSize`), the size of the encoded document after the task is performed (`docSize`), the time to parse the encoded document (`parseTime`), and the memory used to hold the decoded document (`memUsed`).

#### B3: Many conflicts

Simulate `√N` concurrent actions. We measure the time to perform the task
and sync all clients (`time`), the size of the update messages (`updateSize`),
the size of the encoded document after the task is performed (`docSize`),
the time to parse the encoded document (`parseTime`), and the memory used to hold the decoded document (`memUsed`).
The logarithm of `N` was
chosen because `√N` concurrent actions may result in up to `√N^2 - 1`
conflicts (apply action 1: 0 conlict; apply action2: 1 conflict, apply action 2: 2 conflicts, ..).

#### B4: Real-world editing dataset

Replay a real-world editing dataset. This dataset contains the character-by-character editing trace of a large-ish text document, the LaTeX source of this paper: https://arxiv.org/abs/1608.03960

Source: https://github.com/automerge/automerge-perf/tree/master/edit-by-index

* 182,315 single-character insertion operations
*  77,463 single-character deletion operations
* 259,778 operations totally

We simulate one client replaying all changes and storing each update. We measure the time to replay
the changes and the size of all update messages (`updateSize`),
the size of the encoded document after the task is performed (`docSize`), the time to encode the document (`encodeTime`),
the time to parse the encoded document (`parseTime`), and the memory used to hold the decoded document in memory (`memUsed`).

** For now we replay all actions in a single transaction, otherwise Automerge is running out of memory.

### Results

**Notes**
* `memUsed` only approximates the amount of memory used. We run the JavaScript garbage collector and use the heap-size difference before and after the benchmark is performed. If the heap is highly fragmented, the heap size might be larger than the actual amount of data stored in the heap. In some cases this even leads to a `memUsed` of less than zero.
* Preliminary benchmark results for [a RON-based CRDT](https://github.com/gritzko/ron) (written in C++) are posted [in this thread](https://github.com/dmonad/crdt-benchmarks/issues/3).

| N = 3000 | Yjs | automerge |
| :- | -: | -: |
|Bundle size                                                               |     53690 bytes |    259763 bytes |
|Bundle size (gzipped)                                                     |     16603 bytes |     61478 bytes |
|[B1.1] Append N characters (time)                                         |          126 ms |         1342 ms |
|[B1.1] Append N characters (avgUpdateSize)                                |        20 bytes |       326 bytes |
|[B1.1] Append N characters (docSize)                                      |      3018 bytes |   1078851 bytes |
|[B1.1] Append N characters (parseTime)                                    |            0 ms |          408 ms |
|[B1.1] Append N characters (memUsed)                                      |         59.3 kB |         38.3 MB |
|[B1.2] Insert string of length N (time)                                   |            1 ms |         1184 ms |
|[B1.2] Insert string of length N (avgUpdateSize)                          |      3018 bytes |    740719 bytes |
|[B1.2] Insert string of length N (docSize)                                |      3018 bytes |    783051 bytes |
|[B1.2] Insert string of length N (parseTime)                              |            0 ms |          267 ms |
|[B1.2] Insert string of length N (memUsed)                                |             0 B |         26.9 MB |
|[B1.3] Prepend N characters (time)                                        |          100 ms |        22600 ms |
|[B1.3] Prepend N characters (avgUpdateSize)                               |        20 bytes |       290 bytes |
|[B1.3] Prepend N characters (docSize)                                     |     29881 bytes |    971994 bytes |
|[B1.3] Prepend N characters (parseTime)                                   |           16 ms |        23160 ms |
|[B1.3] Prepend N characters (memUsed)                                     |          1.3 MB |         33.1 MB |
|[B1.4] Insert N characters at random positions (time)                     |          152 ms |         1469 ms |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |        27 bytes |       325 bytes |
|[B1.4] Insert N characters at random positions (docSize)                  |     49840 bytes |   1077069 bytes |
|[B1.4] Insert N characters at random positions (parseTime)                |           17 ms |          680 ms |
|[B1.4] Insert N characters at random positions (memUsed)                  |          1.2 MB |           36 MB |
|[B1.5] Insert N words at random positions (time)                          |          193 ms |         5200 ms |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |        32 bytes |      1586 bytes |
|[B1.5] Insert N words at random positions (docSize)                       |     99896 bytes |   5072016 bytes |
|[B1.5] Insert N words at random positions (parseTime)                     |           21 ms |         1784 ms |
|[B1.5] Insert N words at random positions (memUsed)                       |          2.5 MB |        166.2 MB |
|[B1.6] Insert string, then delete it (time)                               |           15 ms |          967 ms |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |      3029 bytes |    704719 bytes |
|[B1.6] Insert string, then delete it (docSize)                            |        27 bytes |    747051 bytes |
|[B1.6] Insert string, then delete it (parseTime)                          |            0 ms |          164 ms |
|[B1.6] Insert string, then delete it (memUsed)                            |             0 B |         18.5 MB |
|[B1.7] Insert/Delete strings at random positions (time)                   |          177 ms |         3365 ms |
|[B1.7] Insert/Delete strings at random positions (avgUpdateSize)          |        21 bytes |      1094 bytes |
|[B1.7] Insert/Delete strings at random positions (docSize)                |     42055 bytes |   3519219 bytes |
|[B1.7] Insert/Delete strings at random positions (parseTime)              |           16 ms |         1195 ms |
|[B1.7] Insert/Delete strings at random positions (memUsed)                |          1.5 MB |         82.8 MB |
|[B1.8] Append N numbers (time)                                            |          152 ms |         1485 ms |
|[B1.8] Append N numbers (avgUpdateSize)                                   |        25 bytes |       332 bytes |
|[B1.8] Append N numbers (docSize)                                         |     17844 bytes |   1098305 bytes |
|[B1.8] Append N numbers (parseTime)                                       |            0 ms |          381 ms |
|[B1.8] Append N numbers (memUsed)                                         |             0 B |         36.9 MB |
|[B1.9] Insert Array of N numbers (time)                                   |            6 ms |         1109 ms |
|[B1.9] Insert Array of N numbers (avgUpdateSize)                          |     17813 bytes |    760103 bytes |
|[B1.9] Insert Array of N numbers (docSize)                                |     17813 bytes |    802436 bytes |
|[B1.9] Insert Array of N numbers (parseTime)                              |            0 ms |          224 ms |
|[B1.9] Insert Array of N numbers (memUsed)                                |             0 B |         26.8 MB |
|[B1.10] Prepend N numbers (time)                                          |           92 ms |        16931 ms |
|[B1.10] Prepend N numbers (avgUpdateSize)                                 |        25 bytes |       296 bytes |
|[B1.10] Prepend N numbers (docSize)                                       |     44709 bytes |    991430 bytes |
|[B1.10] Prepend N numbers (parseTime)                                     |            2 ms |        16585 ms |
|[B1.10] Prepend N numbers (memUsed)                                       |          2.2 MB |         33.2 MB |
|[B1.11] Insert N numbers at random positions (time)                       |          147 ms |         1774 ms |
|[B1.11] Insert N numbers at random positions (avgUpdateSize)              |        32 bytes |       331 bytes |
|[B1.11] Insert N numbers at random positions (docSize)                    |     64740 bytes |   1096707 bytes |
|[B1.11] Insert N numbers at random positions (parseTime)                  |           16 ms |          552 ms |
|[B1.11] Insert N numbers at random positions (memUsed)                    |          2.4 MB |         35.5 MB |
|[B2.1] Cuncurrently insert string of length N at index 0 (time)           |            3 ms |         2003 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (updateSize)     |      6036 bytes |   1482726 bytes |
|[B2.1] Cuncurrently insert string of length N at index 0 (docSize)        |      6142 bytes |   1592619 bytes |
|[B2.1] Cuncurrently insert string of length N at index 0 (parseTime)      |            0 ms |          516 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (memUsed)        |             0 B |         54.1 MB |
|[B2.2] Cuncurrently insert N characters at random positions (time)        |          153 ms |        13950 ms |
|[B2.2] Cuncurrently insert N characters at random positions (updateSize)  |     99479 bytes |   1373922 bytes |
|[B2.2] Cuncurrently insert N characters at random positions (docSize)     |    100377 bytes |   1483815 bytes |
|[B2.2] Cuncurrently insert N characters at random positions (parseTime)   |           22 ms |        16086 ms |
|[B2.2] Cuncurrently insert N characters at random positions (memUsed)     |          2.2 MB |         48.9 MB |
|[B2.3] Cuncurrently insert N words at random positions (time)             |          237 ms |        70180 ms |
|[B2.3] Cuncurrently insert N words at random positions (updateSize)       |    198279 bytes |   8895997 bytes |
|[B2.3] Cuncurrently insert N words at random positions (docSize)          |    199057 bytes |   9427864 bytes |
|[B2.3] Cuncurrently insert N words at random positions (parseTime)        |           43 ms |        24460 ms |
|[B2.3] Cuncurrently insert N words at random positions (memUsed)          |          4.8 MB |        313.3 MB |
|[B2.4] Cuncurrently insert & delete (time)                                |          622 ms |       115476 ms |
|[B2.4] Cuncurrently insert & delete (updateSize)                          |    300952 bytes |  13214933 bytes |
|[B2.4] Cuncurrently insert & delete (docSize)                             |    301608 bytes |  13992066 bytes |
|[B2.4] Cuncurrently insert & delete (parseTime)                           |           49 ms |         4945 ms |
|[B2.4] Cuncurrently insert & delete (memUsed)                             |          7.2 MB |          423 MB |
|[B3.1] √N clients concurrently set number in Map (time)                   |            8 ms |           29 ms |
|[B3.1] √N clients concurrently set number in Map (updateSize)             |      1078 bytes |      8576 bytes |
|[B3.1] √N clients concurrently set number in Map (docSize)                |      1288 bytes |     10046 bytes |
|[B3.1] √N clients concurrently set number in Map (parseTime)              |            1 ms |           24 ms |
|[B3.1] √N clients concurrently set number in Map (memUsed)                |             0 B |        746.2 kB |
|[B3.2] √N clients concurrently set Object in Map (time)                   |           10 ms |           39 ms |
|[B3.2] √N clients concurrently set Object in Map (updateSize)             |      3167 bytes |     23912 bytes |
|[B3.2] √N clients concurrently set Object in Map (docSize)                |      1431 bytes |     26516 bytes |
|[B3.2] √N clients concurrently set Object in Map (parseTime)              |            1 ms |           28 ms |
|[B3.2] √N clients concurrently set Object in Map (memUsed)                |        265.1 kB |            2 MB |
|[B3.3] √N clients concurrently set String in Map (time)                   |            6 ms |           26 ms |
|[B3.3] √N clients concurrently set String in Map (updateSize)             |      6371 bytes |     13878 bytes |
|[B3.3] √N clients concurrently set String in Map (docSize)                |      1398 bytes |     15348 bytes |
|[B3.3] √N clients concurrently set String in Map (parseTime)              |            1 ms |           19 ms |
|[B3.3] √N clients concurrently set String in Map (memUsed)                |        185.5 kB |        944.3 kB |
|[B3.4] √N clients concurrently insert text in Array (time)                |            5 ms |           36 ms |
|[B3.4] √N clients concurrently insert text in Array (updateSize)          |      1173 bytes |     17392 bytes |
|[B3.4] √N clients concurrently insert text in Array (docSize)             |      1067 bytes |     19541 bytes |
|[B3.4] √N clients concurrently insert text in Array (parseTime)           |            1 ms |           52 ms |
|[B3.4] √N clients concurrently insert text in Array (memUsed)             |        189.2 kB |            2 MB |
|[B4] Apply real-world editing dataset (time)                              |        10667 ms |       605402 ms |
|[B4] Apply real-world editing dataset (updateSize)                        |   6324510 bytes |  75675634 bytes |
|[B4] Apply real-world editing dataset (encodeTime)                        |           18 ms |         3791 ms |
|[B4] Apply real-world editing dataset (docSize)                           |    311038 bytes |  83966886 bytes |
|[B4] Apply real-world editing dataset (memUsed)                           |          2.1 MB |         88.8 MB |
|[B4] Apply real-world editing dataset (parseTime)                         |           61 ms |        56299 ms |


| N = 60000 | Yjs | automerge |
| :- | -: | -: |
|Bundle size                                                               |     53690 bytes |    259763 bytes |
|Bundle size (gzipped)                                                     |     16603 bytes |     61478 bytes |
|[B1.1] Append N characters (time)                                         |          781 ms |                 |
|[B1.1] Append N characters (avgUpdateSize)                                |        19 bytes |                 |
|[B1.1] Append N characters (docSize)                                      |     60018 bytes |                 |
|[B1.1] Append N characters (parseTime)                                    |            1 ms |                 |
|[B1.1] Append N characters (memUsed)                                      |             0 B |                 |
|[B1.1] Append N characters                                                |                 |        skipping |
|[B1.2] Insert string of length N (time)                                   |            9 ms |                 |
|[B1.2] Insert string of length N (avgUpdateSize)                          |     60019 bytes |                 |
|[B1.2] Insert string of length N (docSize)                                |     60019 bytes |                 |
|[B1.2] Insert string of length N (parseTime)                              |            1 ms |                 |
|[B1.2] Insert string of length N (memUsed)                                |             0 B |                 |
|[B1.2] Insert string of length N                                          |                 |        skipping |
|[B1.3] Prepend N characters (time)                                        |          554 ms |                 |
|[B1.3] Prepend N characters (avgUpdateSize)                               |        21 bytes |                 |
|[B1.3] Prepend N characters (docSize)                                     |    643497 bytes |                 |
|[B1.3] Prepend N characters (parseTime)                                   |           46 ms |                 |
|[B1.3] Prepend N characters (memUsed)                                     |         24.8 MB |                 |
|[B1.3] Prepend N characters                                               |                 |        skipping |
|[B1.4] Insert N characters at random positions (time)                     |        24484 ms |                 |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |        28 bytes |                 |
|[B1.4] Insert N characters at random positions (docSize)                  |   1062685 bytes |                 |
|[B1.4] Insert N characters at random positions (parseTime)                |           70 ms |                 |
|[B1.4] Insert N characters at random positions (memUsed)                  |         24.4 MB |                 |
|[B1.4] Insert N characters at random positions                            |                 |        skipping |
|[B1.5] Insert N words at random positions (time)                          |        89830 ms |                 |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |        35 bytes |                 |
|[B1.5] Insert N words at random positions (docSize)                       |   2167365 bytes |                 |
|[B1.5] Insert N words at random positions (parseTime)                     |          256 ms |                 |
|[B1.5] Insert N words at random positions (memUsed)                       |         51.5 MB |                 |
|[B1.5] Insert N words at random positions                                 |                 |        skipping |
|[B1.6] Insert string, then delete it (time)                               |           13 ms |                 |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |     60031 bytes |                 |
|[B1.6] Insert string, then delete it (docSize)                            |        29 bytes |                 |
|[B1.6] Insert string, then delete it (parseTime)                          |            0 ms |                 |
|[B1.6] Insert string, then delete it (memUsed)                            |             0 B |                 |
|[B1.6] Insert string, then delete it                                      |                 |        skipping |
|[B1.7] Insert/Delete strings at random positions (time)                   |        43249 ms |                 |
|[B1.7] Insert/Delete strings at random positions (avgUpdateSize)          |        26 bytes |                 |
|[B1.7] Insert/Delete strings at random positions (docSize)                |   1084522 bytes |                 |
|[B1.7] Insert/Delete strings at random positions (parseTime)              |          135 ms |                 |
|[B1.7] Insert/Delete strings at random positions (memUsed)                |           28 MB |                 |
|[B1.7] Insert/Delete strings at random positions                          |                 |        skipping |
|[B1.8] Append N numbers (time)                                            |        13662 ms |                 |
|[B1.8] Append N numbers (avgUpdateSize)                                   |        26 bytes |                 |
|[B1.8] Append N numbers (docSize)                                         |    356209 bytes |                 |
|[B1.8] Append N numbers (parseTime)                                       |            3 ms |                 |
|[B1.8] Append N numbers (memUsed)                                         |          1.1 MB |                 |
|[B1.8] Append N numbers                                                   |                 |        skipping |
|[B1.9] Insert Array of N numbers (time)                                   |           22 ms |                 |
|[B1.9] Insert Array of N numbers (avgUpdateSize)                          |    356267 bytes |                 |
|[B1.9] Insert Array of N numbers (docSize)                                |    356267 bytes |                 |
|[B1.9] Insert Array of N numbers (parseTime)                              |            4 ms |                 |
|[B1.9] Insert Array of N numbers (memUsed)                                |          1.1 MB |                 |
|[B1.9] Insert Array of N numbers                                          |                 |        skipping |
|[B1.10] Prepend N numbers (time)                                          |          523 ms |                 |
|[B1.10] Prepend N numbers (avgUpdateSize)                                 |        26 bytes |                 |
|[B1.10] Prepend N numbers (docSize)                                       |    939801 bytes |                 |
|[B1.10] Prepend N numbers (parseTime)                                     |           67 ms |                 |
|[B1.10] Prepend N numbers (memUsed)                                       |         46.7 MB |                 |
|[B1.10] Prepend N numbers                                                 |                 |        skipping |
|[B1.11] Insert N numbers at random positions (time)                       |        21479 ms |                 |
|[B1.11] Insert N numbers at random positions (avgUpdateSize)              |        33 bytes |                 |
|[B1.11] Insert N numbers at random positions (docSize)                    |   1358956 bytes |                 |
|[B1.11] Insert N numbers at random positions (parseTime)                  |           71 ms |                 |
|[B1.11] Insert N numbers at random positions (memUsed)                    |         46.3 MB |                 |
|[B1.11] Insert N numbers at random positions                              |                 |        skipping |
|[B2.1] Cuncurrently insert string of length N at index 0 (time)           |           11 ms |                 |
|[B2.1] Cuncurrently insert string of length N at index 0 (updateSize)     |    120038 bytes |                 |
|[B2.1] Cuncurrently insert string of length N at index 0 (docSize)        |    120144 bytes |                 |
|[B2.1] Cuncurrently insert string of length N at index 0 (parseTime)      |            2 ms |                 |
|[B2.1] Cuncurrently insert string of length N at index 0 (memUsed)        |             0 B |                 |
|[B2.1] Cuncurrently insert string of length N at index 0                  |                 |        skipping |
|[B2.2] Cuncurrently insert N characters at random positions (time)        |        39381 ms |                 |
|[B2.2] Cuncurrently insert N characters at random positions (updateSize)  |   2124594 bytes |                 |
|[B2.2] Cuncurrently insert N characters at random positions (docSize)     |   2125492 bytes |                 |
|[B2.2] Cuncurrently insert N characters at random positions (parseTime)   |          190 ms |                 |
|[B2.2] Cuncurrently insert N characters at random positions (memUsed)     |           49 MB |                 |
|[B2.2] Cuncurrently insert N characters at random positions               |                 |        skipping |
|[B2.3] Cuncurrently insert N words at random positions (time)             |       122008 ms |                 |
|[B2.3] Cuncurrently insert N words at random positions (updateSize)       |   4330443 bytes |                 |
|[B2.3] Cuncurrently insert N words at random positions (docSize)          |   4331277 bytes |                 |
|[B2.3] Cuncurrently insert N words at random positions (parseTime)        |          451 ms |                 |
|[B2.3] Cuncurrently insert N words at random positions (memUsed)          |        100.7 MB |                 |
|[B2.3] Cuncurrently insert N words at random positions                    |                 |        skipping |
|[B2.4] Cuncurrently insert & delete (time)                                |       608327 ms |                 |
|[B2.4] Cuncurrently insert & delete (updateSize)                          |   6579239 bytes |                 |
|[B2.4] Cuncurrently insert & delete (docSize)                             |   6579958 bytes |                 |
|[B2.4] Cuncurrently insert & delete (parseTime)                           |          847 ms |                 |
|[B2.4] Cuncurrently insert & delete (memUsed)                             |        150.5 MB |                 |
|[B2.4] Cuncurrently insert & delete                                       |                 |        skipping |
|[B3.1] √N clients concurrently set number in Map (time)                   |           22 ms |                 |
|[B3.1] √N clients concurrently set number in Map (updateSize)             |      5049 bytes |                 |
|[B3.1] √N clients concurrently set number in Map (docSize)                |      5833 bytes |                 |
|[B3.1] √N clients concurrently set number in Map (parseTime)              |           10 ms |                 |
|[B3.1] √N clients concurrently set number in Map (memUsed)                |        864.8 kB |                 |
|[B3.1] √N clients concurrently set number in Map                          |                 |        skipping |
|[B3.2] √N clients concurrently set Object in Map (time)                   |           28 ms |                 |
|[B3.2] √N clients concurrently set Object in Map (updateSize)             |     14503 bytes |                 |
|[B3.2] √N clients concurrently set Object in Map (docSize)                |      6361 bytes |                 |
|[B3.2] √N clients concurrently set Object in Map (parseTime)              |           10 ms |                 |
|[B3.2] √N clients concurrently set Object in Map (memUsed)                |          1.3 MB |                 |
|[B3.2] √N clients concurrently set Object in Map                          |                 |        skipping |
|[B3.3] √N clients concurrently set String in Map (time)                   |           24 ms |                 |
|[B3.3] √N clients concurrently set String in Map (updateSize)             |    156880 bytes |                 |
|[B3.3] √N clients concurrently set String in Map (docSize)                |      6563 bytes |                 |
|[B3.3] √N clients concurrently set String in Map (parseTime)              |           11 ms |                 |
|[B3.3] √N clients concurrently set String in Map (memUsed)                |          1.1 MB |                 |
|[B3.3] √N clients concurrently set String in Map                          |                 |        skipping |
|[B3.4] √N clients concurrently insert text in Array (time)                |           20 ms |                 |
|[B3.4] √N clients concurrently insert text in Array (updateSize)          |      5487 bytes |                 |
|[B3.4] √N clients concurrently insert text in Array (docSize)             |      5002 bytes |                 |
|[B3.4] √N clients concurrently insert text in Array (parseTime)           |            8 ms |                 |
|[B3.4] √N clients concurrently insert text in Array (memUsed)             |          1.1 MB |                 |
|[B3.4] √N clients concurrently insert text in Array                       |                 |        skipping |
|[B4] Apply real-world editing dataset (time)                              |        12182 ms |                 |
|[B4] Apply real-world editing dataset (updateSize)                        |   6324510 bytes |                 |
|[B4] Apply real-world editing dataset (encodeTime)                        |           18 ms |                 |
|[B4] Apply real-world editing dataset (docSize)                           |    311038 bytes |                 |
|[B4] Apply real-world editing dataset (parseTime)                         |          105 ms |                 |
|[B4] Apply real-world editing dataset (memUsed)                           |          2.1 MB |                 |
|[B4] Apply real-world editing dataset                                     |                 |        skipping |


## Development

Modify the `N` variable in `benchmarks/utils.js` to increase the difficulty.

```sh
npm run watch
node dist/benchmark.js
```

Now you can also open `benchmark.html` to run the benchmarks in the browser.

## License

[The MIT License](./LICENSE) © Kevin Jahns

Except for /b4-editing-trace.js © Martin Kleppmann
