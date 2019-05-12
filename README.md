
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

Simulate `N` concurrent actions. We measure the time to perform the task and sync all clients (`time`), the size of the update messages (`updateSize`), the size of the encoded document after the task is performed (`docSize`), and the time to parse the encoded document (`parseTime`).

### Results

Generated results with `Node.js v11.7.0` and `Intel® Core™ i5-8400 CPU @ 2.80GHz × 6`

| N = 150 | Yjs | automerge |
| :- | -: | -: |
|Bundle size                                                               |     41101 bytes |    250627 bytes |
|Bundle size (gzipped)                                                     |     11953 bytes |     59677 bytes |
|[B1.1] Append N characters (time)                                         |           12 ms |          157 ms |
|[B1.1] Append N characters (avgUpdateSize)                                |        18 bytes |       320 bytes |
|[B1.1] Append N characters (docSize)                                      |       168 bytes |     53397 bytes |
|[B1.1] Append N characters (parseTime)                                    |            0 ms |           47 ms |
|[B1.2] Insert string of length N (time)                                   |            0 ms |           52 ms |
|[B1.2] Insert string of length N (avgUpdateSize)                          |       168 bytes |     36467 bytes |
|[B1.2] Insert string of length N (docSize)                                |       168 bytes |     38899 bytes |
|[B1.2] Insert string of length N (parseTime)                              |            0 ms |           22 ms |
|[B1.3] Prepend N characters] (time)                                       |            9 ms |          106 ms |
|[B1.3] Prepend N characters] (avgUpdateSize)                              |        16 bytes |       286 bytes |
|[B1.3] Prepend N characters] (docSize)                                    |      1231 bytes |     48290 bytes |
|[B1.3] Prepend N characters] (parseTime)                                  |            1 ms |           51 ms |
|[B1.4] Insert N characters at random positions (time)                     |            9 ms |           70 ms |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |        24 bytes |       318 bytes |
|[B1.4] Insert N characters at random positions (docSize)                  |      2164 bytes |     53132 bytes |
|[B1.4] Insert N characters at random positions (parseTime)                |            1 ms |           25 ms |
|[B1.5] Insert N words at random positions (time)                          |           13 ms |          244 ms |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |        31 bytes |      1585 bytes |
|[B1.5] Insert N words at random positions (docSize)                       |      4775 bytes |    254084 bytes |
|[B1.5] Insert N words at random positions (parseTime)                     |            1 ms |           85 ms |
|[B1.6] Insert string, then delete it (time)                               |            1 ms |            9 ms |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |       179 bytes |     34667 bytes |
|[B1.6] Insert string, then delete it (docSize)                            |        27 bytes |     37099 bytes |
|[B1.6] Insert string, then delete it (parseTime)                          |            0 ms |            6 ms |
|[B1.7] Insert/Delete at random positions (time)                           |           10 ms |          156 ms |
|[B1.7] Insert/Delete at random positions (avgUpdateSize)                  |        23 bytes |      1051 bytes |
|[B1.7] Insert/Delete at random positions (docSize)                        |      2457 bytes |    169470 bytes |
|[B1.7] Insert/Delete at random positions (parseTime)                      |            1 ms |           55 ms |
|[B2.1] Cuncurrently insert N characters at index 0 (time)                 |            0 ms |           68 ms |
|[B2.1] Cuncurrently insert N characters at index 0 (updateSize)           |       336 bytes |     73622 bytes |
|[B2.1] Cuncurrently insert N characters at index 0 (docSize)              |       442 bytes |    103715 bytes |
|[B2.1] Cuncurrently insert N characters at index 0 (parseTime)            |            0 ms |           29 ms |
|[B2.1] Cuncurrently insert N characters at random positions (time)        |           11 ms |           72 ms |
|[B2.1] Cuncurrently insert N characters at random positions (updateSize)  |      4562 bytes |     68310 bytes |
|[B2.1] Cuncurrently insert N characters at random positions (docSize)     |      5324 bytes |     98403 bytes |
|[B2.1] Cuncurrently insert N characters at random positions (parseTime)   |            2 ms |           66 ms |
|[B2.1] Cuncurrently insert N words at random positions (time)             |            7 ms |          385 ms |
|[B2.1] Cuncurrently insert N words at random positions (updateSize)       |      8823 bytes |    433728 bytes |
|[B2.1] Cuncurrently insert N words at random positions (docSize)          |      9305 bytes |    484695 bytes |
|[B2.1] Cuncurrently insert N words at random positions (parseTime)        |            2 ms |          181 ms |
|[B2.1] Cuncurrently insert & delete (time)                                |           10 ms |          539 ms |
|[B2.1] Cuncurrently insert & delete (updateSize)                          |     13727 bytes |    649109 bytes |
|[B2.1] Cuncurrently insert & delete (docSize)                             |     14242 bytes |    712494 bytes |
|[B2.1] Cuncurrently insert & delete (parseTime)                           |            6 ms |          202 ms |
|[B3.1] N clients concurrently set number in Map (time)                    |           13 ms |           57 ms |
|[B3.1] N clients concurrently set number in Map (updateSize)              |      3178 bytes |     23890 bytes |
|[B3.1] N clients concurrently set number in Map (docSize)                 |      3575 bytes |     27952 bytes |
|[B3.1] N clients concurrently set number in Map (parseTime)               |            5 ms |           36 ms |
|[B3.2] N clients concurrently set Object in Map (time)                    |           17 ms |           86 ms |
|[B3.2] N clients concurrently set Object in Map (updateSize)              |      9154 bytes |     66490 bytes |
|[B3.2] N clients concurrently set Object in Map (docSize)                 |      3913 bytes |     73702 bytes |
|[B3.2] N clients concurrently set Object in Map (parseTime)               |            5 ms |           48 ms |
|[B3.3] N clients concurrently set String in Map (time)                    |           12 ms |           53 ms |
|[B3.3] N clients concurrently set String in Map (updateSize)              |     54290 bytes |     74850 bytes |
|[B3.3] N clients concurrently set String in Map (docSize)                 |      3880 bytes |     78912 bytes |
|[B3.3] N clients concurrently set String in Map (parseTime)               |            2 ms |           33 ms |
|[B3.4] N clients concurrently insert text in Array (time)                 |            7 ms |           85 ms |
|[B3.4] N clients concurrently insert text in Array (updateSize)           |      3477 bytes |     48450 bytes |
|[B3.4] N clients concurrently insert text in Array (docSize)              |      3180 bytes |     53863 bytes |
|[B3.4] N clients concurrently insert text in Array (parseTime)            |            1 ms |          113 ms |


| N = 1500 | Yjs | automerge |
| :- | -: | -: |
|Bundle size                                                               |     41101 bytes |    250627 bytes |
|Bundle size (gzipped)                                                     |     11953 bytes |     59677 bytes |
|[B1.1] Append N characters (time)                                         |           66 ms |          788 ms |
|[B1.1] Append N characters (avgUpdateSize)                                |        20 bytes |       324 bytes |
|[B1.1] Append N characters (docSize)                                      |      1518 bytes |    537351 bytes |
|[B1.1] Append N characters (parseTime)                                    |            0 ms |          193 ms |
|[B1.2] Insert string of length N (time)                                   |            0 ms |          339 ms |
|[B1.2] Insert string of length N (avgUpdateSize)                          |      1518 bytes |    368719 bytes |
|[B1.2] Insert string of length N (docSize)                                |      1518 bytes |    390051 bytes |
|[B1.2] Insert string of length N (parseTime)                              |            0 ms |          117 ms |
|[B1.3] Prepend N characters] (time)                                       |           34 ms |         3178 ms |
|[B1.3] Prepend N characters] (avgUpdateSize)                              |        20 bytes |       289 bytes |
|[B1.3] Prepend N characters] (docSize)                                    |     14881 bytes |    484494 bytes |
|[B1.3] Prepend N characters] (parseTime)                                  |            6 ms |         2837 ms |
|[B1.4] Insert N characters at random positions (time)                     |           46 ms |          583 ms |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |        26 bytes |       323 bytes |
|[B1.4] Insert N characters at random positions (docSize)                  |     24466 bytes |    536478 bytes |
|[B1.4] Insert N characters at random positions (parseTime)                |            4 ms |          173 ms |
|[B1.5] Insert N words at random positions (time)                          |           40 ms |         2126 ms |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |        32 bytes |      1562 bytes |
|[B1.5] Insert N words at random positions (docSize)                       |     49901 bytes |   2498772 bytes |
|[B1.5] Insert N words at random positions (parseTime)                     |            2 ms |          966 ms |
|[B1.6] Insert string, then delete it (time)                               |            2 ms |          188 ms |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |      1529 bytes |    350719 bytes |
|[B1.6] Insert string, then delete it (docSize)                            |        27 bytes |    372051 bytes |
|[B1.6] Insert string, then delete it (parseTime)                          |            0 ms |           54 ms |
|[B1.7] Insert/Delete at random positions (time)                           |           70 ms |         1448 ms |
|[B1.7] Insert/Delete at random positions (avgUpdateSize)                  |        23 bytes |      1088 bytes |
|[B1.7] Insert/Delete at random positions (docSize)                        |     24237 bytes |   1750000 bytes |
|[B1.7] Insert/Delete at random positions (parseTime)                      |            4 ms |          606 ms |
|[B2.1] Cuncurrently insert N characters at index 0 (time)                 |            0 ms |          660 ms |
|[B2.1] Cuncurrently insert N characters at index 0 (updateSize)           |      3036 bytes |    738726 bytes |
|[B2.1] Cuncurrently insert N characters at index 0 (docSize)              |      3142 bytes |    806619 bytes |
|[B2.1] Cuncurrently insert N characters at index 0 (parseTime)            |            0 ms |          253 ms |
|[B2.1] Cuncurrently insert N characters at random positions (time)        |           41 ms |         2975 ms |
|[B2.1] Cuncurrently insert N characters at random positions (updateSize)  |     49020 bytes |    684901 bytes |
|[B2.1] Cuncurrently insert N characters at random positions (docSize)     |     49918 bytes |    752794 bytes |
|[B2.1] Cuncurrently insert N characters at random positions (parseTime)   |            3 ms |         3077 ms |
|[B2.1] Cuncurrently insert N words at random positions (time)             |           40 ms |        14354 ms |
|[B2.1] Cuncurrently insert N words at random positions (updateSize)       |     98035 bytes |   4402276 bytes |
|[B2.1] Cuncurrently insert N words at random positions (docSize)          |     98733 bytes |   4680043 bytes |
|[B2.1] Cuncurrently insert N words at random positions (parseTime)        |            8 ms |         5269 ms |
|[B2.1] Cuncurrently insert & delete (time)                                |          126 ms |        24093 ms |
|[B2.1] Cuncurrently insert & delete (updateSize)                          |    147245 bytes |   6655963 bytes |
|[B2.1] Cuncurrently insert & delete (docSize)                             |    147858 bytes |   7061858 bytes |
|[B2.1] Cuncurrently insert & delete (parseTime)                           |           14 ms |         2492 ms |
|[B3.1] N clients concurrently set number in Map (time)                    |          507 ms |         4912 ms |
|[B3.1] N clients concurrently set number in Map (updateSize)              |     33287 bytes |    240390 bytes |
|[B3.1] N clients concurrently set number in Map (docSize)                 |     35794 bytes |    280902 bytes |
|[B3.1] N clients concurrently set number in Map (parseTime)               |          136 ms |         3636 ms |
|[B3.2] N clients concurrently set Object in Map (time)                    |          555 ms |         7387 ms |
|[B3.2] N clients concurrently set Object in Map (updateSize)              |     93066 bytes |    666390 bytes |
|[B3.2] N clients concurrently set Object in Map (docSize)                 |     38823 bytes |    738402 bytes |
|[B3.2] N clients concurrently set Object in Map (parseTime)               |          141 ms |         4031 ms |
|[B3.3] N clients concurrently set String in Map (time)                    |          658 ms |         5014 ms |
|[B3.3] N clients concurrently set String in Map (updateSize)              |   7367901 bytes |   7573500 bytes |
|[B3.3] N clients concurrently set String in Map (docSize)                 |     40302 bytes |   7614012 bytes |
|[B3.3] N clients concurrently set String in Map (parseTime)               |          130 ms |         3696 ms |
|[B3.4] N clients concurrently insert text in Array (time)                 |          588 ms |         7793 ms |
|[B3.4] N clients concurrently insert text in Array (updateSize)           |     36286 bytes |    486350 bytes |
|[B3.4] N clients concurrently insert text in Array (docSize)              |     33289 bytes |    537663 bytes |
|[B3.4] N clients concurrently insert text in Array (parseTime)            |          118 ms |        13602 ms |

| N = 10000 | Yjs | automerge |
| :- | -: | -: |
|Bundle size                                                               |     41101 bytes |    250627 bytes |
|Bundle size (gzipped)                                                     |     11953 bytes |     59677 bytes |
|[B1.1] Append N characters (time)                                         |          194 ms |                 |
|[B1.1] Append N characters (avgUpdateSize)                                |        20 bytes |                 |
|[B1.1] Append N characters (docSize)                                      |     10018 bytes |                 |
|[B1.1] Append N characters (parseTime)                                    |            0 ms |                 |
|[B1.1] Append N characters                                                |                 |        skipping |
|[B1.2] Insert string of length N (time)                                   |           10 ms |                 |
|[B1.2] Insert string of length N (avgUpdateSize)                          |     10018 bytes |                 |
|[B1.2] Insert string of length N (docSize)                                |     10018 bytes |                 |
|[B1.2] Insert string of length N (parseTime)                              |            0 ms |                 |
|[B1.2] Insert string of length N                                          |                 |        skipping |
|[B1.3] Prepend N characters] (time)                                       |           92 ms |                 |
|[B1.3] Prepend N characters] (avgUpdateSize)                              |        20 bytes |                 |
|[B1.3] Prepend N characters] (docSize)                                    |     99881 bytes |                 |
|[B1.3] Prepend N characters] (parseTime)                                  |           11 ms |                 |
|[B1.3] Prepend N characters]                                              |                 |        skipping |
|[B1.4] Insert N characters at random positions (time)                     |          444 ms |                 |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |        27 bytes |                 |
|[B1.4] Insert N characters at random positions (docSize)                  |    168558 bytes |                 |
|[B1.4] Insert N characters at random positions (parseTime)                |           17 ms |                 |
|[B1.4] Insert N characters at random positions                            |                 |        skipping |
|[B1.5] Insert N words at random positions (time)                          |          789 ms |                 |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |        33 bytes |                 |
|[B1.5] Insert N words at random positions (docSize)                       |    344691 bytes |                 |
|[B1.5] Insert N words at random positions (parseTime)                     |           22 ms |                 |
|[B1.5] Insert N words at random positions                                 |                 |        skipping |
|[B1.6] Insert string, then delete it (time)                               |            1 ms |                 |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |     10029 bytes |                 |
|[B1.6] Insert string, then delete it (docSize)                            |        27 bytes |                 |
|[B1.6] Insert string, then delete it (parseTime)                          |            0 ms |                 |
|[B1.6] Insert string, then delete it                                      |                 |        skipping |
|[B1.7] Insert/Delete at random positions (time)                           |          569 ms |                 |
|[B1.7] Insert/Delete at random positions (avgUpdateSize)                  |        25 bytes |                 |
|[B1.7] Insert/Delete at random positions (docSize)                        |    169382 bytes |                 |
|[B1.7] Insert/Delete at random positions (parseTime)                      |           22 ms |                 |
|[B1.7] Insert/Delete at random positions                                  |                 |        skipping |
|[B2.1] Cuncurrently insert N characters at index 0 (time)                 |            1 ms |                 |
|[B2.1] Cuncurrently insert N characters at index 0 (updateSize)           |     20036 bytes |                 |
|[B2.1] Cuncurrently insert N characters at index 0 (docSize)              |     20142 bytes |                 |
|[B2.1] Cuncurrently insert N characters at index 0 (parseTime)            |            0 ms |                 |
|[B2.1] Cuncurrently insert N characters at index 0                        |                 |        skipping |
|[B2.1] Cuncurrently insert N characters at random positions (time)        |          869 ms |                 |
|[B2.1] Cuncurrently insert N characters at random positions (updateSize)  |    336661 bytes |                 |
|[B2.1] Cuncurrently insert N characters at random positions (docSize)     |    337559 bytes |                 |
|[B2.1] Cuncurrently insert N characters at random positions (parseTime)   |           43 ms |                 |
|[B2.1] Cuncurrently insert N characters at random positions               |                 |        skipping |
|[B2.1] Cuncurrently insert N words at random positions (time)             |         1545 ms |                 |
|[B2.1] Cuncurrently insert N words at random positions (updateSize)       |    688052 bytes |                 |
|[B2.1] Cuncurrently insert N words at random positions (docSize)          |    688886 bytes |                 |
|[B2.1] Cuncurrently insert N words at random positions (parseTime)        |           76 ms |                 |
|[B2.1] Cuncurrently insert N words at random positions                    |                 |        skipping |
|[B2.1] Cuncurrently insert & delete (time)                                |         4249 ms |                 |
|[B2.1] Cuncurrently insert & delete (updateSize)                          |   1060135 bytes |                 |
|[B2.1] Cuncurrently insert & delete (docSize)                             |   1060788 bytes |                 |
|[B2.1] Cuncurrently insert & delete (parseTime)                           |          134 ms |                 |
|[B2.1] Cuncurrently insert & delete                                       |                 |        skipping |
|[B3.1] N clients concurrently set number in Map (time)                    |        25245 ms |                 |
|[B3.1] N clients concurrently set number in Map (updateSize)              |    228267 bytes |                 |
|[B3.1] N clients concurrently set number in Map (docSize)                 |    238755 bytes |                 |
|[B3.1] N clients concurrently set number in Map (parseTime)               |         6247 ms |                 |
|[B3.1] N clients concurrently set number in Map                           |                 |        skipping |
|[B3.2] N clients concurrently set Object in Map (time)                    |        28031 ms |                 |
|[B3.2] N clients concurrently set Object in Map (updateSize)              |    627054 bytes |                 |
|[B3.2] N clients concurrently set Object in Map (docSize)                 |    258815 bytes |                 |
|[B3.2] N clients concurrently set Object in Map (parseTime)               |         6303 ms |                 |
|[B3.2] N clients concurrently set Object in Map                           |                 |        skipping |
|[B3.3] N clients concurrently set String in Map (time)                    |        48211 ms |                 |
|[B3.3] N clients concurrently set String in Map (updateSize)              | 389129353 bytes |                 |
|[B3.3] N clients concurrently set String in Map (docSize)                 |    278727 bytes |                 |
|[B3.3] N clients concurrently set String in Map (parseTime)               |         6894 ms |                 |
|[B3.3] N clients concurrently set String in Map                           |                 |        skipping |
|[B3.4] N clients concurrently insert text in Array (time)                 |        35094 ms |                 |
|[B3.4] N clients concurrently insert text in Array (updateSize)           |    248288 bytes |                 |
|[B3.4] N clients concurrently insert text in Array (docSize)              |    228291 bytes |                 |
|[B3.4] N clients concurrently insert text in Array (parseTime)            |         5732 ms |                 |
|[B3.4] N clients concurrently insert text in Array                        |                 |        skipping |


### Development
Modify the `N` variable in `benchmarks/utils.js` to increase the difficulty.

```sh
npm run watch
node dist/benchmark.js
```

Now you can also open `benchmark.html` to run the benchmarks in the browser.

### License

[The MIT License](./LICENSE) © Kevin Jahns
