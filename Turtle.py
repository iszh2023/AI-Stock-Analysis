import turtle
import time

import math
print(math.sqrt(5))
print(1.4142135623730951 ** 2)
exit()
win = turtle.Screen()
win.tracer(0)
t=turtle.Pen()
t.shape("turtle")
for i in range (45):
    t.fd(20)
    t.lt(2 * 4)
    print (i)
win.update()
input()