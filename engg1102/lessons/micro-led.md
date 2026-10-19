# Micro LED
 Add this line for tutorial demo 
## Toggle an LED

Drag the code to toggle an LED
```blocks
basic.forever(function () {
    led.toggle(0,0)
})
```
## Randomize x

Drag the code to pick a random "x" index
between ``0`` and ``4``
```blocks
basic.forever(function () {
    led.toggle(randint(0, 4), 0))
})
```

## Randomize y

Drag the code to pick a random "y" index
between ``0`` and ``4``


##All the code 
```blocks
basic.forever(function () {
    led.toggle(0, randint(0, 4))
})
```