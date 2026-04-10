L = []
a = L.append

a('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>WorkWave - Find Your Next Opportunity</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"><script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>')

print('head ok')
with open('C:/Users/majid/Desktop/WorkWave/head_test.html','w') as f:
    f.write('\n'.join(L))
print('head written')