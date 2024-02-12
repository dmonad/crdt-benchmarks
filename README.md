
# CRDT benchmarks

> A collection of reproducible benchmarks. *PRs are welcome.*

```sh
# Install Node.js https://nodejs.org
npm i
# Run all benchmarks (takes quite a long time)
npm start
# Run all benchmarks using bun
npm start:bun
# Run a specific benchmark (e.g. yjs)
cd benchmarks/yjs && npm start
# Run a specific benchmark in the browser
cd benchmarks/yjs && npm start:browser
# print collected results
npm run table
```

## Benchmarks

#### B1: No conflicts

Simulate two clients. One client modifies a text object and sends update
messages to the other client. We measure the time to perform the task (`time`),
the amount of data exchanged (`avgUpdateSize`), the size of the encoded document
after the task is performed (`docSize`), the time to parse the encoded document
(`parseTime`), and the memory used to hold the decoded document (`memUsed`).

#### B2: Two users producing conflicts

Simulate two clients. Both start with a synced text object containing 100
characters. Both clients modify the text object in a single transaction and then
send their changes to the other client. We measure the time to sync concurrent
changes into a single client (`time`), the size of the update messages
(`updateSize`), the size of the encoded document after the task is performed
(`docSize`), the time to parse the encoded document (`parseTime`), and the
memory used to hold the decoded document (`memUsed`).

#### B3: Many conflicts

Simulate `√N` concurrent actions. We measure the time to perform the task
and sync all clients (`time`), the size of the update messages (`updateSize`),
the size of the encoded document after the task is performed (`docSize`),
the time to parse the encoded document (`parseTime`), and the memory used to hold the decoded document (`memUsed`).
The logarithm of `N` was
chosen because `√N` concurrent actions may result in up to `√N^2 - 1`
conflicts (apply action 1: 0 conlict; apply action2: 1 conflict, apply action 2: 2 conflicts, ..).

#### B4: Real-world editing dataset

Replay a real-world editing dataset. This dataset contains the
character-by-character editing trace of a large-ish text document, the LaTeX
source of this paper: https://arxiv.org/abs/1608.03960

Source: https://github.com/automerge/automerge-perf/tree/master/edit-by-index

* 182,315 single-character insertion operations
*  77,463 single-character deletion operations
* 259,778 operations totally
* 104,852 characters in the final document

We simulate one client replaying all changes and storing each update. We measure
the time to replay the changes and extract the content (`time`), the size of all
update messages (`updateSize`), the size of the encoded document after the task
is performed (`docSize`), the time to encode the document (`encodeTime`), the
time to parse the encoded document and extract the content (`parseTime`), and
the memory used to hold the decoded document in memory (`memUsed`).

** For now we replay all actions in a single transaction, otherwise Automerge is running out of memory.

##### [B4 x 100] Real-world editing dataset 100 times

Replay the [B4] dataset one hundred times. The final document has a size of over
10 million characters. As comparison, the book "Game of Thrones: A Song of Ice
and Fire" is only 1.6 million characters long (including whitespace).

* 18,231,500 single-character insertion operations
*  7,746,300 single-character deletion operations
* 25,977,800 operations totally
* 10,485,200 characters in the final document

### Results

**Notes**
* The benchmarks were performed on a desktop computer "Intel® Core™ i5-8400 CPU
@ 2.80GHz × 6" and Node 20.5.0.
* There is a more exchaustive benchmark at the bottom that only runs benchmarks
on Yjs.
* `memUsed` only approximates the amount of memory used. We run the JavaScript
garbage collector and use the heap-size difference before and after the
benchmark is performed. If the heap is highly fragmented, the heap size might be
larger than the actual amount of data stored in the heap. In some cases this
even leads to a `memUsed` of less than zero.
* `memUsed` does not measure the memory usage of the wasm runtime.
* Automerge can perform the `B4` benchmark in about 1 second (see `time`) if all
changes are applied within a single `change` transaction. However, our
benchmarks test individual edits that generate individual update events as this
more closely simulates actual user behavior. See #21
* Note that `parseTime` is significantly higher with `automerge` and `loro` when
the initial document is not empty (e.g. when syncing content from a remote
server). 
* Loro has a concept named `snapshot`, which can significantly reduce
loading time as it contains the operations **and** the in-memory
representation of the document. Note that this feature is only useful in
applications that persist the document in regular intervals
(which has it's own set of drawbacks, as encoding will block the ui). We enabled
this feature by default. You can disable/enable this feature in
`./benchmarks/loro/factory.js`.

|N = 6000 | [yjs](https://github.com/yjs/yjs) | [ywasm](https://github.com/y-crdt/y-crdt/tree/main/ywasm) | [loro](https://github.com/loro-dev/loro) | [automerge](https://github.com/automerge/automerge/) |
| :- |  -: | -: | -: | -:  |
|Version                                                                   |          13.6.11 |            0.9.3 |           0.10.1 |           2.1.10 |
|Bundle size                                                               |     69,124 bytes |    677,667 bytes |  1,052,250 bytes |  1,737,571 bytes |
|Bundle size (gzipped)                                                     |     20,100 bytes |    213,833 bytes |    399,276 bytes |    604,118 bytes |
|[B1.1] Append N characters (time)                                         |           188 ms |           154 ms |           120 ms |           365 ms |
|[B1.1] Append N characters (avgUpdateSize)                                |         27 bytes |         27 bytes |        109 bytes |        121 bytes |
|[B1.1] Append N characters (encodeTime)                                   |             1 ms |             1 ms |             1 ms |             7 ms |
|[B1.1] Append N characters (docSize)                                      |      6,031 bytes |      6,031 bytes |      6,162 bytes |      3,992 bytes |
|[B1.1] Append N characters (memUsed)                                      |              0 B |              0 B |              0 B |              0 B |
|[B1.1] Append N characters (parseTime)                                    |            32 ms |            23 ms |            26 ms |            80 ms |
|[B1.2] Insert string of length N (time)                                   |             0 ms |             0 ms |             0 ms |             9 ms |
|[B1.2] Insert string of length N (avgUpdateSize)                          |      6,031 bytes |      6,031 bytes |      6,107 bytes |      6,201 bytes |
|[B1.2] Insert string of length N (encodeTime)                             |             0 ms |             0 ms |             0 ms |             3 ms |
|[B1.2] Insert string of length N (docSize)                                |      6,031 bytes |      6,031 bytes |      6,117 bytes |      3,974 bytes |
|[B1.2] Insert string of length N (memUsed)                                |          17.4 kB |              0 B |              0 B |           8.8 kB |
|[B1.2] Insert string of length N (parseTime)                              |            27 ms |            34 ms |            29 ms |            47 ms |
|[B1.3] Prepend N characters (time)                                        |           119 ms |            23 ms |            81 ms |           307 ms |
|[B1.3] Prepend N characters (avgUpdateSize)                               |         27 bytes |         27 bytes |        108 bytes |        116 bytes |
|[B1.3] Prepend N characters (encodeTime)                                  |             3 ms |             0 ms |            10 ms |             5 ms |
|[B1.3] Prepend N characters (docSize)                                     |      6,041 bytes |      6,041 bytes |     12,125 bytes |      3,988 bytes |
|[B1.3] Prepend N characters (memUsed)                                     |         919.9 kB |           8.3 kB |          26.3 kB |              0 B |
|[B1.3] Prepend N characters (parseTime)                                   |            93 ms |            31 ms |            26 ms |            63 ms |
|[B1.4] Insert N characters at random positions (time)                     |           131 ms |           128 ms |            79 ms |           310 ms |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |         29 bytes |         29 bytes |        109 bytes |        121 bytes |
|[B1.4] Insert N characters at random positions (encodeTime)               |             1 ms |             1 ms |            35 ms |             8 ms |
|[B1.4] Insert N characters at random positions (docSize)                  |     29,554 bytes |     29,554 bytes |     35,401 bytes |     24,743 bytes |
|[B1.4] Insert N characters at random positions (memUsed)                  |         883.6 kB |              0 B |              0 B |             9 kB |
|[B1.4] Insert N characters at random positions (parseTime)                |            76 ms |            29 ms |            31 ms |            79 ms |
|[B1.5] Insert N words at random positions (time)                          |           154 ms |           449 ms |            82 ms |           449 ms |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |         36 bytes |         36 bytes |        117 bytes |        131 bytes |
|[B1.5] Insert N words at random positions (encodeTime)                    |             5 ms |             1 ms |            69 ms |            21 ms |
|[B1.5] Insert N words at random positions (docSize)                       |     87,924 bytes |     87,924 bytes |     94,524 bytes |     96,203 bytes |
|[B1.5] Insert N words at random positions (memUsed)                       |           2.3 MB |            872 B |           2.1 kB |              0 B |
|[B1.5] Insert N words at random positions (parseTime)                     |            92 ms |            34 ms |            31 ms |           143 ms |
|[B1.6] Insert string, then delete it (time)                               |             1 ms |             1 ms |             2 ms |            22 ms |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |      6,053 bytes |      6,053 bytes |      6,217 bytes |      6,338 bytes |
|[B1.6] Insert string, then delete it (encodeTime)                         |             0 ms |             0 ms |             0 ms |             3 ms |
|[B1.6] Insert string, then delete it (docSize)                            |         38 bytes |         38 bytes |      6,120 bytes |      3,993 bytes |
|[B1.6] Insert string, then delete it (memUsed)                            |              0 B |              0 B |              0 B |             2 kB |
|[B1.6] Insert string, then delete it (parseTime)                          |            44 ms |            28 ms |            27 ms |            37 ms |
|[B1.7] Insert/Delete strings at random positions (time)                   |           158 ms |           141 ms |            98 ms |           389 ms |
|[B1.7] Insert/Delete strings at random positions (avgUpdateSize)          |         31 bytes |         31 bytes |        113 bytes |        135 bytes |
|[B1.7] Insert/Delete strings at random positions (encodeTime)             |             8 ms |             1 ms |            17 ms |            19 ms |
|[B1.7] Insert/Delete strings at random positions (docSize)                |     28,377 bytes |     28,377 bytes |     50,836 bytes |     59,281 bytes |
|[B1.7] Insert/Delete strings at random positions (memUsed)                |           1.4 MB |            632 B |           1.8 kB |             6 kB |
|[B1.7] Insert/Delete strings at random positions (parseTime)              |           117 ms |            31 ms |            25 ms |           111 ms |
|[B1.8] Append N numbers (time)                                            |           148 ms |            29 ms |            81 ms |           480 ms |
|[B1.8] Append N numbers (avgUpdateSize)                                   |         32 bytes |         32 bytes |        114 bytes |        125 bytes |
|[B1.8] Append N numbers (encodeTime)                                      |             0 ms |             0 ms |             1 ms |             8 ms |
|[B1.8] Append N numbers (docSize)                                         |     35,634 bytes |     35,634 bytes |     35,719 bytes |     26,985 bytes |
|[B1.8] Append N numbers (memUsed)                                         |              0 B |              0 B |              0 B |          61.3 kB |
|[B1.8] Append N numbers (parseTime)                                       |            36 ms |            31 ms |            27 ms |            80 ms |
|[B1.9] Insert Array of N numbers (time)                                   |             1 ms |             2 ms |             9 ms |            38 ms |
|[B1.9] Insert Array of N numbers (avgUpdateSize)                          |     35,657 bytes |     35,657 bytes |     35,735 bytes |     31,199 bytes |
|[B1.9] Insert Array of N numbers (encodeTime)                             |             1 ms |             0 ms |             1 ms |             5 ms |
|[B1.9] Insert Array of N numbers (docSize)                                |     35,657 bytes |     35,657 bytes |     35,742 bytes |     26,953 bytes |
|[B1.9] Insert Array of N numbers (memUsed)                                |          39.3 kB |            608 B |           2.4 kB |          61.6 kB |
|[B1.9] Insert Array of N numbers (parseTime)                              |            33 ms |            26 ms |            22 ms |            53 ms |
|[B1.10] Prepend N numbers (time)                                          |           122 ms |            28 ms |            78 ms |           461 ms |
|[B1.10] Prepend N numbers (avgUpdateSize)                                 |         32 bytes |         36 bytes |        113 bytes |        120 bytes |
|[B1.10] Prepend N numbers (encodeTime)                                    |             3 ms |             1 ms |            10 ms |             7 ms |
|[B1.10] Prepend N numbers (docSize)                                       |     35,665 bytes |     65,658 bytes |     41,748 bytes |     26,987 bytes |
|[B1.10] Prepend N numbers (memUsed)                                       |           1.8 MB |           168 kB |         119.5 kB |          61.5 kB |
|[B1.10] Prepend N numbers (parseTime)                                     |            96 ms |            31 ms |            32 ms |            77 ms |
|[B1.11] Insert N numbers at random positions (time)                       |           134 ms |           144 ms |            78 ms |           433 ms |
|[B1.11] Insert N numbers at random positions (avgUpdateSize)              |         33 bytes |         34 bytes |        114 bytes |        125 bytes |
|[B1.11] Insert N numbers at random positions (encodeTime)                 |             1 ms |             1 ms |            37 ms |             9 ms |
|[B1.11] Insert N numbers at random positions (docSize)                    |     59,136 bytes |     59,152 bytes |     65,016 bytes |     47,746 bytes |
|[B1.11] Insert N numbers at random positions (memUsed)                    |           1.8 MB |              0 B |              0 B |          61.7 kB |
|[B1.11] Insert N numbers at random positions (parseTime)                  |            80 ms |            34 ms |            36 ms |            93 ms |
|[B2.1] Concurrently insert string of length N at index 0 (time)           |             1 ms |             0 ms |             2 ms |            62 ms |
|[B2.1] Concurrently insert string of length N at index 0 (updateSize)     |      6,094 bytes |      6,094 bytes |      9,276 bytes |      9,499 bytes |
|[B2.1] Concurrently insert string of length N at index 0 (encodeTime)     |             0 ms |             0 ms |             0 ms |             5 ms |
|[B2.1] Concurrently insert string of length N at index 0 (docSize)        |     12,152 bytes |     12,151 bytes |     12,248 bytes |      8,011 bytes |
|[B2.1] Concurrently insert string of length N at index 0 (memUsed)        |              0 B |            592 B |           6.4 kB |          14.5 kB |
|[B2.1] Concurrently insert string of length N at index 0 (parseTime)      |            43 ms |            27 ms |            25 ms |            47 ms |
|[B2.2] Concurrently insert N characters at random positions (time)        |            65 ms |           365 ms |            83 ms |           287 ms |
|[B2.2] Concurrently insert N characters at random positions (updateSize)  |     33,444 bytes |    177,007 bytes |     35,554 bytes |     27,476 bytes |
|[B2.2] Concurrently insert N characters at random positions (encodeTime)  |             2 ms |             1 ms |            82 ms |             9 ms |
|[B2.2] Concurrently insert N characters at random positions (docSize)     |     66,852 bytes |     66,860 bytes |     71,858 bytes |     50,683 bytes |
|[B2.2] Concurrently insert N characters at random positions (memUsed)     |           2.4 MB |            392 B |           1.8 kB |              0 B |
|[B2.2] Concurrently insert N characters at random positions (parseTime)   |           101 ms |            34 ms |            30 ms |            53 ms |
|[B2.3] Concurrently insert N words at random positions (time)             |            85 ms |         1,014 ms |           112 ms |           663 ms |
|[B2.3] Concurrently insert N words at random positions (updateSize)       |     88,994 bytes |    215,213 bytes |     93,132 bytes |    122,485 bytes |
|[B2.3] Concurrently insert N words at random positions (encodeTime)       |             4 ms |             4 ms |           145 ms |            38 ms |
|[B2.3] Concurrently insert N words at random positions (docSize)          |    178,137 bytes |    178,130 bytes |    188,458 bytes |    185,019 bytes |
|[B2.3] Concurrently insert N words at random positions (memUsed)          |           5.5 MB |              0 B |           1.5 kB |              0 B |
|[B2.3] Concurrently insert N words at random positions (parseTime)        |            85 ms |            71 ms |            52 ms |           168 ms |
|[B2.4] Concurrently insert & delete (time)                                |           178 ms |         2,786 ms |           208 ms |         1,066 ms |
|[B2.4] Concurrently insert & delete (updateSize)                          |    139,517 bytes |    398,881 bytes |    163,564 bytes |    298,810 bytes |
|[B2.4] Concurrently insert & delete (encodeTime)                          |            12 ms |             6 ms |           233 ms |            62 ms |
|[B2.4] Concurrently insert & delete (docSize)                             |    279,172 bytes |    279,166 bytes |    289,590 bytes |    293,828 bytes |
|[B2.4] Concurrently insert & delete (memUsed)                             |           8.2 MB |              0 B |           1.8 kB |              0 B |
|[B2.4] Concurrently insert & delete (parseTime)                           |           121 ms |            78 ms |            50 ms |           255 ms |
|[B3.1] 20√N clients concurrently set number in Map (time)                 |            75 ms |           290 ms |            56 ms |         1,632 ms |
|[B3.1] 20√N clients concurrently set number in Map (updateSize)           |     49,169 bytes |     49,169 bytes |    161,636 bytes |    283,296 bytes |
|[B3.1] 20√N clients concurrently set number in Map (encodeTime)           |             2 ms |             1 ms |             2 ms |            11 ms |
|[B3.1] 20√N clients concurrently set number in Map (docSize)              |     32,225 bytes |     32,209 bytes |     21,506 bytes |     86,167 bytes |
|[B3.1] 20√N clients concurrently set number in Map (memUsed)              |              0 B |            176 B |            824 B |            344 B |
|[B3.1] 20√N clients concurrently set number in Map (parseTime)            |           104 ms |            70 ms |            40 ms |            37 ms |
|[B3.2] 20√N clients concurrently set Object in Map (time)                 |            84 ms |           278 ms |            67 ms |         1,726 ms |
|[B3.2] 20√N clients concurrently set Object in Map (updateSize)           |     85,082 bytes |     85,085 bytes |    200,630 bytes |    398,090 bytes |
|[B3.2] 20√N clients concurrently set Object in Map (encodeTime)           |             3 ms |             2 ms |             2 ms |            30 ms |
|[B3.2] 20√N clients concurrently set Object in Map (docSize)              |     32,235 bytes |     32,249 bytes |     40,494 bytes |    112,570 bytes |
|[B3.2] 20√N clients concurrently set Object in Map (memUsed)              |              0 B |              0 B |            136 B |              0 B |
|[B3.2] 20√N clients concurrently set Object in Map (parseTime)            |           102 ms |            70 ms |            45 ms |            86 ms |
|[B3.3] 20√N clients concurrently set String in Map (time)                 |            86 ms |           299 ms |           116 ms |         2,335 ms |
|[B3.3] 20√N clients concurrently set String in Map (updateSize)           |  7,826,222 bytes |  7,826,231 bytes |  7,940,240 bytes |  8,063,440 bytes |
|[B3.3] 20√N clients concurrently set String in Map (encodeTime)           |             2 ms |             1 ms |            46 ms |            91 ms |
|[B3.3] 20√N clients concurrently set String in Map (docSize)              |     38,357 bytes |     38,376 bytes |  7,798,572 bytes |     98,047 bytes |
|[B3.3] 20√N clients concurrently set String in Map (memUsed)              |           243 kB |              0 B |            696 B |              0 B |
|[B3.3] 20√N clients concurrently set String in Map (parseTime)            |            97 ms |            52 ms |            55 ms |           118 ms |
|[B3.4] 20√N clients concurrently insert text in Array (time)              |            72 ms |           283 ms |           227 ms |         2,780 ms |
|[B3.4] 20√N clients concurrently insert text in Array (updateSize)        |     52,738 bytes |     52,751 bytes |    166,750 bytes |    311,830 bytes |
|[B3.4] 20√N clients concurrently insert text in Array (encodeTime)        |             2 ms |             1 ms |             8 ms |            17 ms |
|[B3.4] 20√N clients concurrently insert text in Array (docSize)           |     26,583 bytes |     26,596 bytes |     31,119 bytes |     96,463 bytes |
|[B3.4] 20√N clients concurrently insert text in Array (memUsed)           |         588.8 kB |              0 B |            480 B |              0 B |
|[B3.4] 20√N clients concurrently insert text in Array (parseTime)         |            84 ms |            60 ms |            29 ms |            42 ms |
|[B4] Apply real-world editing dataset (time)                              |         5,714 ms |        28,675 ms |         3,089 ms |        14,326 ms |
|[B4] Apply real-world editing dataset (encodeTime)                        |            11 ms |             3 ms |            77 ms |           185 ms |
|[B4] Apply real-world editing dataset (docSize)                           |    159,929 bytes |    159,929 bytes |    258,228 bytes |    129,116 bytes |
|[B4] Apply real-world editing dataset (parseTime)                         |            39 ms |            16 ms |            13 ms |         1,805 ms |
|[B4] Apply real-world editing dataset (memUsed)                           |           3.2 MB |              0 B |              0 B |              0 B |
|[B4x100] Apply real-world editing dataset 100 times (time)                |       608,908 ms |     2,829,633 ms |       309,689 ms |          skipped |
|[B4x100] Apply real-world editing dataset 100 times (encodeTime)          |           365 ms |           186 ms |        14,429 ms |          skipped |
|[B4x100] Apply real-world editing dataset 100 times (docSize)             | 15,989,244 bytes | 15,989,245 bytes | 25,805,795 bytes |          skipped |
|[B4x100] Apply real-world editing dataset 100 times (parseTime)           |         2,622 ms |         1,328 ms |         1,304 ms |          skipped |
|[B4x100] Apply real-world editing dataset 100 times (memUsed)             |         327.1 MB |             24 B |           2.1 kB |          skipped |

##### Older benchmark results that include automerge & delta-crdts

| N = 6000 | [Yjs](https://github.com/yjs/yjs) | [Automerge](https://github.com/automerge/automerge) | [delta-crdts](https://github.com/peer-base/js-delta-crdts) |
| :- | -: | -: | -: |
|Version                                                                   |          13.3.0 |          0.14.1 |          0.10.3 |
|Bundle size                                                               |     65923 bytes |    259763 bytes |    227573 bytes |
|Bundle size (gzipped)                                                     |     19377 bytes |     61478 bytes |     64388 bytes |
|[B1.1] Append N characters (time)                                         |          303 ms |         2460 ms |         9595 ms |
|[B1.1] Append N characters (avgUpdateSize)                                |        27 bytes |       326 bytes |        46 bytes |
|[B1.1] Append N characters (docSize)                                      |      6031 bytes |   2161851 bytes |    186031 bytes |
|[B1.1] Append N characters (memUsed)                                      |        372.1 kB |         74.7 MB |          2.4 MB |
|[B1.1] Append N characters (parseTime)                                    |           18 ms |          737 ms |           48 ms |
|[B1.2] Insert string of length N (time)                                   |            7 ms |         2981 ms |         9592 ms |
|[B1.2] Insert string of length N (avgUpdateSize)                          |      6031 bytes |   1484719 bytes |    275992 bytes |
|[B1.2] Insert string of length N (docSize)                                |      6031 bytes |   1569051 bytes |    186031 bytes |
|[B1.2] Insert string of length N (memUsed)                                |             0 B |         53.3 MB |            2 MB |
|[B1.2] Insert string of length N (parseTime)                              |           19 ms |          516 ms |           44 ms |
|[B1.3] Prepend N characters (time)                                        |          280 ms |        83488 ms |         8932 ms |
|[B1.3] Prepend N characters (avgUpdateSize)                               |        27 bytes |       290 bytes |        38 bytes |
|[B1.3] Prepend N characters (docSize)                                     |      6041 bytes |   1946994 bytes |    186031 bytes |
|[B1.3] Prepend N characters (memUsed)                                     |          3.7 MB |         67.6 MB |          1.8 MB |
|[B1.3] Prepend N characters (parseTime)                                   |           55 ms |        83509 ms |          884 ms |
|[B1.4] Insert N characters at random positions (time)                     |          311 ms |         3255 ms |         9487 ms |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |        29 bytes |       326 bytes |        46 bytes |
|[B1.4] Insert N characters at random positions (docSize)                  |     29614 bytes |   2159192 bytes |    186031 bytes |
|[B1.4] Insert N characters at random positions (memUsed)                  |          3.4 MB |           71 MB |          1.6 MB |
|[B1.4] Insert N characters at random positions (parseTime)                |           57 ms |         1215 ms |          728 ms |
|[B1.5] Insert N words at random positions (time)                          |          376 ms |        12090 ms |       471437 ms |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |        36 bytes |      1587 bytes |       277 bytes |
|[B1.5] Insert N words at random positions (docSize)                       |     87826 bytes |  10148335 bytes |   1122045 bytes |
|[B1.5] Insert N words at random positions (memUsed)                       |          7.6 MB |        330.9 MB |         16.2 MB |
|[B1.5] Insert N words at random positions (parseTime)                     |           65 ms |         4106 ms |         8509 ms |
|[B1.6] Insert string, then delete it (time)                               |            6 ms |         2715 ms |        31058 ms |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |      6053 bytes |   1412719 bytes |    413992 bytes |
|[B1.6] Insert string, then delete it (docSize)                            |        38 bytes |   1497051 bytes |    240035 bytes |
|[B1.6] Insert string, then delete it (memUsed)                            |             0 B |         37.7 MB |             0 B |
|[B1.6] Insert string, then delete it (parseTime)                          |           27 ms |          335 ms |           57 ms |
|[B1.7] Insert/Delete strings at random positions (time)                   |          378 ms |         6347 ms |       218372 ms |
|[B1.7] Insert/Delete strings at random positions (avgUpdateSize)          |        31 bytes |      1102 bytes |       195 bytes |
|[B1.7] Insert/Delete strings at random positions (docSize)                |     28691 bytes |   7085598 bytes |    687945 bytes |
|[B1.7] Insert/Delete strings at random positions (memUsed)                |          4.4 MB |        163.8 MB |          9.4 MB |
|[B1.7] Insert/Delete strings at random positions (parseTime)              |           51 ms |         2351 ms |         1648 ms |
|[B1.8] Append N numbers (time)                                            |          330 ms |         2913 ms |        10309 ms |
|[B1.8] Append N numbers (avgUpdateSize)                                   |        32 bytes |       333 bytes |        48 bytes |
|[B1.8] Append N numbers (docSize)                                         |     35634 bytes |   2200659 bytes |    204029 bytes |
|[B1.8] Append N numbers (memUsed)                                         |             0 B |         73.6 MB |          1.9 MB |
|[B1.8] Append N numbers (parseTime)                                       |           19 ms |          671 ms |           42 ms |
|[B1.9] Insert Array of N numbers (time)                                   |           14 ms |         3223 ms |        10157 ms |
|[B1.9] Insert Array of N numbers (avgUpdateSize)                          |     35661 bytes |   1523693 bytes |        48 bytes |
|[B1.9] Insert Array of N numbers (docSize)                                |     35661 bytes |   1608026 bytes |    204031 bytes |
|[B1.9] Insert Array of N numbers (memUsed)                                |             0 B |         53.3 MB |          2.1 MB |
|[B1.9] Insert Array of N numbers (parseTime)                              |           20 ms |          613 ms |           39 ms |
|[B1.10] Prepend N numbers (time)                                          |          271 ms |        62982 ms |         9121 ms |
|[B1.10] Prepend N numbers (avgUpdateSize)                                 |        32 bytes |       297 bytes |        40 bytes |
|[B1.10] Prepend N numbers (docSize)                                       |     35669 bytes |   1985894 bytes |    204031 bytes |
|[B1.10] Prepend N numbers (memUsed)                                       |          7.1 MB |         67.3 MB |          1.9 MB |
|[B1.10] Prepend N numbers (parseTime)                                     |           49 ms |        60077 ms |          933 ms |
|[B1.11] Insert N numbers at random positions (time)                       |          296 ms |         3844 ms |         9892 ms |
|[B1.11] Insert N numbers at random positions (avgUpdateSize)              |        34 bytes |       332 bytes |        48 bytes |
|[B1.11] Insert N numbers at random positions (docSize)                    |     59161 bytes |   2198120 bytes |    204029 bytes |
|[B1.11] Insert N numbers at random positions (memUsed)                    |          7.5 MB |         70.1 MB |          1.9 MB |
|[B1.11] Insert N numbers at random positions (parseTime)                  |           51 ms |         1116 ms |          682 ms |
|[B2.1] Concurrently insert string of length N at index 0 (time)           |            3 ms |         5729 ms |        39820 ms |
|[B2.1] Concurrently insert string of length N at index 0 (updateSize)     |     12058 bytes |   2970726 bytes |    551984 bytes |
|[B2.1] Concurrently insert string of length N at index 0 (docSize)        |     12149 bytes |   3164619 bytes |    375131 bytes |
|[B2.1] Concurrently insert string of length N at index 0 (memUsed)        |             0 B |        107.8 MB |          5.1 MB |
|[B2.1] Concurrently insert string of length N at index 0 (parseTime)      |           20 ms |          912 ms |           70 ms |
|[B2.2] Concurrently insert N characters at random positions (time)        |          143 ms |        53873 ms |        38517 ms |
|[B2.2] Concurrently insert N characters at random positions (updateSize)  |     66360 bytes |   2753229 bytes |    551912 bytes |
|[B2.2] Concurrently insert N characters at random positions (docSize)     |     66454 bytes |   2947122 bytes |    375131 bytes |
|[B2.2] Concurrently insert N characters at random positions (memUsed)     |          7.3 MB |         98.2 MB |          5.2 MB |
|[B2.2] Concurrently insert N characters at random positions (parseTime)   |           59 ms |        60674 ms |         2740 ms |
|[B2.3] Concurrently insert N words at random positions (time)             |          228 ms |       309114 ms |      2280822 ms |
|[B2.3] Concurrently insert N words at random positions (updateSize)       |    177753 bytes |  17696052 bytes |   3295776 bytes |
|[B2.3] Concurrently insert N words at random positions (docSize)          |    177918 bytes |  18725017 bytes |   2224223 bytes |
|[B2.3] Concurrently insert N words at random positions (memUsed)          |         15.3 MB |        619.6 MB |         39.8 MB |
|[B2.3] Concurrently insert N words at random positions (parseTime)        |           81 ms |       139273 ms |        41511 ms |
|[B2.4] Concurrently insert & delete (time)                                |          408 ms |       518020 ms |      3058659 ms |
|[B2.4] Concurrently insert & delete (updateSize)                          |    278025 bytes |  26580311 bytes |   5560784 bytes |
|[B2.4] Concurrently insert & delete (docSize)                             |    278153 bytes |  28112800 bytes |   3607213 bytes |
|[B2.4] Concurrently insert & delete (memUsed)                             |         19.4 MB |          850 MB |         38.1 MB |
|[B2.4] Concurrently insert & delete (parseTime)                           |          120 ms |        19810 ms |        64675 ms |
|[B3.1] 20√N clients concurrently set number in Map (time)                 |          551 ms |         7643 ms |                 |
|[B3.1] 20√N clients concurrently set number in Map (updateSize)           |     49168 bytes |    246830 bytes |                 |
|[B3.1] 20√N clients concurrently set number in Map (docSize)              |     32213 bytes |    288422 bytes |                 |
|[B3.1] 20√N clients concurrently set number in Map (memUsed)              |          3.6 MB |         30.9 MB |                 |
|[B3.1] 20√N clients concurrently set number in Map (parseTime)            |           54 ms |         6067 ms |                 |
|[B3.2] 20√N clients concurrently set Object in Map (time)                 |          711 ms |        39655 ms |                 |
|[B3.2] 20√N clients concurrently set Object in Map (updateSize)           |     95864 bytes |    684190 bytes |                 |
|[B3.2] 20√N clients concurrently set Object in Map (docSize)              |     41477 bytes |    758122 bytes |                 |
|[B3.2] 20√N clients concurrently set Object in Map (memUsed)              |            7 MB |         64.9 MB |                 |
|[B3.2] 20√N clients concurrently set Object in Map (parseTime)            |           54 ms |        14129 ms |                 |
|[B3.3] 20√N clients concurrently set String in Map (time)                 |          790 ms |         9342 ms |                 |
|[B3.3] 20√N clients concurrently set String in Map (updateSize)           |   7826229 bytes |   8021860 bytes |                 |
|[B3.3] 20√N clients concurrently set String in Map (docSize)              |     38360 bytes |   8063452 bytes |                 |
|[B3.3] 20√N clients concurrently set String in Map (memUsed)              |         13.1 MB |         77.9 MB |                 |
|[B3.3] 20√N clients concurrently set String in Map (parseTime)            |           49 ms |         7670 ms |                 |
|[B3.4] 20√N clients concurrently insert text in Array (time)              |          596 ms |        21964 ms |         2063 ms |
|[B3.4] 20√N clients concurrently insert text in Array (updateSize)        |     52746 bytes |    499350 bytes |     65810 bytes |
|[B3.4] 20√N clients concurrently insert text in Array (docSize)           |     26591 bytes |    552023 bytes |     57757 bytes |
|[B3.4] 20√N clients concurrently insert text in Array (memUsed)           |          6.8 MB |         59.5 MB |          4.4 MB |
|[B3.4] 20√N clients concurrently insert text in Array (parseTime)         |           32 ms |        44967 ms |         2078 ms |
|[B4] Apply real-world editing dataset (time)                              |         6342 ms |       489104 ms |     20134540 ms |
|[B4] Apply real-world editing dataset (avgUpdateSize)                     |        29 bytes |       291 bytes |        45 bytes |
|[B4] Apply real-world editing dataset (encodeTime)                        |           27 ms |         2611 ms |          814 ms |
|[B4] Apply real-world editing dataset (docSize)                           |    159929 bytes |  83966886 bytes |   7888799 bytes |
|[B4] Apply real-world editing dataset (memUsed)                           |          3.2 MB |          1.1 GB |         34.4 MB |
|[B4] Apply real-world editing dataset (parseTime)                         |           86 ms |        37844 ms |        51991 ms |
|[B4 x 100] Apply real-world editing dataset 100 times (time)              |       170254 ms |                 |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (encodeTime)        |          645 ms |                 |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (docSize)           |  15989245 bytes |                 |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (parseTime)         |         1792 ms |                 |                 |
|[B4 x 100] Apply real-world editing dataset 100 times (memUsed)           |        266.4 MB |                 |                 |


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
|[B2.1] Concurrently insert string of length N at index 0 (time)           |            5 ms |                 |
|[B2.1] Concurrently insert string of length N at index 0 (updateSize)     |    120064 bytes |                 |
|[B2.1] Concurrently insert string of length N at index 0 (docSize)        |    120154 bytes |                 |
|[B2.1] Concurrently insert string of length N at index 0 (parseTime)      |            2 ms |                 |
|[B2.1] Concurrently insert string of length N at index 0 (memUsed)        |          4.2 MB |                 |
|[B2.1] Concurrently insert string of length N at index 0                  |                 |        skipping |
|[B2.2] Concurrently insert N characters at random positions (time)        |         1017 ms |                 |
|[B2.2] Concurrently insert N characters at random positions (updateSize)  |    760850 bytes |                 |
|[B2.2] Concurrently insert N characters at random positions (docSize)     |    760942 bytes |                 |
|[B2.2] Concurrently insert N characters at random positions (parseTime)   |           91 ms |                 |
|[B2.2] Concurrently insert N characters at random positions (memUsed)     |             0 B |                 |
|[B2.2] Concurrently insert N characters at random positions               |                 |        skipping |
|[B2.3] Concurrently insert N words at random positions (time)             |         9163 ms |                 |
|[B2.3] Concurrently insert N words at random positions (updateSize)       |   1877355 bytes |                 |
|[B2.3] Concurrently insert N words at random positions (docSize)          |   1877486 bytes |                 |
|[B2.3] Concurrently insert N words at random positions (parseTime)        |          344 ms |                 |
|[B2.3] Concurrently insert N words at random positions (memUsed)          |             0 B |                 |
|[B2.3] Concurrently insert N words at random positions                    |                 |        skipping |
|[B2.4] Concurrently insert & delete (time)                                |        18214 ms |                 |
|[B2.4] Concurrently insert & delete (updateSize)                          |   2883749 bytes |                 |
|[B2.4] Concurrently insert & delete (docSize)                             |   2883876 bytes |                 |
|[B2.4] Concurrently insert & delete (parseTime)                           |          661 ms |                 |
|[B2.4] Concurrently insert & delete (memUsed)                             |        258.2 MB |                 |
|[B2.4] Concurrently insert & delete                                       |                 |        skipping |
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

## License

[The MIT License](./LICENSE) © Kevin Jahns

Except for /b4-editing-trace.js © Martin Kleppmann
