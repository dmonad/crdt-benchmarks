
# CRDT benchmarks

> A collection of reproducible benchmarks. *PRs are welcome.*

```sh
# Install Node.js https://nodejs.org
npm i && npm start
```

## Benchmarks

#### B1: No conflicts

Simulate two clients. One client modifies a text object and sends update messages to the other client. We measure the time to perform the task (`time`), the amount of data exchanged (`avgUpdateSize`), the time it takes to encode the document after the task is performed (`encodeTime`), the size of the encoded document after the task is performed (`docSize`), the time to parse the encoded document (`parseTime`), and the memory used to hold the decoded document (`memUsed`).

#### B2: Two users producing conflicts

Simulate two clients. Both start with a synced text object containing 100 characters. Both clients modify the text object in a single transaction and then send their changes to the other client. We measure the time to sync concurrent changes into a single client (`time`), the size of the update messages (`updateSize`), the time it takes to encode the document after the task is performed (`encodeTime`), the size of the encoded document after the task is performed (`docSize`), the time to parse the encoded document (`parseTime`), and the memory used to hold the decoded document (`memUsed`).

#### B3: Many conflicts

Simulate `√N` concurrent actions. We measure the time to perform the task
and sync all clients (`time`), the size of the update messages (`updateSize`),
the time it takes to encode the document after the task is performed  (`encodeTime`),
the size of the encoded document after the task is performed (`docSize`),
the time to parse the encoded document (`parseTime`), and the memory used to hold the decoded document (`memUsed`).

The logarithm of `N` was chosen because `√N` concurrent actions may result in up to `√N^2 - 1`
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
|Bundle size                                                               |     65923 bytes |    316472 bytes |
|Bundle size (gzipped)                                                     |     19377 bytes |     79455 bytes |
|[B1.1] Append N characters (time)                                         |          214 ms |        18486 ms |
|[B1.1] Append N characters (avgUpdateSize)                                |        27 bytes |       107 bytes |
|[B1.1] Append N characters (encodeTime)                                   |            1 ms |          286 ms |
|[B1.1] Append N characters (docSize)                                      |      3031 bytes |      3281 bytes |
|[B1.1] Append N characters (parseTime)                                    |            0 ms |         1533 ms |
|[B1.1] Append N characters (memUsed)                                      |          683 kB |        180.4 MB |
|[B1.2] Insert string of length N (time)                                   |            1 ms |         1042 ms |
|[B1.2] Insert string of length N (avgUpdateSize)                          |      3031 bytes |      3116 bytes |
|[B1.2] Insert string of length N (encodeTime)                             |            0 ms |           72 ms |
|[B1.2] Insert string of length N (docSize)                                |      3031 bytes |      3178 bytes |
|[B1.2] Insert string of length N (parseTime)                              |            0 ms |          351 ms |
|[B1.2] Insert string of length N (memUsed)                                |        162.3 kB |           67 MB |
|[B1.3] Prepend N characters (time)                                        |          173 ms |        40337 ms |
|[B1.3] Prepend N characters (avgUpdateSize)                               |        27 bytes |       106 bytes |
|[B1.3] Prepend N characters (encodeTime)                                  |            4 ms |          204 ms |
|[B1.3] Prepend N characters (docSize)                                     |      3041 bytes |      3366 bytes |
|[B1.3] Prepend N characters (parseTime)                                   |            8 ms |        10402 ms |
|[B1.3] Prepend N characters (memUsed)                                     |             0 B |             0 B |
|[B1.4] Insert N characters at random positions (time)                     |          154 ms |        18227 ms |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |        29 bytes |       107 bytes |
|[B1.4] Insert N characters at random positions (encodeTime)               |            4 ms |          259 ms |
|[B1.4] Insert N characters at random positions (docSize)                  |     14470 bytes |     14223 bytes |
|[B1.4] Insert N characters at random positions (parseTime)                |            1 ms |         1553 ms |
|[B1.4] Insert N characters at random positions (memUsed)                  |         10.3 MB |             0 B |
|[B1.5] Insert N words at random positions (time)                          |          151 ms |        24650 ms |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |        35 bytes |       116 bytes |
|[B1.5] Insert N words at random positions (encodeTime)                    |            4 ms |          686 ms |
|[B1.5] Insert N words at random positions (docSize)                       |     42161 bytes |     64605 bytes |
|[B1.5] Insert N words at random positions (parseTime)                     |            3 ms |         3889 ms |
|[B1.5] Insert N words at random positions (memUsed)                       |         16.8 MB |        173.3 MB |
|[B1.6] Insert string, then delete it (time)                               |            2 ms |         3021 ms |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |      3053 bytes |      3145 bytes |
|[B1.6] Insert string, then delete it (encodeTime)                         |            0 ms |           76 ms |
|[B1.6] Insert string, then delete it (docSize)                            |        38 bytes |      3193 bytes |
|[B1.6] Insert string, then delete it (parseTime)                          |            0 ms |          469 ms |
|[B1.6] Insert string, then delete it (memUsed)                            |        143.2 kB |         89.9 MB |
|[B1.7] Insert/Delete strings at random positions (time)                   |          182 ms |        22057 ms |
|[B1.7] Insert/Delete strings at random positions (avgUpdateSize)          |        30 bytes |       119 bytes |
|[B1.7] Insert/Delete strings at random positions (encodeTime)             |            8 ms |          407 ms |
|[B1.7] Insert/Delete strings at random positions (docSize)                |     15124 bytes |     41615 bytes |
|[B1.7] Insert/Delete strings at random positions (parseTime)              |            4 ms |         2446 ms |
|[B1.7] Insert/Delete strings at random positions (memUsed)                |          2.4 MB |        464.1 MB |
|[B1.8] Append N numbers (time)                                            |          194 ms |        19274 ms |
|[B1.8] Append N numbers (avgUpdateSize)                                   |        32 bytes |       111 bytes |
|[B1.8] Append N numbers (encodeTime)                                      |            0 ms |          228 ms |
|[B1.8] Append N numbers (docSize)                                         |     17855 bytes |     16157 bytes |
|[B1.8] Append N numbers (parseTime)                                       |            0 ms |         1482 ms |
|[B1.8] Append N numbers (memUsed)                                         |         60.3 kB |             0 B |
|[B1.9] Insert Array of N numbers (time)                                   |            2 ms |         1001 ms |
|[B1.9] Insert Array of N numbers (avgUpdateSize)                          |     17824 bytes |     16096 bytes |
|[B1.9] Insert Array of N numbers (encodeTime)                             |            0 ms |           19 ms |
|[B1.9] Insert Array of N numbers (docSize)                                |     17824 bytes |     16159 bytes |
|[B1.9] Insert Array of N numbers (parseTime)                              |            0 ms |          217 ms |
|[B1.9] Insert Array of N numbers (memUsed)                                |          1.6 MB |         45.3 MB |
|[B1.10] Prepend N numbers (time)                                          |          104 ms |        45167 ms |
|[B1.10] Prepend N numbers (avgUpdateSize)                                 |        32 bytes |       110 bytes |
|[B1.10] Prepend N numbers (encodeTime)                                    |            1 ms |          200 ms |
|[B1.10] Prepend N numbers (docSize)                                       |     17867 bytes |     16212 bytes |
|[B1.10] Prepend N numbers (parseTime)                                     |            1 ms |         9909 ms |
|[B1.10] Prepend N numbers (memUsed)                                       |             0 B |             0 B |
|[B1.11] Insert N numbers at random positions (time)                       |          119 ms |        19544 ms |
|[B1.11] Insert N numbers at random positions (avgUpdateSize)              |        34 bytes |       111 bytes |
|[B1.11] Insert N numbers at random positions (encodeTime)                 |            1 ms |          212 ms |
|[B1.11] Insert N numbers at random positions (docSize)                    |     29311 bytes |     27092 bytes |
|[B1.11] Insert N numbers at random positions (parseTime)                  |            1 ms |         1312 ms |
|[B1.11] Insert N numbers at random positions (memUsed)                    |           13 MB |        290.6 MB |
|[B2.1] Cuncurrently insert string of length N at index 0 (time)           |            1 ms |         2166 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (updateSize)     |      6058 bytes |      6251 bytes |
|[B2.1] Cuncurrently insert string of length N at index 0 (encodeTime)     |            1 ms |           63 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (docSize)        |      6149 bytes |      6377 bytes |
|[B2.1] Cuncurrently insert string of length N at index 0 (parseTime)      |            0 ms |          645 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (memUsed)        |        353.9 kB |             0 B |
|[B2.2] Cuncurrently insert N characters at random positions (time)        |           48 ms |        17323 ms |
|[B2.2] Cuncurrently insert N characters at random positions (updateSize)  |     35068 bytes |     11817 bytes |
|[B2.2] Cuncurrently insert N characters at random positions (encodeTime)  |            1 ms |           54 ms |
|[B2.2] Cuncurrently insert N characters at random positions (docSize)     |     35162 bytes |     17764 bytes |
|[B2.2] Cuncurrently insert N characters at random positions (parseTime)   |            8 ms |         7837 ms |
|[B2.2] Cuncurrently insert N characters at random positions (memUsed)     |          4.6 MB |        111.7 MB |
|[B2.3] Cuncurrently insert N words at random positions (time)             |           44 ms |        72344 ms |
|[B2.3] Cuncurrently insert N words at random positions (updateSize)       |     87471 bytes |     81005 bytes |
|[B2.3] Cuncurrently insert N words at random positions (encodeTime)       |            3 ms |          432 ms |
|[B2.3] Cuncurrently insert N words at random positions (docSize)          |     87643 bytes |    115879 bytes |
|[B2.3] Cuncurrently insert N words at random positions (parseTime)        |           26 ms |        14441 ms |
|[B2.3] Cuncurrently insert N words at random positions (memUsed)          |            6 MB |        340.8 MB |
|[B2.4] Cuncurrently insert & delete (time)                                |          105 ms |       175504 ms |
|[B2.4] Cuncurrently insert & delete (updateSize)                          |    135735 bytes |    196343 bytes |
|[B2.4] Cuncurrently insert & delete (encodeTime)                          |            5 ms |          805 ms |
|[B2.4] Cuncurrently insert & delete (docSize)                             |    135911 bytes |    208930 bytes |
|[B2.4] Cuncurrently insert & delete (parseTime)                           |           26 ms |         7792 ms |
|[B2.4] Cuncurrently insert & delete (memUsed)                             |          9.4 MB |        143.4 MB |
|[B3.1] √N clients concurrently set number in Map (time)                   |           10 ms |           24 ms |
|[B3.1] √N clients concurrently set number in Map (updateSize)             |      1672 bytes |      3240 bytes |
|[B3.1] √N clients concurrently set number in Map (encodeTime)             |            0 ms |            4 ms |
|[B3.1] √N clients concurrently set number in Map (docSize)                |      1145 bytes |      2887 bytes |
|[B3.1] √N clients concurrently set number in Map (parseTime)              |            1 ms |           25 ms |
|[B3.1] √N clients concurrently set number in Map (memUsed)                |             0 B |          9.1 MB |
|[B3.2] √N clients concurrently set Object in Map (time)                   |            7 ms |           39 ms |
|[B3.2] √N clients concurrently set Object in Map (updateSize)             |      3284 bytes |      5066 bytes |
|[B3.2] √N clients concurrently set Object in Map (encodeTime)             |            0 ms |            9 ms |
|[B3.2] √N clients concurrently set Object in Map (docSize)                |      1495 bytes |      4305 bytes |
|[B3.2] √N clients concurrently set Object in Map (parseTime)              |            1 ms |           41 ms |
|[B3.2] √N clients concurrently set Object in Map (memUsed)                |          5.1 MB |          2.4 MB |
|[B3.3] √N clients concurrently set String in Map (time)                   |            4 ms |           22 ms |
|[B3.3] √N clients concurrently set String in Map (updateSize)             |      6962 bytes |      8576 bytes |
|[B3.3] √N clients concurrently set String in Map (encodeTime)             |            0 ms |            4 ms |
|[B3.3] √N clients concurrently set String in Map (docSize)                |      1250 bytes |      8171 bytes |
|[B3.3] √N clients concurrently set String in Map (parseTime)              |            1 ms |           28 ms |
|[B3.3] √N clients concurrently set String in Map (memUsed)                |          4.6 MB |          7.5 MB |
|[B3.4] √N clients concurrently insert text in Array (time)                |            5 ms |           26 ms |
|[B3.4] √N clients concurrently insert text in Array (updateSize)          |      1772 bytes |      6561 bytes |
|[B3.4] √N clients concurrently insert text in Array (encodeTime)          |            0 ms |            5 ms |
|[B3.4] √N clients concurrently insert text in Array (docSize)             |       876 bytes |      3001 bytes |
|[B3.4] √N clients concurrently insert text in Array (parseTime)           |            0 ms |           42 ms |
|[B3.4] √N clients concurrently insert text in Array (memUsed)             |             0 B |          4.5 MB |
|[B4] Apply real-world editing dataset (time)                              |         6086 ms |       750162 ms |
|[B4] Apply real-world editing dataset (avgUpdateSize)                     |        29 bytes |               - |
|[B4] Apply real-world editing dataset (encodeTime)                        |           28 ms |        63353 ms |
|[B4] Apply real-world editing dataset (docSize)                           |    159929 bytes |    296366 bytes |
|[B4] Apply real-world editing dataset (parseTime)                         |           68 ms |       207837 ms |
|[B4] Apply real-world editing dataset (memUsed)                           |             0 B |             0 B |
|[B4 x 100] Apply real-world editing dataset 100 times (time)              |       167158 ms |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (encodeTime)        |         2271 ms |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (docSize)           |  15989245 bytes |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (parseTime)         |         2260 ms |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (memUsed)           |        466.4 MB |                 |


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
