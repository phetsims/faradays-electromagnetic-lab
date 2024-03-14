# Faraday's Electromagnetic Lab - Model Description

@author Chris Malley (PixelZoom, Inc.)

This document is a high-level description of the model used in _Faraday's Electromagnetic Lab_.

It is assumed that the reader is familiar with Faraday's Law.

For the reader who is interested in code, references to specific JavaScript classes or methods 
are provided, e.g. `BarMagnet`.  Code can be found [here](https://github.com/phetsims/faradays-electromagnetic-lab/tree/main/js).

## Terminology

**B-field**: a synonym for magnetic field.

**Current amplitude**: A percentage with range [-1,1] that describes the amount of current relative to the 
maximum current that may be induced in the model. The sign indicates the direction 
of the current. View components use this value to determine how they should respond to induced current. 
For example, deflection of the voltmeter needle, brightness of the light bulb, and speed of
electrons.

## Symbols

These symbols appear in the user interface:

* B: magnitude of the magnetic field vector (in gauss or tesla)
* B<sub>x</sub>: x component of B
* B<sub>y</sub>: y component of B
* θ: angle of the magnetic field vector (in radians)
* N: north
* S: south
* RPM: rotations per minute

# B-Field Producers

The B-field producers in the simulation are: bar magnet, electromagnet, and turbine.

### Bar Magnet
The bar magnet (see `BarMagnet`) is based on a dipole magnet model. It is not feasible to implement a numerical model of a bar magnet's 
B-field directly, as it relies on double integrals. So the bar magnet was modeled in MathCAD as a horizontal cylinder
with strength 1G, and MathCAD was used to create 3 grids of discrete, evenly-spaced B-field vectors. Those grids 
(see `BarMagnetFieldGrid`) are:
- internal: field internal to the magnet
- external-near: field near the magnet
- external-far: field far from the magnet

When measuring a the B-field at a point relative to the magnet, the resulting vector is an interpolation between 
points in these grids, scaled to match the strength of the bar magnet.

### Electromagnet
The electromagnet (see `Electromagnet`) is based on a coil magnet model. It's voltage source can be either a DC or AC power supply. 
The strength of the B-field produced by the electromagnet is proportional to the amplitude of the voltage in the 
voltage source and the number of loops in the coil. (The diameter of the loops is fixed.) The current amplitude in the coil 
is proportional to the amplitude of the voltage source. Note that there is no model of resistance for the coil or voltage source.

The DC power supply (aka battery) has a maximum voltage, and its voltage 
amplitude and polarity is varied by the user via a slider control. See `DCPowerSuply`.

The AC Power Supply has a configurable maximum voltage. The user varies the maximum voltage amplitude and 
frequency using sliders. The voltage amplitude varies over time. See `ACPowerSupply`.

Electrons in the electromagnet's coil move at a speed and direction that is proportional to the current amplitude in
the coil. More current results in faster speed.  A change in polarity of the magnet results in change in direction
of the electrons.

### Turbine
The turbine (see `Turbine`) is based on the same dipole magnet model as the bar magnet, and is represented
as a rotating bar magnet, attached to a water wheel. Water flowing from a faucet turns the wheel.  
The pickup coil exerts a drag force on the turbine that is proportional to the number of loops and loop area 
of the pickup coil.

# B-Field Consumers

The B-field consumers in the simulation are: B-field visualization, compass, fieldMeter, and pickupCoil.
They may be influenced by one magnet; there is no support for multiple magnets.

### B-Field Visualization
The B-field visualization (see `FieldNode`) displays the magnetic field as a grid of compass needles. Each needle measures the 
field vector at the needle's position, and immediately aligns itself with the field vector's direction.
The opacity of each needle represents the field vector's magnitude. Because the field strength decreases 
as a function of the distance cubed from the magnet, we scale the magnitude to provide a better "look" 
for the visualization. See `FieldNode.normalizeMagnitude`.

### Compass
The compass (see `Compass`) measures the field vector at its position. There are 3 behaviors, used in different
screens:
* **immediate**: The needle aligns with the field immediately. Used in the _Generator_ screen.
* **incremental**: The needle aligns with the field over time, until the change in angle is below a threshold, then
  aligns immediately. Used in the _Electromagnet_ and _Transformer_ screens.
* **kinematic**: Behaves like a real compass. The needle aligns with the field over time, and exhibits inertia, 
angular velocity, angular acceleration, and wobble. Used in the _Bar Magnet_ and _Pickup Coil_ screens.

### Field Meter
The field meter (see `FieldMeter`) measures the field vector at the position of its crosshair, and displays the 
vector's magnitude, xy-components, and angle. Units can be switched between G (gauss) and T (tesla) via the 
Preferences dialog.

### Pickup Coil
The pickup coil (see `PickupCoil`) is the most complicated part of the model, and implements Faraday’s Law. 
The magnetic field is sampled
and averaged along a vertical line through the center of the coil. The average is used to compute the flux in 
one loop of the coil, then multiplied by the number of loops. The flux is measured over time. A change in 
flux induces an EMF, and the current amplitude is a function of the induced EMF. 

The PickupCoil can have one of two indicators attached to it: a Lightbulb or a Voltmeter. These indicators
react to the current amplitude in the coil The LightBulb’s intensity is proportional to the absolute value 
of the current amplitude. The Voltmeter’s needle deflection is proportional to the current amplitude, and 
uses an ah hoc algorithm that makes the needle wobble around the zero point.

Similar to the electromagnet coil, electrons in the pickup coil react to the current amplitude in the coil.
More current results in faster speed.  A change in polarity of the magnet field results in change in direction
of the electrons.
