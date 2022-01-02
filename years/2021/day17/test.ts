import Solver from './solve';

const input = 'target area: x=20..30, y=-10..-5';

describe('2020/12/17', () => {
  test('Part 1', () => {
    expect(new Solver(input).part1()).toEqual(45);
  });

  test('Part 2', () => {
    const solver = new Solver(input);
    const result = solver.part2();
    expect([...solver.state.shotsP2.values()].sort()).toEqual(`
23,-10  25,-9   27,-5   29,-6   22,-6   21,-7   9,0     27,-7   24,-5
25,-7   26,-6   25,-5   6,8     11,-2   20,-5   29,-10  6,3     28,-7
8,0     30,-6   29,-8   20,-10  6,7     6,4     6,1     14,-4   21,-6
26,-10  7,-1    7,7     8,-1    21,-9   6,2     20,-7   30,-10  14,-3
20,-8   13,-2   7,3     28,-8   29,-9   15,-3   22,-5   26,-8   25,-8
25,-6   15,-4   9,-2    15,-2   12,-2   28,-9   12,-3   24,-6   23,-7
25,-10  7,8     11,-3   26,-7   7,1     23,-9   6,0     22,-10  27,-6
8,1     22,-8   13,-4   7,6     28,-6   11,-4   12,-4   26,-9   7,4
24,-10  23,-8   30,-8   7,0     9,-1    10,-1   26,-5   22,-9   6,5
7,5     23,-6   28,-10  10,-2   11,-1   20,-9   14,-2   29,-7   13,-3
23,-5   24,-8   27,-9   30,-7   28,-5   21,-10  7,9     6,6     21,-5
27,-10  7,2     30,-9   21,-8   22,-7   24,-9   20,-6   6,9     29,-5
8,-2    27,-8   30,-5   24,-7`.replaceAll('\n', ' ').split(' ').map((v) => v.trim()).filter(Boolean).sort());
    expect(result).toEqual(112);
  });

  test('actual', () => {
    const expected = `
18,-3
18,-2
18,-1
18,0
18,1
18,2
18,3
18,4
18,5
18,6
18,7
18,8
18,9
18,10
18,11
18,12
18,13
18,14
18,15
18,16
18,17
18,18
18,19
18,20
18,21
18,22
18,23
18,24
18,25
18,26
18,27
18,28
18,29
18,30
18,31
18,32
18,33
18,34
18,35
18,36
18,37
18,38
18,39
18,40
18,41
18,42
18,43
18,44
18,45
18,46
18,47
18,48
18,49
18,50
18,51
18,52
18,53
18,54
18,55
18,56
18,57
18,66
18,67
18,68
18,69
18,70
18,71
18,72
18,73
18,74
18,75
18,76
18,77
18,78
18,79
18,80
18,81
18,82
18,83
18,84
18,85
18,86
18,87
18,88
18,89
18,90
18,91
18,92
18,93
18,94
18,95
18,96
18,97
18,98
18,99
18,100
18,101
18,102
18,103
18,104
18,105
18,106
18,107
18,108
18,109
18,110
18,111
18,112
18,113
18,114
18,115
18,116
19,-4
19,-3
19,-2
19,-1
19,0
19,1
19,2
20,-7
20,-6
20,-5
20,-4
20,-3
20,-2
20,-1
20,0
21,-7
21,-6
21,-5
21,-4
21,-3
21,-2
22,-9
22,-8
22,-7
22,-6
22,-5
22,-4
22,-3
23,-11
23,-10
23,-9
23,-8
23,-7
23,-6
23,-5
23,-4
24,-11
24,-10
24,-9
24,-8
24,-7
24,-6
24,-5
24,-4
25,-11
25,-10
25,-9
25,-8
25,-7
25,-6
25,-5
26,-13
26,-12
26,-11
26,-10
26,-9
26,-8
26,-7
26,-6
26,-5
27,-13
27,-12
27,-11
27,-10
27,-9
27,-8
27,-7
28,-13
28,-12
28,-11
28,-10
28,-9
28,-8
28,-7
29,-17
29,-16
29,-15
29,-14
29,-13
29,-12
29,-11
29,-10
29,-9
29,-8
29,-7
30,-17
30,-16
30,-15
30,-14
30,-13
30,-12
30,-11
30,-10
30,-9
31,-17
31,-16
31,-15
31,-14
31,-13
31,-12
31,-11
31,-10
31,-9
32,-17
32,-16
32,-15
32,-14
32,-13
32,-12
32,-11
32,-10
32,-9
33,-21
33,-20
33,-19
33,-18
33,-17
33,-16
33,-15
33,-14
33,-13
33,-12
34,-21
34,-20
34,-19
34,-18
34,-17
34,-16
34,-15
34,-14
34,-13
34,-12
35,-21
35,-20
35,-19
35,-18
35,-17
35,-16
35,-15
35,-14
35,-13
35,-12
36,-21
36,-20
36,-19
36,-18
36,-17
36,-16
36,-15
36,-14
36,-13
36,-12
37,-21
37,-20
37,-19
37,-18
37,-17
37,-16
37,-15
37,-14
37,-13
37,-12
38,-21
38,-20
38,-19
38,-18
38,-17
38,-16
38,-15
38,-14
38,-13
38,-12
41,-27
41,-26
41,-25
41,-24
41,-23
41,-22
41,-21
41,-20
41,-19
41,-18
41,-17
41,-16
42,-27
42,-26
42,-25
42,-24
42,-23
42,-22
42,-21
42,-20
42,-19
42,-18
42,-17
42,-16
43,-27
43,-26
43,-25
43,-24
43,-23
43,-22
43,-21
43,-20
43,-19
43,-18
43,-17
43,-16
44,-27
44,-26
44,-25
44,-24
44,-23
44,-22
44,-21
44,-20
44,-19
44,-18
44,-17
44,-16
45,-27
45,-26
45,-25
45,-24
45,-23
45,-22
45,-21
45,-20
45,-19
45,-18
45,-17
45,-16
46,-27
46,-26
46,-25
46,-24
46,-23
46,-22
46,-21
46,-20
46,-19
46,-18
46,-17
46,-16
47,-27
47,-26
47,-25
47,-24
47,-23
47,-22
47,-21
47,-20
47,-19
47,-18
47,-17
47,-16
53,-38
53,-37
53,-36
53,-35
53,-34
53,-33
53,-32
53,-31
53,-30
53,-29
53,-28
53,-27
53,-26
53,-25
53,-24
53,-23
53,-22
54,-38
54,-37
54,-36
54,-35
54,-34
54,-33
54,-32
54,-31
54,-30
54,-29
54,-28
54,-27
54,-26
54,-25
54,-24
54,-23
54,-22
55,-38
55,-37
55,-36
55,-35
55,-34
55,-33
55,-32
55,-31
55,-30
55,-29
55,-28
55,-27
55,-26
55,-25
55,-24
55,-23
55,-22
56,-38
56,-37
56,-36
56,-35
56,-34
56,-33
56,-32
56,-31
56,-30
56,-29
56,-28
56,-27
56,-26
56,-25
56,-24
56,-23
56,-22
57,-38
57,-37
57,-36
57,-35
57,-34
57,-33
57,-32
57,-31
57,-30
57,-29
57,-28
57,-27
57,-26
57,-25
57,-24
57,-23
57,-22
58,-38
58,-37
58,-36
58,-35
58,-34
58,-33
58,-32
58,-31
58,-30
58,-29
58,-28
58,-27
58,-26
58,-25
58,-24
58,-23
58,-22
59,-38
59,-37
59,-36
59,-35
59,-34
59,-33
59,-32
59,-31
59,-30
59,-29
59,-28
59,-27
59,-26
59,-25
59,-24
59,-23
59,-22
60,-38
60,-37
60,-36
60,-35
60,-34
60,-33
60,-32
60,-31
60,-30
60,-29
60,-28
60,-27
60,-26
60,-25
60,-24
60,-23
60,-22
61,-38
61,-37
61,-36
61,-35
61,-34
61,-33
61,-32
61,-31
61,-30
61,-29
61,-28
61,-27
61,-26
61,-25
61,-24
61,-23
61,-22
78,-58
78,-57
78,-56
78,-55
78,-54
78,-53
78,-52
78,-51
78,-50
78,-49
78,-48
78,-47
78,-46
78,-45
78,-44
78,-43
78,-42
78,-41
78,-40
78,-39
78,-38
78,-37
78,-36
78,-35
78,-34
78,-33
79,-58
79,-57
79,-56
79,-55
79,-54
79,-53
79,-52
79,-51
79,-50
79,-49
79,-48
79,-47
79,-46
79,-45
79,-44
79,-43
79,-42
79,-41
79,-40
79,-39
79,-38
79,-37
79,-36
79,-35
79,-34
79,-33
80,-58
80,-57
80,-56
80,-55
80,-54
80,-53
80,-52
80,-51
80,-50
80,-49
80,-48
80,-47
80,-46
80,-45
80,-44
80,-43
80,-42
80,-41
80,-40
80,-39
80,-38
80,-37
80,-36
80,-35
80,-34
80,-33
81,-58
81,-57
81,-56
81,-55
81,-54
81,-53
81,-52
81,-51
81,-50
81,-49
81,-48
81,-47
81,-46
81,-45
81,-44
81,-43
81,-42
81,-41
81,-40
81,-39
81,-38
81,-37
81,-36
81,-35
81,-34
81,-33
82,-58
82,-57
82,-56
82,-55
82,-54
82,-53
82,-52
82,-51
82,-50
82,-49
82,-48
82,-47
82,-46
82,-45
82,-44
82,-43
82,-42
82,-41
82,-40
82,-39
82,-38
82,-37
82,-36
82,-35
82,-34
82,-33
83,-58
83,-57
83,-56
83,-55
83,-54
83,-53
83,-52
83,-51
83,-50
83,-49
83,-48
83,-47
83,-46
83,-45
83,-44
83,-43
83,-42
83,-41
83,-40
83,-39
83,-38
83,-37
83,-36
83,-35
83,-34
83,-33
84,-58
84,-57
84,-56
84,-55
84,-54
84,-53
84,-52
84,-51
84,-50
84,-49
84,-48
84,-47
84,-46
84,-45
84,-44
84,-43
84,-42
84,-41
84,-40
84,-39
84,-38
84,-37
84,-36
84,-35
84,-34
84,-33
85,-58
85,-57
85,-56
85,-55
85,-54
85,-53
85,-52
85,-51
85,-50
85,-49
85,-48
85,-47
85,-46
85,-45
85,-44
85,-43
85,-42
85,-41
85,-40
85,-39
85,-38
85,-37
85,-36
85,-35
85,-34
85,-33
86,-58
86,-57
86,-56
86,-55
86,-54
86,-53
86,-52
86,-51
86,-50
86,-49
86,-48
86,-47
86,-46
86,-45
86,-44
86,-43
86,-42
86,-41
86,-40
86,-39
86,-38
86,-37
86,-36
86,-35
86,-34
86,-33
87,-58
87,-57
87,-56
87,-55
87,-54
87,-53
87,-52
87,-51
87,-50
87,-49
87,-48
87,-47
87,-46
87,-45
87,-44
87,-43
87,-42
87,-41
87,-40
87,-39
87,-38
87,-37
87,-36
87,-35
87,-34
87,-33
88,-58
88,-57
88,-56
88,-55
88,-54
88,-53
88,-52
88,-51
88,-50
88,-49
88,-48
88,-47
88,-46
88,-45
88,-44
88,-43
88,-42
88,-41
88,-40
88,-39
88,-38
88,-37
88,-36
88,-35
88,-34
88,-33
89,-58
89,-57
89,-56
89,-55
89,-54
89,-53
89,-52
89,-51
89,-50
89,-49
89,-48
89,-47
89,-46
89,-45
89,-44
89,-43
89,-42
89,-41
89,-40
89,-39
89,-38
89,-37
89,-36
89,-35
89,-34
89,-33
90,-58
90,-57
90,-56
90,-55
90,-54
90,-53
90,-52
90,-51
90,-50
90,-49
90,-48
90,-47
90,-46
90,-45
90,-44
90,-43
90,-42
90,-41
90,-40
90,-39
90,-38
90,-37
90,-36
90,-35
90,-34
90,-33
91,-58
91,-57
91,-56
91,-55
91,-54
91,-53
91,-52
91,-51
91,-50
91,-49
91,-48
91,-47
91,-46
91,-45
91,-44
91,-43
91,-42
91,-41
91,-40
91,-39
91,-38
91,-37
91,-36
91,-35
91,-34
91,-33
155,-117
155,-116
155,-115
155,-114
155,-113
155,-112
155,-111
155,-110
155,-109
155,-108
155,-107
155,-106
155,-105
155,-104
155,-103
155,-102
155,-101
155,-100
155,-99
155,-98
155,-97
155,-96
155,-95
155,-94
155,-93
155,-92
155,-91
155,-90
155,-89
155,-88
155,-87
155,-86
155,-85
155,-84
155,-83
155,-82
155,-81
155,-80
155,-79
155,-78
155,-77
155,-76
155,-75
155,-74
155,-73
155,-72
155,-71
155,-70
155,-69
155,-68
155,-67
156,-117
156,-116
156,-115
156,-114
156,-113
156,-112
156,-111
156,-110
156,-109
156,-108
156,-107
156,-106
156,-105
156,-104
156,-103
156,-102
156,-101
156,-100
156,-99
156,-98
156,-97
156,-96
156,-95
156,-94
156,-93
156,-92
156,-91
156,-90
156,-89
156,-88
156,-87
156,-86
156,-85
156,-84
156,-83
156,-82
156,-81
156,-80
156,-79
156,-78
156,-77
156,-76
156,-75
156,-74
156,-73
156,-72
156,-71
156,-70
156,-69
156,-68
156,-67
157,-117
157,-116
157,-115
157,-114
157,-113
157,-112
157,-111
157,-110
157,-109
157,-108
157,-107
157,-106
157,-105
157,-104
157,-103
157,-102
157,-101
157,-100
157,-99
157,-98
157,-97
157,-96
157,-95
157,-94
157,-93
157,-92
157,-91
157,-90
157,-89
157,-88
157,-87
157,-86
157,-85
157,-84
157,-83
157,-82
157,-81
157,-80
157,-79
157,-78
157,-77
157,-76
157,-75
157,-74
157,-73
157,-72
157,-71
157,-70
157,-69
157,-68
157,-67
158,-117
158,-116
158,-115
158,-114
158,-113
158,-112
158,-111
158,-110
158,-109
158,-108
158,-107
158,-106
158,-105
158,-104
158,-103
158,-102
158,-101
158,-100
158,-99
158,-98
158,-97
158,-96
158,-95
158,-94
158,-93
158,-92
158,-91
158,-90
158,-89
158,-88
158,-87
158,-86
158,-85
158,-84
158,-83
158,-82
158,-81
158,-80
158,-79
158,-78
158,-77
158,-76
158,-75
158,-74
158,-73
158,-72
158,-71
158,-70
158,-69
158,-68
158,-67
159,-117
159,-116
159,-115
159,-114
159,-113
159,-112
159,-111
159,-110
159,-109
159,-108
159,-107
159,-106
159,-105
159,-104
159,-103
159,-102
159,-101
159,-100
159,-99
159,-98
159,-97
159,-96
159,-95
159,-94
159,-93
159,-92
159,-91
159,-90
159,-89
159,-88
159,-87
159,-86
159,-85
159,-84
159,-83
159,-82
159,-81
159,-80
159,-79
159,-78
159,-77
159,-76
159,-75
159,-74
159,-73
159,-72
159,-71
159,-70
159,-69
159,-68
159,-67
160,-117
160,-116
160,-115
160,-114
160,-113
160,-112
160,-111
160,-110
160,-109
160,-108
160,-107
160,-106
160,-105
160,-104
160,-103
160,-102
160,-101
160,-100
160,-99
160,-98
160,-97
160,-96
160,-95
160,-94
160,-93
160,-92
160,-91
160,-90
160,-89
160,-88
160,-87
160,-86
160,-85
160,-84
160,-83
160,-82
160,-81
160,-80
160,-79
160,-78
160,-77
160,-76
160,-75
160,-74
160,-73
160,-72
160,-71
160,-70
160,-69
160,-68
160,-67
161,-117
161,-116
161,-115
161,-114
161,-113
161,-112
161,-111
161,-110
161,-109
161,-108
161,-107
161,-106
161,-105
161,-104
161,-103
161,-102
161,-101
161,-100
161,-99
161,-98
161,-97
161,-96
161,-95
161,-94
161,-93
161,-92
161,-91
161,-90
161,-89
161,-88
161,-87
161,-86
161,-85
161,-84
161,-83
161,-82
161,-81
161,-80
161,-79
161,-78
161,-77
161,-76
161,-75
161,-74
161,-73
161,-72
161,-71
161,-70
161,-69
161,-68
161,-67
162,-117
162,-116
162,-115
162,-114
162,-113
162,-112
162,-111
162,-110
162,-109
162,-108
162,-107
162,-106
162,-105
162,-104
162,-103
162,-102
162,-101
162,-100
162,-99
162,-98
162,-97
162,-96
162,-95
162,-94
162,-93
162,-92
162,-91
162,-90
162,-89
162,-88
162,-87
162,-86
162,-85
162,-84
162,-83
162,-82
162,-81
162,-80
162,-79
162,-78
162,-77
162,-76
162,-75
162,-74
162,-73
162,-72
162,-71
162,-70
162,-69
162,-68
162,-67
163,-117
163,-116
163,-115
163,-114
163,-113
163,-112
163,-111
163,-110
163,-109
163,-108
163,-107
163,-106
163,-105
163,-104
163,-103
163,-102
163,-101
163,-100
163,-99
163,-98
163,-97
163,-96
163,-95
163,-94
163,-93
163,-92
163,-91
163,-90
163,-89
163,-88
163,-87
163,-86
163,-85
163,-84
163,-83
163,-82
163,-81
163,-80
163,-79
163,-78
163,-77
163,-76
163,-75
163,-74
163,-73
163,-72
163,-71
163,-70
163,-69
163,-68
163,-67
164,-117
164,-116
164,-115
164,-114
164,-113
164,-112
164,-111
164,-110
164,-109
164,-108
164,-107
164,-106
164,-105
164,-104
164,-103
164,-102
164,-101
164,-100
164,-99
164,-98
164,-97
164,-96
164,-95
164,-94
164,-93
164,-92
164,-91
164,-90
164,-89
164,-88
164,-87
164,-86
164,-85
164,-84
164,-83
164,-82
164,-81
164,-80
164,-79
164,-78
164,-77
164,-76
164,-75
164,-74
164,-73
164,-72
164,-71
164,-70
164,-69
164,-68
164,-67
165,-117
165,-116
165,-115
165,-114
165,-113
165,-112
165,-111
165,-110
165,-109
165,-108
165,-107
165,-106
165,-105
165,-104
165,-103
165,-102
165,-101
165,-100
165,-99
165,-98
165,-97
165,-96
165,-95
165,-94
165,-93
165,-92
165,-91
165,-90
165,-89
165,-88
165,-87
165,-86
165,-85
165,-84
165,-83
165,-82
165,-81
165,-80
165,-79
165,-78
165,-77
165,-76
165,-75
165,-74
165,-73
165,-72
165,-71
165,-70
165,-69
165,-68
165,-67
166,-117
166,-116
166,-115
166,-114
166,-113
166,-112
166,-111
166,-110
166,-109
166,-108
166,-107
166,-106
166,-105
166,-104
166,-103
166,-102
166,-101
166,-100
166,-99
166,-98
166,-97
166,-96
166,-95
166,-94
166,-93
166,-92
166,-91
166,-90
166,-89
166,-88
166,-87
166,-86
166,-85
166,-84
166,-83
166,-82
166,-81
166,-80
166,-79
166,-78
166,-77
166,-76
166,-75
166,-74
166,-73
166,-72
166,-71
166,-70
166,-69
166,-68
166,-67
167,-117
167,-116
167,-115
167,-114
167,-113
167,-112
167,-111
167,-110
167,-109
167,-108
167,-107
167,-106
167,-105
167,-104
167,-103
167,-102
167,-101
167,-100
167,-99
167,-98
167,-97
167,-96
167,-95
167,-94
167,-93
167,-92
167,-91
167,-90
167,-89
167,-88
167,-87
167,-86
167,-85
167,-84
167,-83
167,-82
167,-81
167,-80
167,-79
167,-78
167,-77
167,-76
167,-75
167,-74
167,-73
167,-72
167,-71
167,-70
167,-69
167,-68
167,-67
168,-117
168,-116
168,-115
168,-114
168,-113
168,-112
168,-111
168,-110
168,-109
168,-108
168,-107
168,-106
168,-105
168,-104
168,-103
168,-102
168,-101
168,-100
168,-99
168,-98
168,-97
168,-96
168,-95
168,-94
168,-93
168,-92
168,-91
168,-90
168,-89
168,-88
168,-87
168,-86
168,-85
168,-84
168,-83
168,-82
168,-81
168,-80
168,-79
168,-78
168,-77
168,-76
168,-75
168,-74
168,-73
168,-72
168,-71
168,-70
168,-69
168,-68
168,-67
169,-117
169,-116
169,-115
169,-114
169,-113
169,-112
169,-111
169,-110
169,-109
169,-108
169,-107
169,-106
169,-105
169,-104
169,-103
169,-102
169,-101
169,-100
169,-99
169,-98
169,-97
169,-96
169,-95
169,-94
169,-93
169,-92
169,-91
169,-90
169,-89
169,-88
169,-87
169,-86
169,-85
169,-84
169,-83
169,-82
169,-81
169,-80
169,-79
169,-78
169,-77
169,-76
169,-75
169,-74
169,-73
169,-72
169,-71
169,-70
169,-69
169,-68
169,-67
170,-117
170,-116
170,-115
170,-114
170,-113
170,-112
170,-111
170,-110
170,-109
170,-108
170,-107
170,-106
170,-105
170,-104
170,-103
170,-102
170,-101
170,-100
170,-99
170,-98
170,-97
170,-96
170,-95
170,-94
170,-93
170,-92
170,-91
170,-90
170,-89
170,-88
170,-87
170,-86
170,-85
170,-84
170,-83
170,-82
170,-81
170,-80
170,-79
170,-78
170,-77
170,-76
170,-75
170,-74
170,-73
170,-72
170,-71
170,-70
170,-69
170,-68
170,-67
171,-117
171,-116
171,-115
171,-114
171,-113
171,-112
171,-111
171,-110
171,-109
171,-108
171,-107
171,-106
171,-105
171,-104
171,-103
171,-102
171,-101
171,-100
171,-99
171,-98
171,-97
171,-96
171,-95
171,-94
171,-93
171,-92
171,-91
171,-90
171,-89
171,-88
171,-87
171,-86
171,-85
171,-84
171,-83
171,-82
171,-81
171,-80
171,-79
171,-78
171,-77
171,-76
171,-75
171,-74
171,-73
171,-72
171,-71
171,-70
171,-69
171,-68
171,-67
172,-117
172,-116
172,-115
172,-114
172,-113
172,-112
172,-111
172,-110
172,-109
172,-108
172,-107
172,-106
172,-105
172,-104
172,-103
172,-102
172,-101
172,-100
172,-99
172,-98
172,-97
172,-96
172,-95
172,-94
172,-93
172,-92
172,-91
172,-90
172,-89
172,-88
172,-87
172,-86
172,-85
172,-84
172,-83
172,-82
172,-81
172,-80
172,-79
172,-78
172,-77
172,-76
172,-75
172,-74
172,-73
172,-72
172,-71
172,-70
172,-69
172,-68
172,-67
173,-117
173,-116
173,-115
173,-114
173,-113
173,-112
173,-111
173,-110
173,-109
173,-108
173,-107
173,-106
173,-105
173,-104
173,-103
173,-102
173,-101
173,-100
173,-99
173,-98
173,-97
173,-96
173,-95
173,-94
173,-93
173,-92
173,-91
173,-90
173,-89
173,-88
173,-87
173,-86
173,-85
173,-84
173,-83
173,-82
173,-81
173,-80
173,-79
173,-78
173,-77
173,-76
173,-75
173,-74
173,-73
173,-72
173,-71
173,-70
173,-69
173,-68
173,-67
174,-117
174,-116
174,-115
174,-114
174,-113
174,-112
174,-111
174,-110
174,-109
174,-108
174,-107
174,-106
174,-105
174,-104
174,-103
174,-102
174,-101
174,-100
174,-99
174,-98
174,-97
174,-96
174,-95
174,-94
174,-93
174,-92
174,-91
174,-90
174,-89
174,-88
174,-87
174,-86
174,-85
174,-84
174,-83
174,-82
174,-81
174,-80
174,-79
174,-78
174,-77
174,-76
174,-75
174,-74
174,-73
174,-72
174,-71
174,-70
174,-69
174,-68
174,-67
175,-117
175,-116
175,-115
175,-114
175,-113
175,-112
175,-111
175,-110
175,-109
175,-108
175,-107
175,-106
175,-105
175,-104
175,-103
175,-102
175,-101
175,-100
175,-99
175,-98
175,-97
175,-96
175,-95
175,-94
175,-93
175,-92
175,-91
175,-90
175,-89
175,-88
175,-87
175,-86
175,-85
175,-84
175,-83
175,-82
175,-81
175,-80
175,-79
175,-78
175,-77
175,-76
175,-75
175,-74
175,-73
175,-72
175,-71
175,-70
175,-69
175,-68
175,-67
176,-117
176,-116
176,-115
176,-114
176,-113
176,-112
176,-111
176,-110
176,-109
176,-108
176,-107
176,-106
176,-105
176,-104
176,-103
176,-102
176,-101
176,-100
176,-99
176,-98
176,-97
176,-96
176,-95
176,-94
176,-93
176,-92
176,-91
176,-90
176,-89
176,-88
176,-87
176,-86
176,-85
176,-84
176,-83
176,-82
176,-81
176,-80
176,-79
176,-78
176,-77
176,-76
176,-75
176,-74
176,-73
176,-72
176,-71
176,-70
176,-69
176,-68
176,-67
177,-117
177,-116
177,-115
177,-114
177,-113
177,-112
177,-111
177,-110
177,-109
177,-108
177,-107
177,-106
177,-105
177,-104
177,-103
177,-102
177,-101
177,-100
177,-99
177,-98
177,-97
177,-96
177,-95
177,-94
177,-93
177,-92
177,-91
177,-90
177,-89
177,-88
177,-87
177,-86
177,-85
177,-84
177,-83
177,-82
177,-81
177,-80
177,-79
177,-78
177,-77
177,-76
177,-75
177,-74
177,-73
177,-72
177,-71
177,-70
177,-69
177,-68
177,-67
178,-117
178,-116
178,-115
178,-114
178,-113
178,-112
178,-111
178,-110
178,-109
178,-108
178,-107
178,-106
178,-105
178,-104
178,-103
178,-102
178,-101
178,-100
178,-99
178,-98
178,-97
178,-96
178,-95
178,-94
178,-93
178,-92
178,-91
178,-90
178,-89
178,-88
178,-87
178,-86
178,-85
178,-84
178,-83
178,-82
178,-81
178,-80
178,-79
178,-78
178,-77
178,-76
178,-75
178,-74
178,-73
178,-72
178,-71
178,-70
178,-69
178,-68
178,-67
179,-117
179,-116
179,-115
179,-114
179,-113
179,-112
179,-111
179,-110
179,-109
179,-108
179,-107
179,-106
179,-105
179,-104
179,-103
179,-102
179,-101
179,-100
179,-99
179,-98
179,-97
179,-96
179,-95
179,-94
179,-93
179,-92
179,-91
179,-90
179,-89
179,-88
179,-87
179,-86
179,-85
179,-84
179,-83
179,-82
179,-81
179,-80
179,-79
179,-78
179,-77
179,-76
179,-75
179,-74
179,-73
179,-72
179,-71
179,-70
179,-69
179,-68
179,-67
180,-117
180,-116
180,-115
180,-114
180,-113
180,-112
180,-111
180,-110
180,-109
180,-108
180,-107
180,-106
180,-105
180,-104
180,-103
180,-102
180,-101
180,-100
180,-99
180,-98
180,-97
180,-96
180,-95
180,-94
180,-93
180,-92
180,-91
180,-90
180,-89
180,-88
180,-87
180,-86
180,-85
180,-84
180,-83
180,-82
180,-81
180,-80
180,-79
180,-78
180,-77
180,-76
180,-75
180,-74
180,-73
180,-72
180,-71
180,-70
180,-69
180,-68
180,-67
181,-117
181,-116
181,-115
181,-114
181,-113
181,-112
181,-111
181,-110
181,-109
181,-108
181,-107
181,-106
181,-105
181,-104
181,-103
181,-102
181,-101
181,-100
181,-99
181,-98
181,-97
181,-96
181,-95
181,-94
181,-93
181,-92
181,-91
181,-90
181,-89
181,-88
181,-87
181,-86
181,-85
181,-84
181,-83
181,-82
181,-81
181,-80
181,-79
181,-78
181,-77
181,-76
181,-75
181,-74
181,-73
181,-72
181,-71
181,-70
181,-69
181,-68
181,-67
182,-117
182,-116
182,-115
182,-114
182,-113
182,-112
182,-111
182,-110
182,-109
182,-108
182,-107
182,-106
182,-105
182,-104
182,-103
182,-102
182,-101
182,-100
182,-99
182,-98
182,-97
182,-96
182,-95
182,-94
182,-93
182,-92
182,-91
182,-90
182,-89
182,-88
182,-87
182,-86
182,-85
182,-84
182,-83
182,-82
182,-81
182,-80
182,-79
182,-78
182,-77
182,-76
182,-75
182,-74
182,-73
182,-72
182,-71
182,-70
182,-69
182,-68
182,-67
`.trim().split('\n').filter(Boolean).sort();
    const solver = new Solver('target area: x=155..182, y=-117..-67');
    expect(solver.part2()).toEqual(2313);
    solver.part2();
    const result = [...solver.state.shotsP2].sort();
    expect(result).toEqual(expected);
  });
});
