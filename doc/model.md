# Faraday's Electromagnetic Lab - Model Description

@author Chris Malley (PixelZoom, Inc.)

This document is a high-level description of the model used in _Faraday's Electromagnetic Lab_.

It's assumed that the reader is familiar with Faraday's Law.

## Terminology

**B-field**: a synonym for magnetic field.

**Current amplitude**: A percentage with range [-1,1] that describes the amount of current relative to the 
maximum current that may be induced in the model. The sign indicates the direction 
of the current. View components use this value to determine how they should respond to induced current. 
For example, deflection of the voltmeter needle, brightness of the light bulb, and speed of
electrons.

## Abbreviations

* B: magnitude of the magnetic field vector (in gauss or tesla)
* B<sub>x</sub>: x component of B
* B<sub>y</sub>: y component of B
* θ: angle of the magnetic field vector (in radians)
* N: north
* S: south
* RPM: rotations per minute

# B-Field Producers

The B-field producers in the simulation are: `BarMagnet`, `Electromagnet`, and `Turbine`.

All magnets can provide the B-field vector at a point of interest, relative to the magnet’s location. 
In reality, the B- field decreases as a function of the distance cubed (exponent=3). But to make things look 
better in the simulation, we adjust the exponent. The compass grid and field meter both uses exponent=3. 
The `PickupCoil` uses exponent=2.

The `BarMagnet` is based on a dipole magnet.

The Electromagnet is based on a coil magnet model. It's voltage source can be either a DCPowerSupply or an ACPowerSupply. 
The strength of the B-field produced by the electromagnet is proportional to the amplitude of the voltage in the 
voltage source and the number of loop in the coil. The current in the coil is proportional to the
amplitude of the voltage source. Note that there is no model of resistance for the coil or voltage source.

The DC Power Supply (aka battery) is rather straightforward. It has a maximum voltage, and its voltage 
amplitude is varied by the user via a slider control.

The AC Power Supply has a configurable maximum voltage. The user varies the maximum voltage amplitude and 
frequency using sliders. The voltage amplitude varies over time.

The Turbine is based on the same dipole magnet model as the BarMagnet, and is in fact graphically represented
as a rotating bar magnet, attached to a water wheel. The pickup coil exerts a drag force on the turbine that 
is proportional to the number of loops and loop area of the pickup coil.

# B-Field Consumers

The B-field consumers in the simulation are: field visualization, Compass, FieldMeter, and PickupCoil.
They may be influenced by one magnet; there is no support for multiple magnets.

The field visualization displays the magnet field as a grid of compass needles. Each needle measures the 
field vector at the needle's position, and immediately aligns itself with the field vector's direction.
The opacity of each needle represents the field vector's magnitude. Because the field strength decreases 
as a function of the distance cubed from the magnet, we scale the magnitude to provide a better "look" 
for the visualization.

The Compass measures the field vector at its position. There are 3 behaviors, used in different
screens:
* **immediate**: The needle aligns with the field immediately. Used in the _Generator_ screen.
* **incremental**: The needle aligns with the field over time, until the change in angle is below a threshold, then
  aligns immediately. Used in the _Electromagnet_ and _Transformer_ screens.
* **kinematic**: Behaves like a real compass. The needle aligns with the field over time, and exhibits inertia, 
angular velocity, angular acceleration, and wobble. Used in the _Bar Magnet_ and _Pickup Coil_ screens.

The FieldMeter measures the field vector at its position, and displays the vector's magnitude, xy-components,
and angle.

The PickupCoil is the most complicated part of the model, and the place where Faraday’s Law is implemented. 
(We will not be describing Faraday’s Law here; consult your physics textbook.) The magnetic field is sampled
and averaged along a vertical line through the center of the coil. The average is used to compute the flux in 
one loop of the coil, then multiplied by the number of loops. The flux is measured over time. A change in 
flux induces an EMF, and the current amplitude is a function of the induced EMF. 

The PickupCoil can have one of two indicators attached to it: a Lightbulb or a Voltmeter. These indicators
react to the current amplitude in the coil The LightBulb’s intensity is proportional to the absolute value 
of the current amplitude. The Voltmeter’s needle deflection is proportional to the current amplitude, and 
uses an ah hoc algorithm that makes the needle wobble around the zero point.

---

Reuse description from doc/java-version/Physics_Implementation.pdf.

MathCAD for 1G bar magnet.

Pickup Coil models Faraday's Law. Induced EMF is used to derive current amplitude.

Electromagnet also sets current amplitude based on the type of power supply (DC or AC)
and the setting for the power supply (voltage, frequency).

Electrons in the pickup coil and electromagnet move based on current amplitude.

Light bulb and voltmeter respond to current amplitude in the pickup coil.
