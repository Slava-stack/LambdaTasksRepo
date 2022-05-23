x = input()

def add_dots(x):
    final = []
    if len(x) <= 1:
        return x
    else:
        for i in add_dots(x[1:]):
            final.append(x[0] + i)
            final.append(x[0] + "." + i)
        return final

print(sorted(add_dots(x), key=lambda x: len(x)))
