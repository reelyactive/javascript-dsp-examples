javascript-dsp-examples
=======================

Examples of digital signal processing in pure JavaScript.  The code is adapted from [node-fft (fft-js)](https://github.com/vail-systems/node-fft/) and remains intended primarily for _example_ purposes as it is __not__ optimised for efficiency.


Examples
--------

Examples are provided in the /bin folder, each of which can be run with the command `npm run exampleName`.  Clone this repository and run the commands from its root folder.

### velocityOverall

Determine the velocity overall from a time series of acceleration samples.

    npm run velocityoverall

The velocity overall is calculated as follows:
- Remove any DC offset from the samples
- Split into (up to 4) non-overlapping time series of at least 256 samples
- Application of Hann window to each time series using `hannWindow(samples)`
- Conversion to frequency domain using `fft(samples, samplingRate)`
- Integration over each frequency bin to obtain velocities
- RMS of velocities using `rms(values)` divided by square root of Hann noise bandwidth
- Average of the (up to 4) overall velocities

Assuming acceleration samples are in m/s2 and the samplingRate is in Hz, the velocity overall will be in m/s.  Edit the parameters in [bin/velocityoverall](bin/velocityoverall) to test different scenarios.


dsp.js
------

The [lib/dsp.js](lib/dsp.js) file provides a JavaScript implementation of a Fast Fourier Transform (FFT), Hann window, and root mean square calculation.

### fft(samples, samplingRate)

Compute the Fast Fourier Transform of the given Array of samples captured at the given samplingRate (typically in Hz).  For example, [the original test case](https://github.com/vail-systems/node-fft/tree/master?tab=readme-ov-file#command-line) would be implemented as follows:

```javascript
const dsp = require('./lib/dsp.js'); // Edit path as required

let samples = [ 1, 1, 1, 1, 0, 0, 0, 0 ];
let samplingRate = 44100;

console.log(dsp.fft(samples, samplingRate));
// {
//   magnitudes: [ 4, 2.613125929752753, 0, 1.0823922002923938 ],
//   frequencies: [ 0, 5512.5, 11025, 16537.5 ],
//   numberOfBins: 4
// }
```

### hannWindow(samples)

Compute the Hann window of the given samples, returning the windowed samples as a new Array.

```javascript
const dsp = require('./lib/dsp.js'); // Edit path as required

let values = [ 1, -1, 1, -1, 1 ];

console.log(dsp.hannWindow(values));
// [ 0, -0.4999999999999999, 1, -0.5000000000000001, 0 ]
```


### rms(values)

Compute the root mean square of the given Array of values, for example:

```javascript
const dsp = require('./lib/dsp.js'); // Edit path as required

let values = [ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34 ];

console.log('The calculated RMS is', dsp.rms(values));
// The calculated RMS is 13.674794331177344
```


### dcOffset(values, offset)

Offset the given values by the given offset.  If no offset is provided, the mean of the values will be used as the offset, effectively removing any DC offset from the values.

The values can be either an Array of Numbers of an Array of Array.  In the latter case, the function will use self-recursion.

```javascript
const dsp = require('./lib/dsp.js'); // Edit path as required

let values = [ 1, -1, 1, -1, 1 ];

console.log(dsp.dcOffset(values, 1));
// [ 2, 0, 2, 0, 2 ]

values = [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ] ];

console.log(dsp.dcOffset(values));
// [ [ -0.5, 0.5 ], [ -0.5, 0.5 ], [ -0.5, 0.5 ] ]
```


### createPowerOfTwoLengthSubSamples(samples, minLength, maxNumberOfSubs)

Split the given samples into a set of subsamples, up to the given maximum number of subsamples, each of the given minimum length or a larger power of two, whichever is greater, for example:

```javascript
const dsp = require('./lib/dsp.js'); // Edit path as required

let samples = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];

console.log(dsp.createPowerOfTwoLengthSubSamples(samples, 2, 2));
// [ [ 0, 1, 2, 3 ], [ 6, 7, 8, 9 ] ]

console.log(dsp.createPowerOfTwoLengthSubSamples(samples, 2, 4));
// [ [ 0, 1 ], [ 3, 4 ], [ 6, 7 ], [ 9, 10 ] ]
```


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.


License
-------

MIT License

Copyright (c) 2025 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.