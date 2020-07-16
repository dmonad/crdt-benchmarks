
# CRDT benchmarks

> A collection of reproducible benchmarks. *PRs are welcome.*

```sh
# Install Node.js https://nodejs.org
npm i && npm start
```

You can find the benchmark results of Automerge's current [`performance`](https://github.com/automerge/automerge/pull/253) branch [here](https://github.com/automerge/automerge/pull/253).

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
* 104,852 characters in the final document

We simulate one client replaying all changes and storing each update. We measure the time to replay
the changes and the size of all update messages (`updateSize`),
the size of the encoded document after the task is performed (`docSize`), the time to encode the document (`encodeTime`),
the time to parse the encoded document (`parseTime`), and the memory used to hold the decoded document in memory (`memUsed`).

** For now we replay all actions in a single transaction, otherwise Automerge is running out of memory.

##### [B4 x 100] Real-world editing dataset 100 times

Replay the [B4] dataset one hundred times. The final document has a size of over 10 million characters. As comparison, the book "Game of Thrones: A Song of Ice and Fire" is only 1.6 million characters long (including whitespace).

* 18,231,500 single-character insertion operations
*  7,746,300 single-character deletion operations
* 25,977,800 operations totally
* 10,485,200 characters in the final document

### Results

**Notes**
* The benchmarks were performed on a desktop computer "Intel® Core™ i5-8400 CPU @ 2.80GHz × 6" / Ubuntu 20.04 and Node 12.18.1
* There is a more exchaustive benchmark at the bottom that only runs benchmarks on Yjs.
* `memUsed` only approximates the amount of memory used. We run the JavaScript garbage collector and use the heap-size difference before and after the benchmark is performed. If the heap is highly fragmented, the heap size might be larger than the actual amount of data stored in the heap. In some cases this even leads to a `memUsed` of less than zero.
* Preliminary benchmark results for [a RON-based CRDT](https://github.com/gritzko/ron) (written in C++) are posted [in this thread](https://github.com/dmonad/crdt-benchmarks/issues/3).

| N = 3000 | Yjs | automerge |
| :- | -: | -: |
|Bundle size                                                               |     65939 bytes |    259763 bytes |
|Bundle size (gzipped)                                                     |     19383 bytes |     61478 bytes |
|[B1.1] Append N characters (time)                                         |          216 ms |         1317 ms |
|[B1.1] Append N characters (avgUpdateSize)                                |        27 bytes |       326 bytes |
|[B1.1] Append N characters (docSize)                                      |      3031 bytes |   1078851 bytes |
|[B1.1] Append N characters (parseTime)                                    |            0 ms |          348 ms |
|[B1.1] Append N characters (memUsed)                                      |          8.6 MB |         74.8 MB |
|[B1.2] Insert string of length N (time)                                   |            1 ms |          954 ms |
|[B1.2] Insert string of length N (avgUpdateSize)                          |      3031 bytes |    740719 bytes |
|[B1.2] Insert string of length N (docSize)                                |      3031 bytes |    783051 bytes |
|[B1.2] Insert string of length N (parseTime)                              |            0 ms |          215 ms |
|[B1.2] Insert string of length N (memUsed)                                |          155 kB |            2 MB |
|[B1.3] Prepend N characters (time)                                        |          144 ms |        18787 ms |
|[B1.3] Prepend N characters (avgUpdateSize)                               |        27 bytes |       290 bytes |
|[B1.3] Prepend N characters (docSize)                                     |      3041 bytes |    971994 bytes |
|[B1.3] Prepend N characters (parseTime)                                   |            3 ms |        20526 ms |
|[B1.3] Prepend N characters (memUsed)                                     |         10.4 MB |        140.2 MB |
|[B1.4] Insert N characters at random positions (time)                     |          130 ms |         1134 ms |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |        29 bytes |       325 bytes |
|[B1.4] Insert N characters at random positions (docSize)                  |     14470 bytes |   1077069 bytes |
|[B1.4] Insert N characters at random positions (parseTime)                |            2 ms |          377 ms |
|[B1.4] Insert N characters at random positions (memUsed)                  |         10.7 MB |         83.6 MB |
|[B1.5] Insert N words at random positions (time)                          |          121 ms |         4367 ms |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |        35 bytes |      1586 bytes |
|[B1.5] Insert N words at random positions (docSize)                       |     42161 bytes |   5072016 bytes |
|[B1.5] Insert N words at random positions (parseTime)                     |            3 ms |         1841 ms |
|[B1.5] Insert N words at random positions (memUsed)                       |             0 B |         60.9 MB |
|[B1.6] Insert string, then delete it (time)                               |            1 ms |          810 ms |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |      3053 bytes |    704719 bytes |
|[B1.6] Insert string, then delete it (docSize)                            |        38 bytes |    747051 bytes |
|[B1.6] Insert string, then delete it (parseTime)                          |            0 ms |          148 ms |
|[B1.6] Insert string, then delete it (memUsed)                            |        161.9 kB |        101.5 MB |
|[B1.7] Insert/Delete strings at random positions (time)                   |          164 ms |         2685 ms |
|[B1.7] Insert/Delete strings at random positions (avgUpdateSize)          |        30 bytes |      1094 bytes |
|[B1.7] Insert/Delete strings at random positions (docSize)                |     15124 bytes |   3519219 bytes |
|[B1.7] Insert/Delete strings at random positions (parseTime)              |            4 ms |         1164 ms |
|[B1.7] Insert/Delete strings at random positions (memUsed)                |         15.5 MB |        241.7 MB |
|[B1.8] Append N numbers (time)                                            |          161 ms |         1541 ms |
|[B1.8] Append N numbers (avgUpdateSize)                                   |        32 bytes |       332 bytes |
|[B1.8] Append N numbers (docSize)                                         |     17855 bytes |   1098305 bytes |
|[B1.8] Append N numbers (parseTime)                                       |            0 ms |          323 ms |
|[B1.8] Append N numbers (memUsed)                                         |          623 kB |             0 B |
|[B1.9] Insert Array of N numbers (time)                                   |            1 ms |          880 ms |
|[B1.9] Insert Array of N numbers (avgUpdateSize)                          |     17824 bytes |    760103 bytes |
|[B1.9] Insert Array of N numbers (docSize)                                |     17824 bytes |    802436 bytes |
|[B1.9] Insert Array of N numbers (parseTime)                              |            0 ms |          219 ms |
|[B1.9] Insert Array of N numbers (memUsed)                                |          1.7 MB |         43.3 MB |
|[B1.10] Prepend N numbers (time)                                          |           92 ms |        14882 ms |
|[B1.10] Prepend N numbers (avgUpdateSize)                                 |        32 bytes |       296 bytes |
|[B1.10] Prepend N numbers (docSize)                                       |     17867 bytes |    991430 bytes |
|[B1.10] Prepend N numbers (parseTime)                                     |            4 ms |        13362 ms |
|[B1.10] Prepend N numbers (memUsed)                                       |             0 B |         63.4 MB |
|[B1.11] Insert N numbers at random positions (time)                       |           83 ms |         1343 ms |
|[B1.11] Insert N numbers at random positions (avgUpdateSize)              |        34 bytes |       331 bytes |
|[B1.11] Insert N numbers at random positions (docSize)                    |     29311 bytes |   1096707 bytes |
|[B1.11] Insert N numbers at random positions (parseTime)                  |            1 ms |          407 ms |
|[B1.11] Insert N numbers at random positions (memUsed)                    |         10.9 MB |             0 B |
|[B2.1] Cuncurrently insert string of length N at index 0 (time)           |            1 ms |         1799 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (updateSize)     |      6058 bytes |   1482726 bytes |
|[B2.1] Cuncurrently insert string of length N at index 0 (docSize)        |      6151 bytes |   1592619 bytes |
|[B2.1] Cuncurrently insert string of length N at index 0 (parseTime)      |            0 ms |          470 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (memUsed)        |        350.4 kB |        117.2 MB |
|[B2.2] Cuncurrently insert N characters at random positions (time)        |           47 ms |        13053 ms |
|[B2.2] Cuncurrently insert N characters at random positions (updateSize)  |     35068 bytes |   1373922 bytes |
|[B2.2] Cuncurrently insert N characters at random positions (docSize)     |     35162 bytes |   1483815 bytes |
|[B2.2] Cuncurrently insert N characters at random positions (parseTime)   |            4 ms |        14326 ms |
|[B2.2] Cuncurrently insert N characters at random positions (memUsed)     |          1.3 MB |        109.5 MB |
|[B2.3] Cuncurrently insert N words at random positions (time)             |           41 ms |        61043 ms |
|[B2.3] Cuncurrently insert N words at random positions (updateSize)       |     87471 bytes |   8895997 bytes |
|[B2.3] Cuncurrently insert N words at random positions (docSize)          |     87643 bytes |   9427864 bytes |
|[B2.3] Cuncurrently insert N words at random positions (parseTime)        |           17 ms |        22890 ms |
|[B2.3] Cuncurrently insert N words at random positions (memUsed)          |         10.7 MB |        376.5 MB |
|[B2.4] Cuncurrently insert & delete (time)                                |           78 ms |        94111 ms |
|[B2.4] Cuncurrently insert & delete (updateSize)                          |    135735 bytes |  13214933 bytes |
|[B2.4] Cuncurrently insert & delete (docSize)                             |    135911 bytes |  13992066 bytes |
|[B2.4] Cuncurrently insert & delete (parseTime)                           |           13 ms |         4805 ms |
|[B2.4] Cuncurrently insert & delete (memUsed)                             |         12.8 MB |        278.1 MB |
|[B3.1] √N clients concurrently set number in Map (time)                   |            4 ms |           17 ms |
|[B3.1] √N clients concurrently set number in Map (updateSize)             |      1673 bytes |      8576 bytes |
|[B3.1] √N clients concurrently set number in Map (docSize)                |      1148 bytes |     10046 bytes |
|[B3.1] √N clients concurrently set number in Map (parseTime)              |            0 ms |           16 ms |
|[B3.1] √N clients concurrently set number in Map (memUsed)                |          4.4 MB |             0 B |
|[B3.2] √N clients concurrently set Object in Map (time)                   |            7 ms |           35 ms |
|[B3.2] √N clients concurrently set Object in Map (updateSize)             |      3284 bytes |     23912 bytes |
|[B3.2] √N clients concurrently set Object in Map (docSize)                |      1494 bytes |     26516 bytes |
|[B3.2] √N clients concurrently set Object in Map (parseTime)              |            1 ms |           19 ms |
|[B3.2] √N clients concurrently set Object in Map (memUsed)                |          5.1 MB |          3.4 MB |
|[B3.3] √N clients concurrently set String in Map (time)                   |            3 ms |           15 ms |
|[B3.3] √N clients concurrently set String in Map (updateSize)             |      6964 bytes |     13878 bytes |
|[B3.3] √N clients concurrently set String in Map (docSize)                |      1253 bytes |     15348 bytes |
|[B3.3] √N clients concurrently set String in Map (parseTime)              |            0 ms |           10 ms |
|[B3.3] √N clients concurrently set String in Map (memUsed)                |          4.6 MB |          8.9 MB |
|[B3.4] √N clients concurrently insert text in Array (time)                |            2 ms |           19 ms |
|[B3.4] √N clients concurrently insert text in Array (updateSize)          |      1769 bytes |     17392 bytes |
|[B3.4] √N clients concurrently insert text in Array (docSize)             |       873 bytes |     19541 bytes |
|[B3.4] √N clients concurrently insert text in Array (parseTime)           |            0 ms |           28 ms |
|[B3.4] √N clients concurrently insert text in Array (memUsed)             |             0 B |          5.5 MB |
|[B4] Apply real-world editing dataset (time)                              |         5560 ms |       561757 ms |
|[B4] Apply real-world editing dataset (updateSize)                        |   7565904 bytes |  75675634 bytes |
|[B4] Apply real-world editing dataset (encodeTime)                        |            8 ms |         3731 ms |
|[B4] Apply real-world editing dataset (docSize)                           |    159929 bytes |  83966886 bytes |
|[B4] Apply real-world editing dataset (parseTime)                         |           38 ms |        39246 ms |
|[B4] Apply real-world editing dataset (memUsed)                           |          7.5 MB |             0 B |
|[B4 x 100] Apply real-world editing dataset 100 times (time)              |       215921 ms |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (encodeTime)        |          779 ms |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (docSize)           |  15989245 bytes |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (parseTime)         |         1952 ms |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (memUsed)           |        468.1 MB |                 |


| N = 60000 | Yjs | automerge |
| :- | -: | -: |
|Bundle size                                                               |     65939 bytes |    259763 bytes |
|Bundle size (gzipped)                                                     |     19383 bytes |     61478 bytes |
|[B1.1] Append N characters (time)                                         |         1582 ms |                 |
|[B1.1] Append N characters (avgUpdateSize)                                |        29 bytes |                 |
|[B1.1] Append N characters (docSize)                                      |     60034 bytes |                 |
|[B1.1] Append N characters (parseTime)                                    |            1 ms |                 |
|[B1.1] Append N characters (memUsed)                                      |         16.3 MB |                 |
|[B1.1] Append N characters                                                |                 |        skipping |
|[B1.2] Insert string of length N (time)                                   |            8 ms |                 |
|[B1.2] Insert string of length N (avgUpdateSize)                          |     60034 bytes |                 |
|[B1.2] Insert string of length N (docSize)                                |     60034 bytes |                 |
|[B1.2] Insert string of length N (parseTime)                              |            1 ms |                 |
|[B1.2] Insert string of length N (memUsed)                                |          1.8 MB |                 |
|[B1.2] Insert string of length N                                          |                 |        skipping |
|[B1.3] Prepend N characters (time)                                        |         1229 ms |                 |
|[B1.3] Prepend N characters (avgUpdateSize)                               |        29 bytes |                 |
|[B1.3] Prepend N characters (docSize)                                     |     60047 bytes |                 |
|[B1.3] Prepend N characters (parseTime)                                   |           45 ms |                 |
|[B1.3] Prepend N characters (memUsed)                                     |         35.2 MB |                 |
|[B1.3] Prepend N characters                                               |                 |        skipping |
|[B1.4] Insert N characters at random positions (time)                     |         1801 ms |                 |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |        31 bytes |                 |
|[B1.4] Insert N characters at random positions (docSize)                  |    374543 bytes |                 |
|[B1.4] Insert N characters at random positions (parseTime)                |           53 ms |                 |
|[B1.4] Insert N characters at random positions (memUsed)                  |         48.9 MB |                 |
|[B1.4] Insert N characters at random positions                            |                 |        skipping |
|[B1.5] Insert N words at random positions (time)                          |         5711 ms |                 |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |        36 bytes |                 |
|[B1.5] Insert N words at random positions (docSize)                       |    932585 bytes |                 |
|[B1.5] Insert N words at random positions (parseTime)                     |          205 ms |                 |
|[B1.5] Insert N words at random positions (memUsed)                       |         51.2 MB |                 |
|[B1.5] Insert N words at random positions                                 |                 |        skipping |
|[B1.6] Insert string, then delete it (time)                               |            7 ms |                 |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |     60057 bytes |                 |
|[B1.6] Insert string, then delete it (docSize)                            |        40 bytes |                 |
|[B1.6] Insert string, then delete it (parseTime)                          |            0 ms |                 |
|[B1.6] Insert string, then delete it (memUsed)                            |        924.7 kB |                 |
|[B1.6] Insert string, then delete it                                      |                 |        skipping |
|[B1.7] Insert/Delete strings at random positions (time)                   |         4771 ms |                 |
|[B1.7] Insert/Delete strings at random positions (avgUpdateSize)          |        32 bytes |                 |
|[B1.7] Insert/Delete strings at random positions (docSize)                |    362959 bytes |                 |
|[B1.7] Insert/Delete strings at random positions (parseTime)              |           86 ms |                 |
|[B1.7] Insert/Delete strings at random positions (memUsed)                |         67.7 MB |                 |
|[B1.7] Insert/Delete strings at random positions                          |                 |        skipping |
|[B1.8] Append N numbers (time)                                            |        15069 ms |                 |
|[B1.8] Append N numbers (avgUpdateSize)                                   |        34 bytes |                 |
|[B1.8] Append N numbers (docSize)                                         |    356220 bytes |                 |
|[B1.8] Append N numbers (parseTime)                                       |            2 ms |                 |
|[B1.8] Append N numbers (memUsed)                                         |         19.5 MB |                 |
|[B1.8] Append N numbers                                                   |                 |        skipping |
|[B1.9] Insert Array of N numbers (time)                                   |            6 ms |                 |
|[B1.9] Insert Array of N numbers (avgUpdateSize)                          |    356278 bytes |                 |
|[B1.9] Insert Array of N numbers (docSize)                                |    356278 bytes |                 |
|[B1.9] Insert Array of N numbers (parseTime)                              |            2 ms |                 |
|[B1.9] Insert Array of N numbers (memUsed)                                |             0 B |                 |
|[B1.9] Insert Array of N numbers                                          |                 |        skipping |
|[B1.10] Prepend N numbers (time)                                          |         1185 ms |                 |
|[B1.10] Prepend N numbers (avgUpdateSize)                                 |        34 bytes |                 |
|[B1.10] Prepend N numbers (docSize)                                       |    356347 bytes |                 |
|[B1.10] Prepend N numbers (parseTime)                                     |           29 ms |                 |
|[B1.10] Prepend N numbers (memUsed)                                       |             0 B |                 |
|[B1.10] Prepend N numbers                                                 |                 |        skipping |
|[B1.11] Insert N numbers at random positions (time)                       |         1901 ms |                 |
|[B1.11] Insert N numbers at random positions (avgUpdateSize)              |        36 bytes |                 |
|[B1.11] Insert N numbers at random positions (docSize)                    |    670910 bytes |                 |
|[B1.11] Insert N numbers at random positions (parseTime)                  |           52 ms |                 |
|[B1.11] Insert N numbers at random positions (memUsed)                    |         84.5 MB |                 |
|[B1.11] Insert N numbers at random positions                              |                 |        skipping |
|[B2.1] Cuncurrently insert string of length N at index 0 (time)           |            5 ms |                 |
|[B2.1] Cuncurrently insert string of length N at index 0 (updateSize)     |    120064 bytes |                 |
|[B2.1] Cuncurrently insert string of length N at index 0 (docSize)        |    120154 bytes |                 |
|[B2.1] Cuncurrently insert string of length N at index 0 (parseTime)      |            2 ms |                 |
|[B2.1] Cuncurrently insert string of length N at index 0 (memUsed)        |          4.2 MB |                 |
|[B2.1] Cuncurrently insert string of length N at index 0                  |                 |        skipping |
|[B2.2] Cuncurrently insert N characters at random positions (time)        |         1017 ms |                 |
|[B2.2] Cuncurrently insert N characters at random positions (updateSize)  |    760850 bytes |                 |
|[B2.2] Cuncurrently insert N characters at random positions (docSize)     |    760942 bytes |                 |
|[B2.2] Cuncurrently insert N characters at random positions (parseTime)   |           91 ms |                 |
|[B2.2] Cuncurrently insert N characters at random positions (memUsed)     |             0 B |                 |
|[B2.2] Cuncurrently insert N characters at random positions               |                 |        skipping |
|[B2.3] Cuncurrently insert N words at random positions (time)             |         9163 ms |                 |
|[B2.3] Cuncurrently insert N words at random positions (updateSize)       |   1877355 bytes |                 |
|[B2.3] Cuncurrently insert N words at random positions (docSize)          |   1877486 bytes |                 |
|[B2.3] Cuncurrently insert N words at random positions (parseTime)        |          344 ms |                 |
|[B2.3] Cuncurrently insert N words at random positions (memUsed)          |             0 B |                 |
|[B2.3] Cuncurrently insert N words at random positions                    |                 |        skipping |
|[B2.4] Cuncurrently insert & delete (time)                                |        18214 ms |                 |
|[B2.4] Cuncurrently insert & delete (updateSize)                          |   2883749 bytes |                 |
|[B2.4] Cuncurrently insert & delete (docSize)                             |   2883876 bytes |                 |
|[B2.4] Cuncurrently insert & delete (parseTime)                           |          661 ms |                 |
|[B2.4] Cuncurrently insert & delete (memUsed)                             |        258.2 MB |                 |
|[B2.4] Cuncurrently insert & delete                                       |                 |        skipping |
|[B3.1] √N clients concurrently set number in Map (time)                   |           20 ms |                 |
|[B3.1] √N clients concurrently set number in Map (updateSize)             |      7736 bytes |                 |
|[B3.1] √N clients concurrently set number in Map (docSize)                |      5121 bytes |                 |
|[B3.1] √N clients concurrently set number in Map (parseTime)              |            3 ms |                 |
|[B3.1] √N clients concurrently set number in Map (memUsed)                |             0 B |                 |
|[B3.1] √N clients concurrently set number in Map                          |                 |        skipping |
|[B3.2] √N clients concurrently set Object in Map (time)                   |           29 ms |                 |
|[B3.2] √N clients concurrently set Object in Map (updateSize)             |     15011 bytes |                 |
|[B3.2] √N clients concurrently set Object in Map (docSize)                |      6612 bytes |                 |
|[B3.2] √N clients concurrently set Object in Map (parseTime)              |            2 ms |                 |
|[B3.2] √N clients concurrently set Object in Map (memUsed)                |          6.6 MB |                 |
|[B3.2] √N clients concurrently set Object in Map                          |                 |        skipping |
|[B3.3] √N clients concurrently set String in Map (time)                   |           24 ms |                 |
|[B3.3] √N clients concurrently set String in Map (updateSize)             |    159565 bytes |                 |
|[B3.3] √N clients concurrently set String in Map (docSize)                |      5601 bytes |                 |
|[B3.3] √N clients concurrently set String in Map (parseTime)              |            3 ms |                 |
|[B3.3] √N clients concurrently set String in Map (memUsed)                |          6.4 MB |                 |
|[B3.3] √N clients concurrently set String in Map                          |                 |        skipping |
|[B3.4] √N clients concurrently insert text in Array (time)                |           20 ms |                 |
|[B3.4] √N clients concurrently insert text in Array (updateSize)          |      8185 bytes |                 |
|[B3.4] √N clients concurrently insert text in Array (docSize)             |      4062 bytes |                 |
|[B3.4] √N clients concurrently insert text in Array (parseTime)           |            0 ms |                 |
|[B3.4] √N clients concurrently insert text in Array (memUsed)             |             0 B |                 |
|[B3.4] √N clients concurrently insert text in Array                       |                 |        skipping |
|[B4] Apply real-world editing dataset (time)                              |         5238 ms |                 |
|[B4] Apply real-world editing dataset (updateSize)                        |   7306126 bytes |                 |
|[B4] Apply real-world editing dataset (encodeTime)                        |           13 ms |                 |
|[B4] Apply real-world editing dataset (docSize)                           |    159927 bytes |                 |
|[B4] Apply real-world editing dataset (parseTime)                         |           16 ms |                 |
|[B4] Apply real-world editing dataset (memUsed)                           |          6.9 MB |                 |
|[B4] Apply real-world editing dataset                                     |                 |        skipping |
|[B4 x 100] Apply real-world editing dataset 100 times (time)              |       198383 ms |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (encodeTime)        |          617 ms |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (docSize)           |  15989245 bytes |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (parseTime)         |         2127 ms |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (memUsed)           |        165.5 MB |                 |



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
