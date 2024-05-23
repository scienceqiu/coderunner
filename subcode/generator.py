import random

def generate_test_case():
  n = random.randint(1, 100)
  array = [random.randint(-1000, 1000) for _ in range(n)]
  input_data = f"{n}\n{' '.join(map(str, array))}\n"
  return input_data
  #This is a generator for a very easy problem, but change it for harder problems
