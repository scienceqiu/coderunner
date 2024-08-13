def solve():
  import sys
    input = sys.stdin.read
    data = input().split()
    n = int(data[0])
    array = list(map(int, data[1:n+1]))
    result = sum(array)
    print(result)
