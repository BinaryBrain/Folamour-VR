import sys
from noise import pnoise2, snoise2

    # var map = [
    # [
    #   [1,1,1,1,1],
    #   [1,1,1,1,1],
    #   [1,1,1,1,1],
    #   [1,1,1,1,1],
    #   [1,1,1, , ],
    # ],
    # [ 
    #   [1,1,1,1,1],
    #   [1,1,1,1,1],
    #   [1,1, , , ],
    #   [ , , , , ],
    #   [ , , , , ]
    # ]
    # ];
octaves=20
freq=16.0*octaves
size=256
#Altitude discretization
def discretize(x):
    x=x+67
    if x<60:
        return 1
    if x<70:
        return 2
    if x<80:
        return 3
    if x<90:
        return 4
    return 5
alt={}
for y in range(size):
    for x in range(size):
        alt[(x,y)]=discretize(int(snoise2(x / freq, y / freq, octaves)*100))

#Generation tableau javascript
print "var map = ["
for i in range(0,5):
    print "[",
    for x in range(size):
        print "[",
        for y in range(size):
            altitude=alt[(x,y)]
            if altitude>i:
                print "1",
            else:
                print "",
            print ",",
        print "],\n"
    print "],\n"
print "];"
